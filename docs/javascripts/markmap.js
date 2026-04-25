document.addEventListener("DOMContentLoaded", () => {
  if (!window.markmap) return;

  const { Markmap, Transformer } = window.markmap;
  const transformer = new Transformer();

  // Material for MkDocs renders fenced blocks as:
  // <pre class="language-xxx"><code>...</code></pre>
  // but other highlighters may put the class on <code>.
  const blocks = document.querySelectorAll(
    "pre.language-markmap, pre code.language-markmap",
  );

  blocks.forEach((block) => {
    const pre = block.tagName.toLowerCase() === "pre" ? block : block.closest("pre");
    if (!pre) return;

    const code = pre.querySelector("code");
    const text = (code || pre).textContent || "";

    try {
      const { root } = transformer.transform(text);

      const svg = document.createElement("svg");
      svg.style.width = "100%";
      svg.style.height = "500px";

      pre.replaceWith(svg);

      Markmap.create(
        svg,
        {
          autoFit: true,
          duration: 300,
        },
        root,
      );
    } catch (err) {
      console.error("Markmap render error:", err);
    }
  });
});
