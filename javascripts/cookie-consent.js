(function () {
  var STORAGE_KEY = "bridge_cookie_consent_v1";
  var ANALYTICS_ENABLED_KEY = "bridge_cookie_consent_analytics";
  var POLICY_URL = "/about/cookies-policy/";

  function readConsent() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }

  function writeConsent(choice, analyticsEnabled) {
    var payload = {
      choice: choice || "custom",
      analytics: Boolean(analyticsEnabled),
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(ANALYTICS_ENABLED_KEY, String(Boolean(analyticsEnabled)));
    } catch (error) {
      console && console.warn && console.warn("cookie consent storage failed", error);
    }

    window.BridgeCookieConsent = {
      choice: payload.choice,
      analyticsEnabled: payload.analytics,
      hasConsent: true,
      isAnalyticsEnabled: function () {
        return payload.analytics;
      },
      saveConsent: function (nextChoice, nextAnalyticsEnabled) {
        writeConsent(nextChoice, nextAnalyticsEnabled);
      },
    };
  }

  function getStoredAnalyticsEnabled() {
    try {
      var value = localStorage.getItem(ANALYTICS_ENABLED_KEY);
      if (value === "true") return true;
      if (value === "false") return false;
    } catch (error) {
      return false;
    }

    var consent = readConsent();
    if (consent && typeof consent.analytics === "boolean") {
      return consent.analytics;
    }

    return false;
  }

  function isAnalyticsEnabled() {
    return getStoredAnalyticsEnabled();
  }

  function showBanner() {
    if (document.querySelector(".cookie-consent")) return;

    var banner = document.createElement("div");
    banner.className = "cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");

    var panel = document.createElement("div");
    panel.className = "cookie-consent__panel";

    var title = document.createElement("h2");
    title.className = "cookie-consent__title";
    title.textContent = "Cookie 同意";

    var text = document.createElement("p");
    text.className = "cookie-consent__text";
    text.innerHTML = '我们使用 Cookie 来分析网站使用情况，以改善您的浏览体验。点击<strong>“接受全部 Cookie”</strong>后，即表示您同意在设备上存储 Cookie，以提升站点导航、分析访问情况并支持相关营销与站点优化。您也可以点击<strong>自定义</strong>来拒绝非必要 Cookie，或调整希望启用的 Cookie 类型。<a href="' + POLICY_URL + '" rel="noreferrer noopener">阅读我们的 Cookie 政策</a>。';

    var preferenceBlock = document.createElement("div");
    preferenceBlock.className = "cookie-consent__customize";
    preferenceBlock.hidden = true;

    var checkboxRow = document.createElement("label");
    checkboxRow.className = "cookie-consent__option";
    checkboxRow.innerHTML = '<input type="checkbox" checked disabled> <span>Required cookies</span>';

    var analyticsRow = document.createElement("label");
    analyticsRow.className = "cookie-consent__option";
    analyticsRow.innerHTML = '<input type="checkbox" checked> <span>Analytics cookies</span>';

    preferenceBlock.appendChild(checkboxRow);
    preferenceBlock.appendChild(analyticsRow);

    var buttonRow = document.createElement("div");
    buttonRow.className = "cookie-consent__actions";

    var rejectButton = document.createElement("button");
    rejectButton.type = "button";
    rejectButton.className = "cookie-consent__button cookie-consent__button--secondary";
    rejectButton.textContent = "拒绝全部";
    rejectButton.addEventListener("click", function () {
      writeConsent("rejected", false);
      banner.remove();
    });

    var customizeButton = document.createElement("button");
    customizeButton.type = "button";
    customizeButton.className = "cookie-consent__button cookie-consent__button--tertiary";
    customizeButton.textContent = "自定义";
    customizeButton.setAttribute("aria-expanded", "false");
    customizeButton.addEventListener("click", function () {
      var expanded = preferenceBlock.hidden;
      preferenceBlock.hidden = !expanded;
      customizeButton.setAttribute("aria-expanded", String(expanded));
    });

    var acceptButton = document.createElement("button");
    acceptButton.type = "button";
    acceptButton.className = "cookie-consent__button cookie-consent__button--primary";
    acceptButton.textContent = "接受全部 Cookie";
    acceptButton.addEventListener("click", function () {
      writeConsent("accepted", true);
      banner.remove();
    });

    var saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "cookie-consent__button cookie-consent__button--primary cookie-consent__button--save";
    saveButton.textContent = "保存设置";
    saveButton.addEventListener("click", function () {
      var analyticsEnabled = !!analyticsRow.querySelector("input").checked;
      writeConsent("custom", analyticsEnabled);
      banner.remove();
    });

    buttonRow.appendChild(rejectButton);
    buttonRow.appendChild(customizeButton);
    buttonRow.appendChild(saveButton);
    buttonRow.appendChild(acceptButton);

    panel.appendChild(title);
    panel.appendChild(text);
    panel.appendChild(preferenceBlock);
    panel.appendChild(buttonRow);

    banner.appendChild(panel);
    document.body.appendChild(banner);
  }

  function initConsent() {
    var consent = readConsent();
    var choice = consent && consent.choice;

    if (!choice) {
      showBanner();
      return;
    }

    writeConsent(choice, Boolean(consent.analytics));
  }

  window.BridgeCookieConsent = {
    hasConsent: !!readConsent(),
    isAnalyticsEnabled: isAnalyticsEnabled,
    saveConsent: function (nextChoice, nextAnalyticsEnabled) {
      writeConsent(nextChoice, nextAnalyticsEnabled);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent, { once: true });
  } else {
    initConsent();
  }
})();
