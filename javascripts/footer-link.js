document.addEventListener("DOMContentLoaded", function() {
  try {
    var footer = document.querySelector('.md-footer');
    if (!footer) return;

    footer.querySelectorAll('.site-footer-extra-link').forEach(function(existingLink) {
      existingLink.remove();
    });

    var copyright = footer.querySelector('.md-copyright');
    var copyrightHighlight = footer.querySelector('.md-copyright__highlight');

    if (copyright && copyrightHighlight) {
      var filingLink = document.createElement('a');
      filingLink.href = '/about/#filing';
      filingLink.setAttribute('aria-label', '关于备案');
      filingLink.className = 'site-footer-extra-link site-footer-filing-link';
      filingLink.textContent = '关于备案';
      copyrightHighlight.insertAdjacentElement('afterend', filingLink);
    }

    var links = Array.from(footer.querySelectorAll('.md-social__link'));
    var bilibiliLink = links.find(function(link) {
      var href = (link.getAttribute('href') || '').toLowerCase();
      return href.includes('b23.tv') || href.includes('bilibili.com');
    });

    function createFooterLink(href, label, iconText, extraClass) {
      var link = document.createElement('a');
      link.href = href;
      link.setAttribute('aria-label', label);
      link.className = 'md-social__link site-footer-extra-link ' + extraClass;
      link.innerHTML = '<span class="site-footer-extra-icon" aria-hidden="true">' + iconText + '</span><span class="site-footer-extra-text">' + label + '</span>';
      return link;
    }

    var copyrightLink = createFooterLink('/about/collaboration/#copyright-license', '版权与许可', '©', 'site-footer-copyright-link');

    if (bilibiliLink) {
      bilibiliLink.insertAdjacentElement('afterend', copyrightLink);
    } else {
      footer.appendChild(copyrightLink);
    }
  } catch (e) {
    console && console.warn && console.warn('footer-link failed', e);
  }
});
