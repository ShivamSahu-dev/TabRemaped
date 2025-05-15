let indx = -1;
let links;
let validLinks = [];
let lastPath;

function initialize() {
  lastPath = window.location.pathname;
  // Hook SPA navigations once at startup
  hookHistoryMethod('pushState');
  hookHistoryMethod('replaceState');
  window.addEventListener('popstate',  () => window.dispatchEvent(new Event('yt-navigate')));

  // Listen for our custom navigation event
  window.addEventListener('yt-navigate', () => {
    const newPath = window.location.pathname;
    if (lastPath !== newPath) {
      restart();
      lastPath = newPath;
    }
  });

  // Tab‐key navigation
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || event.ctrlKey || event.metaKey) return;
    if (!ensureValidLinks()) return; // Only proceed if we found links
    navigate(event);  
  });
}

function hookHistoryMethod(type) {
  const orig = history[type];
  history[type] = function(...args) {       
    const result = orig.apply(history, args); 
    window.dispatchEvent(new Event('yt-navigate'));
    return result;
  };
}

function filterLink(element) { // filters out the unecessary and hidden/unclickable links
  const href = element.href || "";
  if (!href.includes("youtube.com/watch?v=")) return false;
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element); 
  return rect.width > 0 && rect.height > 0 &&
         style.display !== 'none' && style.visibility !== 'hidden';
}

function restart() {
  validLinks = [];
  indx = -1;
}

function navigate(event) {
  event.preventDefault();                 
  if (event.shiftKey) {
    indx = (indx - 1 + validLinks.length) % validLinks.length;
  } else {
    indx = (indx + 1) % validLinks.length;
  }
  validLinks[indx].focus();
}

function getLinks() {
  const p = window.location.pathname;
  if (p === '/')             links = document.querySelectorAll('ytd-rich-grid-media a#thumbnail'); //gets the  thumbnail of the videos
  else if (p === '/results') links = document.querySelectorAll('ytd-video-renderer a#thumbnail');
  else if (p === '/watch')   links = document.querySelectorAll('ytd-compact-video-renderer a#thumbnail');
  else                       links = [];
}

function ensureValidLinks() {
  if (validLinks.length === 0) {
    getLinks();
    validLinks = Array.from(links).filter(filterLink);
  }
  return validLinks.length > 0; //checks if No valid links found on this page.
}


initialize();
