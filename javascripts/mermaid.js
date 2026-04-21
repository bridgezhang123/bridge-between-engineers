document$.subscribe(() => {
  if (typeof mermaid === "undefined") return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose"
  });

  // Find code blocks that represent mermaid diagrams.
  // MkDocs and various highlighters may emit different structures:
  // - <pre class="mermaid">...
  // - <pre><code class="language-mermaid">...</code></pre>
  // - <pre><code>mindmap\n ...</code></pre>
  const candidates = Array.from(document.querySelectorAll('pre, pre code'));
  candidates.forEach((node) => {
    try {
      let codeEl = null;
      if (node.tagName.toLowerCase() === 'pre') {
        // <pre><code> or <pre class="mermaid">
        if (node.classList.contains('mermaid')) {
          codeEl = node;
        } else if (node.firstElementChild && node.firstElementChild.tagName.toLowerCase() === 'code') {
          codeEl = node.firstElementChild;
        } else {
          // fallback: treat pre as code container
          codeEl = node;
        }
      } else if (node.tagName.toLowerCase() === 'code') {
        codeEl = node;
      }

      if (!codeEl) return;
      const text = (codeEl.textContent || '').trim();
      const cls = (codeEl.className || '').toLowerCase();
      const looksLikeMermaid = cls.includes('language-mermaid') || cls.includes('lang-mermaid') || codeEl.classList.contains('mermaid') || text.startsWith('graph') || text.startsWith('mindmap') || text.startsWith('flowchart') || text.startsWith('sequence') || text.startsWith('gantt');
      if (!looksLikeMermaid) return;

      const parent = codeEl.tagName.toLowerCase() === 'pre' ? codeEl.parentElement : codeEl.parentElement;
      if (!parent) return;

      const graph = document.createElement('div');
      graph.className = 'mermaid';
      graph.textContent = text;
      // replace the outer pre (or code) with the graph container
      if (codeEl.tagName.toLowerCase() === 'code' && codeEl.parentElement && codeEl.parentElement.tagName.toLowerCase() === 'pre') {
        codeEl.parentElement.replaceWith(graph);
      } else {
        codeEl.replaceWith(graph);
      }
    } catch (e) {
      console.error('mermaid replacement error', e);
    }
  });

  // Render all mermaid diagrams
  try {
    mermaid.run({ querySelector: '.mermaid' });
  } catch (e) {
    console.error('mermaid.run failed', e);
  }
});
