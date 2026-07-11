"""Add the repository logo as a reusable image watermark.

Examples:
    python scripts/add_watermark.py docs/images/docs_manufacturing/example.jpeg
    python scripts/add_watermark.py docs/images/docs_manufacturing --recursive --in-place
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LOGO = REPO_ROOT / "docs" / "images" / "logo.png"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def parse_position(value: str) -> tuple[str, str]:
    parts = value.lower().replace("_", "-").split("-")
    if len(parts) != 2:
        raise argparse.ArgumentTypeError(
            "Position must look like top-left, top-right, bottom-left, or bottom-right."
        )

    vertical, horizontal = parts
    if vertical not in {"top", "bottom"} or horizontal not in {"left", "right"}:
        raise argparse.ArgumentTypeError(
            "Position must look like top-left, top-right, bottom-left, or bottom-right."
        )
    return vertical, horizontal


def iter_images(path: Path, recursive: bool) -> list[Path]:
    if path.is_file():
        return [path]

    globber = path.rglob if recursive else path.glob
    return sorted(
        item
        for item in globber("*")
        if item.is_file() and item.suffix.lower() in SUPPORTED_EXTENSIONS
    )


def output_path_for(source: Path, output: Path | None, in_place: bool) -> Path:
    if in_place:
        return source
    if output is None:
        return source.with_name(f"{source.stem}-watermarked{source.suffix}")
    if output.suffix:
        return output
    return output / source.name


def fit_logo(logo: Image.Image, base_size: tuple[int, int], width_ratio: float) -> Image.Image:
    base_width, _ = base_size
    target_width = max(1, round(base_width * width_ratio))
    ratio = target_width / logo.width
    target_height = max(1, round(logo.height * ratio))
    return logo.resize((target_width, target_height), Image.Resampling.LANCZOS)


def apply_opacity(image: Image.Image, opacity: float) -> Image.Image:
    alpha = image.getchannel("A")
    alpha = alpha.point(lambda pixel: round(pixel * opacity))
    image.putalpha(alpha)
    return image


def paste_position(
    base_size: tuple[int, int],
    watermark_size: tuple[int, int],
    position: tuple[str, str],
    margin_ratio: float,
) -> tuple[int, int]:
    base_width, base_height = base_size
    watermark_width, watermark_height = watermark_size
    margin = max(0, round(min(base_width, base_height) * margin_ratio))
    vertical, horizontal = position

    x = margin if horizontal == "left" else base_width - watermark_width - margin
    y = margin if vertical == "top" else base_height - watermark_height - margin
    return max(0, x), max(0, y)


def add_background(
    layer: Image.Image,
    xy: tuple[int, int],
    watermark_size: tuple[int, int],
    padding_ratio: float,
    opacity: float,
) -> None:
    if opacity <= 0:
        return

    base_width, base_height = layer.size
    watermark_width, watermark_height = watermark_size
    padding = max(0, round(min(base_width, base_height) * padding_ratio))
    x, y = xy
    box = (
        max(0, x - padding),
        max(0, y - padding),
        min(base_width, x + watermark_width + padding),
        min(base_height, y + watermark_height + padding),
    )
    radius = max(0, round(padding * 0.75))
    fill = (255, 255, 255, round(255 * opacity))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=radius, fill=fill)


def add_watermark(
    source: Path,
    destination: Path,
    logo_path: Path,
    position: tuple[str, str],
    width_ratio: float,
    opacity: float,
    margin_ratio: float,
    background_opacity: float,
    background_padding_ratio: float,
    quality: int,
) -> None:
    with Image.open(source) as base_image, Image.open(logo_path) as logo_image:
        base_image = ImageOps.exif_transpose(base_image)
        original_format = base_image.format
        base = base_image.convert("RGBA")
        logo = fit_logo(logo_image.convert("RGBA"), base.size, width_ratio)
        logo = apply_opacity(logo, opacity)
        xy = paste_position(base.size, logo.size, position, margin_ratio)

        layer = Image.new("RGBA", base.size, (255, 255, 255, 0))
        add_background(layer, xy, logo.size, background_padding_ratio, background_opacity)
        layer.paste(logo, xy, logo)
        merged = Image.alpha_composite(base, layer)

        destination.parent.mkdir(parents=True, exist_ok=True)
        suffix = destination.suffix.lower()
        if suffix in {".jpg", ".jpeg"}:
            merged = merged.convert("RGB")
            merged.save(destination, format="JPEG", quality=quality, optimize=True)
        elif suffix == ".png":
            merged.save(destination, format="PNG", optimize=True)
        elif suffix == ".webp":
            merged.save(destination, format="WEBP", quality=quality)
        else:
            merged.save(destination, format=original_format)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Add docs/images/logo.png as a watermark to one image or a folder of images."
    )
    parser.add_argument("input", type=Path, help="Image file or folder to process.")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output file or folder. Defaults to INPUT-stem-watermarked.ext.",
    )
    parser.add_argument("--logo", type=Path, default=DEFAULT_LOGO, help="Watermark logo path.")
    parser.add_argument(
        "--position",
        type=parse_position,
        default=parse_position("top-left"),
        help="Watermark position: top-left, top-right, bottom-left, bottom-right.",
    )
    parser.add_argument("--width-ratio", type=float, default=0.16, help="Logo width as image width ratio.")
    parser.add_argument("--opacity", type=float, default=0.72, help="Logo opacity from 0 to 1.")
    parser.add_argument("--margin-ratio", type=float, default=0.025, help="Margin as image short-edge ratio.")
    parser.add_argument(
        "--background-opacity",
        type=float,
        default=0,
        help="Optional white background opacity behind the logo, from 0 to 1.",
    )
    parser.add_argument(
        "--background-padding-ratio",
        type=float,
        default=0.006,
        help="Optional background padding as image short-edge ratio.",
    )
    parser.add_argument("--quality", type=int, default=92, help="JPEG/WebP quality from 1 to 100.")
    parser.add_argument("--recursive", action="store_true", help="Process folders recursively.")
    parser.add_argument("--in-place", action="store_true", help="Overwrite input image files.")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if not args.input.exists():
        parser.error(f"Input does not exist: {args.input}")
    if not args.logo.exists():
        parser.error(f"Logo does not exist: {args.logo}")
    if args.in_place and args.output:
        parser.error("--in-place cannot be combined with --output.")
    if not 0 < args.width_ratio <= 1:
        parser.error("--width-ratio must be greater than 0 and no more than 1.")
    if not 0 <= args.opacity <= 1:
        parser.error("--opacity must be between 0 and 1.")
    if not 0 <= args.margin_ratio <= 0.5:
        parser.error("--margin-ratio must be between 0 and 0.5.")
    if not 0 <= args.background_opacity <= 1:
        parser.error("--background-opacity must be between 0 and 1.")
    if not 0 <= args.background_padding_ratio <= 0.5:
        parser.error("--background-padding-ratio must be between 0 and 0.5.")
    if not 1 <= args.quality <= 100:
        parser.error("--quality must be between 1 and 100.")

    images = iter_images(args.input, args.recursive)
    if not images:
        parser.error(f"No supported images found in: {args.input}")

    if args.output and len(images) > 1 and args.output.suffix:
        parser.error("When processing multiple images, --output must be a folder.")

    for image_path in images:
        destination = output_path_for(image_path, args.output, args.in_place)
        add_watermark(
            image_path,
            destination,
            args.logo,
            args.position,
            args.width_ratio,
            args.opacity,
            args.margin_ratio,
            args.background_opacity,
            args.background_padding_ratio,
            args.quality,
        )
        print(f"{image_path} -> {destination}")


if __name__ == "__main__":
    main()
