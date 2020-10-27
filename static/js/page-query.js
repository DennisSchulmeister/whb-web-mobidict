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
        // Set up searchbar
        this._inputField = document.querySelector("#page-query .search-query");
        this._searchButton = document.querySelector("#page-query .search-button");

        let query = decodeURI(matches[1]);
        this._inputField.value = query;

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

        // Set up download link
        let actionDownloadLink = document.querySelector("#page-query .action-download");
        actionDownloadLink.href = `http://localhost:8888/api/query?q=${encodeURI(query)}&format=text`;

        // Fetch result
        let result = await fetch(`http://localhost:8888/api/query?q=${encodeURI(query)}&format=json`);
        let json = await result.json();

        let resultElement = document.querySelector("#page-query .result");
        resultElement.innerHTML = "";

        json.result.forEach(line => {
            let splitted = line.split("::");
            let word = splitted[0] || "";
            let translation = splitted[1] || "";

            resultElement.innerHTML += `
                <tr>
                    <td class="word">
                        ${word}
                    </td>
                    <td class="translation">
                        ${translation}
                    </td>
                </tr>
            `;
        });


        // Show new page
        this._app.setPageTitle(`Lookup: ${query}`);
        this._app.setPageContent("#page-query");
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
