document.addEventListener("DOMContentLoaded", function() {
  try {
    var sourceFile = document.querySelector(".md-source-file");
    if (!sourceFile) return;

    var path = window.location.pathname || "/";
    var pageView = document.createElement("span");
    pageView.className = "md-source-file__fact";
    pageView.setAttribute("aria-live", "polite");
    pageView.hidden = true;

    var icon = document.createElement("span");
    icon.className = "md-icon";
    icon.title = "浏览量";
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9a3 3 0 0 0 0 6 3 3 0 0 0 0-6m0 8a5 5 0 0 1-5-5c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5"/></svg>';

    var text = document.createElement("span");

    pageView.appendChild(icon);
    pageView.appendChild(text);
    sourceFile.appendChild(pageView);

    fetch("/api/pageview", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ path: path }),
      cache: "no-store",
      keepalive: true,
    })
      .then(function(response) {
        if (!response.ok) throw new Error("pageview request failed");
        return response.json();
      })
      .then(function(data) {
        var views = Number(data && data.views);
        if (!Number.isFinite(views) || views < 0) throw new Error("invalid pageview value");

        text.textContent = "浏览量 " + views.toLocaleString("zh-CN");
        pageView.hidden = false;
      })
      .catch(function() {
        pageView.remove();
      });
  } catch (e) {
    console && console.warn && console.warn("pageviews failed", e);
  }
});
