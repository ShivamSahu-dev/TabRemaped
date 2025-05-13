let indx = -1;
let validLinks = [];

function initialize() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || event.ctrlKey || event.metaKey) return;

    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q');
    if (!searchQuery || searchQuery.trim() === '') return;

    event.preventDefault();

    if (validLinks.length === 0) {
      const allLinks = Array.from(document.querySelectorAll('a'));
      validLinks = allLinks.filter(link => link.querySelector('h3') && filterLink(link));
      if (validLinks.length === 0) return;
    }

    if (event.shiftKey) {
      indx = (indx - 1 + validLinks.length) % validLinks.length;
    } else {
      indx = (indx + 1) % validLinks.length;
    }

    validLinks[indx].focus();
  });
}

function filterLink(element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const hasSize = rect.width > 0 && rect.height > 0;
  const isStyleVisible = style.display !== 'none' && style.visibility !== 'hidden';
  return hasSize && isStyleVisible;
}

initialize();
