"use strict";

 /**
 * Class App: Controls the navigation within the application
 *
 * This class is the main class of the application, so to speak. It contains
 * the single page router and some global application logic to glue things
 * together. Control over the individual pages is than handed over to page
 * classes which are instantiated as soon, as a specific page is shown.
 */
class App {
    /**
     * Constructor. The parameter pages must contain a list of the existing
     * pages can be transferred to the app. The list must have the following
     * format:
     *
     *      [
     *          {
     *              url: "^/$"              // Regex pattern to match URL
     *              klass: PageOverview     // Class to display the page
     *          }, {
     *              url: "^/Details/(.*)$"  // Regex pattern to match URL
     *              klass: PageDetails      // Class to display the page
     *          },
     *          ...
     *      ]
     *
     * @param {String} title Display title of the app
     * @param {List} pages Definition of the available app pages
     */
    constructor(title, pages) {
        this._title = title;
        this._pages = pages;
        this._currentPageObject = null;
        this._currentQuery = "";
    }

    /**
    * Start method of the App. Here some global event listeners to drive the
    * app are registered. This method must thus be called from index.html.
     */
    run() {
        // Register global event listeners
        document.querySelector("header nav .toggle-menu a").addEventListener("click", this._toggleHamburgerMenu);

        // Start single page router and show first page
        window.addEventListener("hashchange", () => this._handleRouting());
        this._handleRouting();
    }

    /**
     * Utility method to show and hide the hamburger menu on small screens.
     * The method is called by an click event handler on the hamburger icon.
     *
     * @param {DOMEvent} event Click event
     */
    _toggleHamburgerMenu(event) {
        // Hide or show menu
        let menu = document.querySelector("header nav .menu-right");
        if (!menu) return;

        if (menu.classList.contains("small-screen-hidden")) {
            menu.classList.remove("small-screen-hidden");
        } else {
            menu.classList.add("small-screen-hidden");
        }

        if (event) {
            event.preventDefault();
        }
    }

    /**
     * The heart of the single page router. This uses a fairly trivial
     * implementation based on the hashchange event. The beauty of this is
     * that the code is straight-forward and simple and doesn't need any
     * support from the server.
     */
    _handleRouting() {
        let pageUrl = location.hash.slice(1);

        if (pageUrl.length === 0) {
            pageUrl = "/";
        }

        let matches = null;
        let page = this._pages.find(p => matches = pageUrl.match(p.url));

        if (!page) {
            console.error(`No page for url ${pageUrl} found!`);
            return;
        }

        this._currentPageObject = new page.klass(this);
        this._currentPageObject.show(matches);
    }

    /**
     * Called by the page objects to change the visible title of the current
     * page. The title will be changed in the browser window as well as in
     * any element with the `.page-name` cass class.
     *
     * @param {String} title Page title
     */
    setPageTitle(title) {
        document.querySelectorAll(".page-name").forEach(e => e.textContent = title);
        document.title = `${title} – ${this._title}`;
    }

    /**
     * Called by page objects to change the currently visible main content.
     *
     * @param {String} query Query String to match the objects to show.
     */
    setPageContent(query) {
        if (this._currentQuery) {
            document.querySelectorAll(this._currentQuery).forEach(e => e.classList.add("hidden"));
        }

        this._currentQuery = query;
        document.querySelectorAll(query).forEach(e => e.classList.remove("hidden"));
    }
}
