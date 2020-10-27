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
    }

    /**
     * Called by the app object to display the page.
     * @param {Array} matches Matched regex groups in the url
     */
    async show(matches) {
        this._app.setPageTitle("Home");
        this._app.setPageContent("#page-home");
    }
}
