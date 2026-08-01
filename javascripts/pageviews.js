document.addEventListener("DOMContentLoaded", function() {
  try {
    var footer = document.querySelector(".md-footer");
    var copyright = footer && footer.querySelector(".md-copyright");
    if (!copyright) return;

    var path = window.location.pathname || "/";
    var pageView = document.createElement("span");
    pageView.className = "site-footer-pageviews";
    pageView.setAttribute("aria-live", "polite");

    var text = document.createElement("span");
    text.className = "site-footer-pageviews__text";
    text.textContent = "浏览量统计中";

    pageView.appendChild(text);
    copyright.appendChild(pageView);

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
        pageView.classList.add("is-visible");
      })
      .catch(function() {
        pageView.remove();
      });
  } catch (e) {
    console && console.warn && console.warn("pageviews failed", e);
  }
});

