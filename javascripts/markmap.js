document.addEventListener("DOMContentLoaded", () => {
  if (!window.markmap) return;

  const { Markmap, Transformer } = window.markmap;
  const transformer = new Transformer();

  document.querySelectorAll("pre code.language-markmap").forEach((el) => {
    const text = el.textContent;

    try {
      const { root } = transformer.transform(text);

      const svg = document.createElement("svg");
      svg.style.width = "100%";
      svg.style.height = "500px";

      el.parentElement.replaceWith(svg);

      Markmap.create(svg, {
        autoFit: true,
        duration: 300,
      }, root);
    } catch (err) {
      console.error("Markmap render error:", err);
    }
  });
});
