document.addEventListener("DOMContentLoaded", function() {
  try {
    var footer = document.querySelector('.md-footer');
    if (!footer) return;

    var existingLink = footer.querySelector('.site-footer-copyright-link');
    if (existingLink) {
      existingLink.remove();
    }

    var links = Array.from(footer.querySelectorAll('.md-social__link'));
    var bilibiliLink = links.find(function(link) {
      var href = (link.getAttribute('href') || '').toLowerCase();
      return href.includes('b23.tv') || href.includes('bilibili.com');
    });

    var link = document.createElement('a');
    link.href = '/about/copyright-license/';
    link.setAttribute('aria-label', '版权与许可');
    link.className = 'md-social__link site-footer-copyright-link';
    link.innerHTML = '<span class="site-footer-copyright-icon" aria-hidden="true">©</span><span class="site-footer-copyright-text">版权与许可</span>';

    if (bilibiliLink) {
      bilibiliLink.insertAdjacentElement('afterend', link);
    } else {
      footer.appendChild(link);
    }
  } catch (e) {
    console && console.warn && console.warn('footer-link failed', e);
  }
});
