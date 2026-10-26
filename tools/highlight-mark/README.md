# Markdown Editing Commands

This local VS Code extension provides Markdown editing commands.

## Highlight Mark

- Select text in a Markdown file.
- Right-click and choose **Highlight Mark: Toggle Selection**.
- Or press `Ctrl+Alt+H`.

Running the command again on a selection that already includes `<mark>` and `</mark>` removes those tags.

## Admonitions

- Select text in a Markdown file.
- Right-click and choose **Admonitions**, then select a type such as **Note**, **Tip**, or **Warning**.
- The selected text is placed in the body of a Material for MkDocs admonition, with the required four-space indentation.

Supported types: `note`, `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, and `quote`.

For example, selecting `Remember this detail.` and choosing **Admonitions > Note** inserts:

```markdown
!!! note

    Remember this detail.
```

Admonitions are block-level Markdown. When only part of a paragraph is selected, the command separates that selection into its own block and keeps the surrounding text.

## Insert Figures

- Place the cursor in a Markdown file and right-click **Insert Figures**.
- Choose **Single Figure** to select one image, or **Two Parallel** to select exactly two images in the file picker.
- The extension inserts a figure block at the cursor, creates image alt text and captions from the filename suffix after its last underscore (or the full filename if there is no suffix), and calculates image paths relative to the Markdown file.
- Image paths containing spaces or other special characters are URL-encoded. Figure image width defaults to `720`.
- The folder containing the most recently selected image is remembered for the next image picker.

The generated two-image block uses the `two-parallel-figures-grid` class. The repository's MkDocs stylesheet displays it in two columns on larger screens and one column on narrow screens.

## Install in VS Code

From the repository root, run:

```powershell
code --install-extension .\tools\highlight-mark
```

Then reload VS Code. The extension is intentionally kept in the repository so it can be installed again on another development machine.