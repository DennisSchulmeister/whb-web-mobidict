"use strict";

/**
 * Class PageAbout: Controls the about page.
 */
class PageAbout {
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
        this._app.setPageTitle("About");
        this._app.setPageContent("#page-about");
    }
}
