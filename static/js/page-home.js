"use strict";

/**
 * Class PageHome: Controls the start page.
 */
class PageHome {
    /**
     * Constructor
     * @param {App} app Central app instance
     */
    constructor(app) {
        this._app = app;

        this._inputField = null;
        this._searchButton = null;
        this._keyUpListener = null;
        this._clickListener = null;
    }

    /**
     * Called by the app object to display the page.
     * @param {Array} matches Matched regex groups in the url
     */
    async show(matches) {
        this._app.setPageTitle("Home");
        this._app.setPageContent("#page-home");

        this._inputField = document.querySelector("#page-home .search-query");
        this._searchButton = document.querySelector("#page-home .search-button");

        this._keyUpListener = event => {
            if (event.key == "Enter") {
                this._gotoQueryPage();
            }
        };

        this._clickListener = event => {
            this._gotoQueryPage();
        };

        this._inputField.addEventListener("keyup", this._keyUpListener);
        this._searchButton.addEventListener("click", this._clickListener);
    }

    /**
     * Unregister event listeners to prevent memory leaks and undefined
     * behaviour when the same page if opened several times in a row.
     */
    hide() {
        this._inputField.removeEventListener("keyup", this._keyUpListener);
        this._searchButton.removeEventListener("click", this._clickListener);
    }

    /**
     * Navigate to query page so that the searched word will looked up on
     * the server and the result displayed.
     */
    _gotoQueryPage() {
        let query = this._inputField.value.trim();
        if (!query) return;

        location.hash = `#/query/${query}`;
    }
}
