# TabRemaped

This browser extension enhances your Google Search experience by remapping the Tab key.  Instead of tabbing through *all* elements, it intelligently navigates only through relevant search result links, significantly speeding up your workflow.

## Features

* **Intelligent Tab Navigation:** Remaps the Tab key to focus solely on meaningful search result links (those containing a heading, `<h3>`).
* **Skip Irrelevant Links:** Avoids tabbing through less useful elements on the search results page, such as sidebars or image results.
* **Seamless Integration:** Works directly within Google Search result pages.
* **Shift+Tab Support:** Navigates backward through search result links using Shift+Tab.
* **Handles Google India:** Works on both `google.com` and `google.co.in`.

## How It Works

The extension uses a content script (`content.js`) that runs on Google Search results pages.  Here's a breakdown:

1.  **Event Listener:** The script listens for `keydown` events, specifically for the `Tab` key. It also checks for `Ctrl` or `Meta` key combinations, in which case it doesn't interfere with the default behavior.
2.  **Search Query Check:** The script verifies that a search query exists. If no query is present (e.g., on the Google homepage), the extension does nothing.
3.  **Link Filtering:** The script identifies all links (`<a>` elements) on the page and filters them to select only those that are likely to be main search results.  It checks for the presence of a heading (`<h3>`) within the link and also checks that the link is visible and has a size.
4.  **Navigation:**
    * When the Tab key is pressed, the script prevents the default tab behavior.
    * It then focuses the next link in the filtered list.
    * If Shift+Tab is pressed, it focuses on the previous link.
5.  **Initialization:** The `initialize()` function sets up the event listener.
6.  **Link Visibility Check:** The `filterLink(element)` function checks if a link is visible and has a size.

## Installation

1.  **Download:** Download or clone this repository to your local machine.
2.  **Open Chrome Extensions:** Open Google Chrome (or a Chromium-based browser) and navigate to `chrome://extensions/`.
3.  **Enable Developer Mode:** Enable "Developer mode" by toggling the switch in the top right corner of the page.
4.  **Load Unpacked:** Click the "Load unpacked" button in the top left corner.
5.  **Select Directory:** Select the directory where you downloaded/cloned the extension files (the directory containing `manifest.json` and `content.js`).

The extension should now be installed and active.  You may need to reload any Google Search pages for it to take effect.

## Usage

1.  **Perform a Search:** Go to Google and perform a search.
2.  **Navigate with Tab:** On the search results page, use the `Tab` key to navigate forward through the relevant search result links.
3.  **Navigate with Shift+Tab:** Use `Shift+Tab` to navigate backward through the links.
4.  **Open Link:** Press `Enter` to open the currently focused link.

## Files

Here's a breakdown of the files in this extension:

* `manifest.json`:  This JSON file provides metadata about the extension to the browser.  It includes the extension's name, version, description, permissions, and specifies the content scripts to inject.
* `content.js`: This JavaScript file contains the core logic of the extension.  It's injected into Google Search pages and handles the Tab key remapping.
* `icons/`: This directory contains the extension's icons.
    * `icon16.png`: 16x16 pixel icon.
    * `icon48.png`: 48x48 pixel icon.
    * `icon128.png`: 128x128 pixel icon.

## Browser Compatibility

This extension is designed to work with:

* Google Chrome
* Chromium-based browsers (e.g., Microsoft Edge, Brave)
* Mozilla Firefox (See `browser_specific_settings` in `manifest.json`)

## Manifest Details

Here are some key details from `manifest.json`:

* `manifest_version`: 3 -  Indicates the manifest version used.
* `name`: "TabRemaped" - The name of the extension.
* `version`: "1.0.0" - The version of the extension.
* `description`: "Remaps the Tab key on useful links only" - A brief description of the extension's purpose.
* `action`: Defines the default icon for the extension in the browser toolbar.
* `content_scripts`: Specifies the `content.js` file to be injected into Google Search pages.
    * `matches`:  An array of URL patterns that specify which pages the content script will be injected into (Google Search pages).
* `browser_specific_settings`: Includes settings specific to Firefox.
    * `gecko`:
        * `id`:  A unique identifier for the extension in Firefox.

## Content Script Details (`content.js`)

The `content.js` script performs the following actions:

* `indx`:  A variable to keep track of the currently focused link index.
* `validLinks`: An array to store the filtered, relevant links.
* `initialize()`:
    * Attaches a `keydown` event listener to the document.
    * Checks if the pressed key is `Tab`.
    * Checks for modifier keys (Ctrl/Meta) to avoid conflicts.
    * Checks for a search query.
    * Calls `event.preventDefault()` to stop the default Tab behavior.
    * Filters links using `filterLink()` and stores them in `validLinks`.
    * Handles navigation (forward/backward) through `validLinks` and calls `focus()` on the selected link.
* `filterLink(element)`:
    * Gets the bounding rectangle of the link element.
    * Gets the computed style of the link element.
    * Checks if the link has a size (width and height greater than 0) and is visible (display is not 'none' and visibility is not 'hidden').
    * Returns `true` if the link meets the criteria, `false` otherwise.

## Known Issues and Limitations

* The extension relies on the structure of Google Search results pages.  If Google changes its page structure significantly, the extension may break.
* The link filtering logic may not be perfect and might occasionally miss some relevant links or include some irrelevant ones.(its not perfect!)
* The extension currently only works on Google Search pages.

## Future Improvements

* Improve the link filtering logic to be more robust and accurate.
* Add options to customize the behavior of the extension (e.g., exclude certain types of links).
* Consider adding support for youtube also.
* Error handling: Add more robust error handling.

## Author

[ShivamSahu-dev]

## License

[MIT License]

