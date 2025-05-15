# TabRemaped

This browser extension enhances your browsing experience by remapping the Tab key. Instead of tabbing through *all* elements, it intelligently navigates only through relevant links, significantly speeding up your workflow. Originally designed for Google Search results, the extension now also supports YouTube browsing.

## Features

* **Intelligent Tab Navigation:** 
  * On Google Search: Remaps the Tab key to focus solely on meaningful search result links (those containing a heading, `<h3>`).
  * On YouTube: Focuses solely on video thumbnail links while browsing various YouTube pages.
* **Skip Irrelevant Links:** Avoids tabbing through less useful elements on both Google Search results and YouTube pages.
* **Seamless Integration:** Works directly within Google Search result pages and YouTube's interface.
* **Shift+Tab Support:** Navigates backward through links using Shift+Tab.
* **SPA Support:** Handles YouTube's single-page application architecture to ensure proper navigation after page transitions.
* **Multiple Search Domains:** Works on both `google.com` and `google.co.in` for the search feature.

## How It Works

The extension uses content scripts (`content.js` for Google Search and `content-youtube.js` for YouTube) that run on their respective pages.

### Google Search Functionality:
1. **Event Listener:** The script listens for `keydown` events, specifically for the `Tab` key. It also checks for `Ctrl` or `Meta` key combinations, in which case it doesn't interfere with the default behavior.
2. **Search Query Check:** The script verifies that a search query exists. If no query is present (e.g., on the Google homepage), the extension does nothing.
3. **Link Filtering:** The script identifies all links (`<a>` elements) on the page and filters them to select only those that are likely to be main search results. It checks for the presence of a heading (`<h3>`) within the link and also checks that the link is visible and has a size.

### YouTube Functionality:
1. **Event Listener:** Similarly, the script listens for `Tab` key presses while ignoring those with modifier keys.
2. **Link Filtering:** The script identifies relevant video thumbnail links on the page and filters them to select only those that are visible and lead to watch pages.
3. **SPA Handling:** The script detects YouTube's page navigation and resets the link detection to ensure proper functionality as users move between different sections of YouTube.

### Navigation for Both Platforms:
* When the Tab key is pressed, the script prevents the default tab behavior.
* It then focuses the next link in the filtered list.
* If Shift+Tab is pressed, it focuses on the previous link.

## Installation

1. **Download:** Download or clone this repository to your local machine.
2. **Open Chrome Extensions:** Open Google Chrome (or a Chromium-based browser) and navigate to `chrome://extensions/`.
3. **Enable Developer Mode:** Enable "Developer mode" by toggling the switch in the top right corner of the page.
4. **Load Unpacked:** Click the "Load unpacked" button in the top left corner.
5. **Select Directory:** Select the directory where you downloaded/cloned the extension files (the directory containing `manifest.json` and the content scripts).

The extension should now be installed and active. You may need to reload any Google Search or YouTube pages for it to take effect.

## Usage

1. **Google Search:**
   * Perform a search on Google
   * Use the `Tab` key to navigate forward through relevant search result links
   * Use `Shift+Tab` to navigate backward through the links
   * Press `Enter` to open the currently focused link

2. **YouTube:**
   * Navigate to YouTube and browse as usual
   * Use the `Tab` key to navigate forward through relevant video links only
   * Use `Shift+Tab` to navigate backward through the links
   * Press `Enter` to open the currently focused video

## Files

Here's a breakdown of the files in this extension:

* `manifest.json`: This JSON file provides metadata about the extension to the browser. It includes the extension's name, version, description, permissions, and specifies the content scripts to inject.
* `content.js`: This JavaScript file contains the core logic for Google Search functionality. It's injected into Google Search pages and handles the Tab key remapping.
* `content-youtube.js`: This JavaScript file implements the YouTube-specific functionality, handling Tab key remapping on YouTube pages.
* `icons/`: This directory contains the extension's icons.
    * `icon16.png`: 16x16 pixel icon.
    * `icon48.png`: 48x48 pixel icon.
    * `icon128.png`: 128x128 pixel icon.

## Browser Compatibility

This extension is designed to work with:

* Google Chrome
* Chromium-based browsers (e.g., Microsoft Edge, Brave)
* Mozilla Firefox (See `browser_specific_settings` in `manifest.json`)

## Content Script Details

### Google Search Script (`content.js`):
The original script focuses on Google Search results with these key components:
* Tracks the currently focused link index
* Stores filtered, relevant search result links
* Attaches keydown event listeners for Tab navigation
* Filters links based on presence of headings and visibility
* Provides forward/backward navigation through search results

### YouTube Script (`content-youtube.js`):
The YouTube script extends the functionality with these components:
* `indx`: Tracks the currently focused link index
* `links`: Stores all links found on the page
* `validLinks`: Stores the filtered, relevant video links
* `lastPath`: Tracks the current page path to detect navigation
* `initialize()`: Sets up the SPA navigation detection and keydown listeners
* `hookHistoryMethod()`: Overrides History API methods to detect page navigation
* `filterLink(element)`: Filters links to only include visible video links
* `restart()`: Resets the navigation state when page changes
* `navigate(event)`: Handles Tab key navigation through the filtered links
* `getLinks()`: Selects appropriate link elements based on current page type
* `ensureValidLinks()`: Populates the valid links array if needed

## YouTube History API Override

The YouTube functionality uses a sophisticated technique to handle YouTube's single-page application (SPA) architecture. This is necessary because YouTube updates content without full page reloads, which can break extensions that rely on page load events.

Here's how the History API override works:

1. **Capturing Original Methods:**
   The `hookHistoryMethod()` function stores a reference to the original browser History API methods (`pushState` and `replaceState`):
   ```javascript
   function hookHistoryMethod(type) {
     const orig = history[type];
     history[type] = function(...args) {       
       const result = orig.apply(history, args); 
       window.dispatchEvent(new Event('yt-navigate'));
       return result;
     };
   }
   ```

2. **Method Replacement:**
   The function then replaces the original methods with custom versions that:
   - Execute the original functionality via `apply()`
   - Dispatch a custom `yt-navigate` event
   - Return the original result to maintain expected behavior

3. **Navigation Detection:**
   In addition to the History API overrides, the extension also listens for `popstate` events (triggered by browser back/forward buttons):
   ```javascript
   window.addEventListener('popstate', () => window.dispatchEvent(new Event('yt-navigate')));
   ```

4. **Path Tracking:**
   The extension maintains a `lastPath` variable to track the current path and detect when navigation has occurred:
   ```javascript
   const newPath = window.location.pathname;
   if (lastPath !== newPath) {
     restart();
     lastPath = newPath;
   }
   ```

This implementation ensures that the extension properly responds to all navigation types in YouTube's dynamic interface, including clicking on video thumbnails, using search, and browser navigation controls.

## Known Issues and Limitations

* The extension relies on the structure of Google Search and YouTube pages. If either platform changes its page structure significantly, the extension may break.
* The link filtering logic may not be perfect and might occasionally miss some relevant links or include some irrelevant ones.
* there's no popup yet
* the custom tabbing in content-youtube.js doesnt always work sometimes its glitchy.

## Future Improvements

* Improve the link filtering logic to be more robust and accurate.
* Add options to customize the behavior of the extension.
* Extend support to other platforms with similar navigation needs.
* Add more robust error handling and debugging features.
* adding a coooool Popup :)

## Author

[ShivamSahu-dev]

## License

[MIT License]
