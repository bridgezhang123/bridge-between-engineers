(() => {
  const DEBUG = () => {
    try {
      return window.localStorage && window.localStorage.getItem("markmap-debug") === "1";
    } catch {
      return false;
    }
  };

  const log = (...args) => {
    if (DEBUG()) console.log("[markmap]", ...args);
  };

  const warn = (...args) => {
    if (DEBUG()) console.warn("[markmap]", ...args);
  };

  const render = () => {
    const mm = window.markmap;
    if (!mm) {
      warn("window.markmap missing (scripts not loaded yet?)");
      return;
    }

    const { Markmap, Transformer } = mm;
    if (!Markmap || !Transformer) {
      warn("markmap globals present but missing Markmap/Transformer", { Markmap, Transformer });
      return;
    }

    const blocks = document.querySelectorAll(
      "pre.language-markmap, pre code.language-markmap",
    );
    log("found blocks:", blocks.length);

    blocks.forEach((block) => {
      const pre = block.tagName.toLowerCase() === "pre" ? block : block.closest("pre");
      if (!pre) return;
      if (pre.dataset && pre.dataset.markmapRendered === "1") return;

      const code = pre.querySelector("code");
      const text = (code || pre).textContent || "";

      try {
        const transformer = new Transformer();
        const { root } = transformer.transform(text);

        const svg = document.createElement("svg");
        svg.style.width = "100%";
        svg.style.height = "520px";

        // Keep wrapper structure stable; only swap the <pre>.
        pre.replaceWith(svg);

        Markmap.create(
          svg,
          {
            autoFit: true,
            duration: 300,
          },
          root,
        );

        // Mark rendered on the SVG's previous spot; also helps on instant navigation.
        svg.dataset.markmapRendered = "1";
      } catch (err) {
        console.error("Markmap render error:", err);
      }
    });
  };

  // Initial load
  document.addEventListener("DOMContentLoaded", render);

  // Material for MkDocs instant navigation support (AJAX page swaps)
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => render());
  }

  // Best-effort retry in case external scripts are late
  setTimeout(render, 250);
  setTimeout(render, 1000);
})();

