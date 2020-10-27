"use strict";

/**
 * Class PageQuery: Controls the page where a query sent to the server and the
 * result is shown.
 */
class PageQuery {
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
        let query = matches[1];
        // TODO

        this._app.setPageTitle("Query");
        this._app.setPageContent("#page-query");
    }
}
