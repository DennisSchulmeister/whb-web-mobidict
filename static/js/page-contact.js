"use strict";

/**
 * Class PageContact: Controls the contact page.
 */
class PageContact {
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
        this._app.setPageTitle("Contact");
        this._app.setPageContent("#page-contact");
    }
}
