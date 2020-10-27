"use strict";

/**
 * Class PageNotFound: Provides a default page for unknown url routes.
 */
class PageNotFound {
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
        this._app.setPageTitle("Page not found");
        this._app.setPageContent("#page-not-found");
    }
}
