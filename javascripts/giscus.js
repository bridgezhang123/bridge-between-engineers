(function () {
  var REPOSITORY = "bridgezhang123/bridge-between-engineers";
  var REPOSITORY_ID = "R_kgDORnVXEg";
  var CATEGORY = "Announcements";
  var CATEGORY_ID = "DIC_kwDORnVXEs4DLFTm";
  var GISCUS_ORIGIN = "https://giscus.app";

  function getTheme() {
    return document.body.getAttribute("data-md-color-scheme") === "slate"
      ? "dark"
      : "light";
  }

  function mountComments() {
    var content = document.querySelector(".md-content__inner");
    if (!content || content.querySelector(".site-comments")) return;

    var section = document.createElement("section");
    section.className = "site-comments";
    section.id = "comments";

    var heading = document.createElement("h2");
    heading.textContent = "评论与建议";

    var description = document.createElement("p");
    description.className = "site-comments__description";
    description.textContent =
      "欢迎分享对本文的补充、疑问或建议。评论公开显示，发表评论需使用 GitHub 账号。";

    var container = document.createElement("div");
    container.className = "giscus";

    var error = document.createElement("p");
    error.className = "site-comments__error";
    error.hidden = true;
    error.textContent =
      "评论加载失败。您可以直接前往 GitHub Discussions 留言。";

    var discussionLink = document.createElement("a");
    discussionLink.href =
      "https://github.com/" + REPOSITORY + "/discussions/categories/announcements";
    discussionLink.textContent = "打开 GitHub Discussions";
    discussionLink.target = "_blank";
    discussionLink.rel = "noopener noreferrer";
    error.appendChild(document.createTextNode(" "));
    error.appendChild(discussionLink);

    section.appendChild(heading);
    section.appendChild(description);
    section.appendChild(container);
    section.appendChild(error);
    content.appendChild(section);

    var script = document.createElement("script");
    script.src = GISCUS_ORIGIN + "/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.repo = REPOSITORY;
    script.dataset.repoId = REPOSITORY_ID;
    script.dataset.category = CATEGORY;
    script.dataset.categoryId = CATEGORY_ID;
    script.dataset.mapping = "pathname";
    script.dataset.strict = "0";
    script.dataset.reactionsEnabled = "1";
    script.dataset.emitMetadata = "0";
    script.dataset.inputPosition = "bottom";
    script.dataset.theme = getTheme();
    script.dataset.lang = "zh-CN";
    script.addEventListener("error", function () {
      error.hidden = false;
    });

    container.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountComments, { once: true });
  } else {
    mountComments();
  }
})();
