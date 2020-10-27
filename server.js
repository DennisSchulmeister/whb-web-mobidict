/*
 * mobidict (https://www.wpvs.de)
 * © 2020 Dennis Schulmeister-Zimolong <dennis@wpvs.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 */
const child_process = require('child_process');
const express = require("express");
const path = require("path");

// Read environment variables for configuration
const config = {
    static_dir: process.env.STATIC_DIR     || path.normalize(path.join(__dirname, "static")),
    dict_file:  process.env.DICT_FILE      || path.normalize(path.join(__dirname, "dict", "beolingus")),
    grep_cmd:   process.env.GREP_CMD       || "grep -E $search$ $dict$",
    port:       parseInt(process.env.PORT) || 8888,
    host:       process.env.HOST           || "localhost",
};

// Serve static files from the "static" directory
const app = express();

app.use((request, response, next) => {
    console.log(new Date(), request.method, request.url, `HTTP ${request.httpVersion}`);
    next();
});

let staticDir = path.normalize(path.join(__dirname, "static"));
app.use(express.static(staticDir));

// Expose endpoint to query the dictionary. The endpoint expects two query
// parameters in the URL:
//
//   » q=Searched Word
//   » format=json|text
//
// q is the search word, format can be either `json` (default) or `text`.
app.get("/api/query", (request, response) => {
    let query  = request.query.q || "";
    let format = request.query.format || "json";

    if (!query) {
        response.status(400);
        response.json({error: "query-missing", message: "Query parameter q missing or empty."});
        return;
    } else if (format !== "json" && format !== "text") {
        response.status(400);
        response.json({error: "unknown-format", message: "Invalid value for query parameter format. Use 'json' or 'text'."});
        return;
    }

    let splitted  = config.grep_cmd.split(" ")
    let command   = splitted[0];
    let arguments = splitted.splice(1);

    arguments = arguments.map(arg => {
        arg = arg.replace("$search$", query);
        arg = arg.replace("$dict$", config.dict_file);
        return arg;
    });

    console.log(new Date(), "Executing:", command, arguments);
    let grep = child_process.spawn(command, arguments);
    let result_lines = "";

    grep.stdout.on("data", data => result_lines += data);

    grep.on("close", code => {
        if (code !== 0) {
            response.status(500);
            response.json({error: "external-command", message: `External command exited with return code ${code}.`});
            return;
        }

        response.status(200);

        if (format === "json") {
            response.type("application/json");
            response.json({
                query: query,
                result: result_lines.split("\n"),
            });
        } else if (format === "text") {
            response.type("text/plain");
            response.send(`Query: ${query}\n\n${result_lines}`);
        }
    });
});

// Start server
app.listen(config.port, config.host, () => {
    console.log("========================");
    console.log("mobidict node.js server");
    console.log("========================");
    console.log();
    console.log("Running with the following configuration:");
    console.log();
    console.log(config);
    console.log();
    console.log("Use the following environment variables to change these settings:");
    console.log();
    console.log("  » STATIC_DIR: Directory to serve static files from");
    console.log("  » DICT_FILE:  Filename of the dictionary file (must be plain-text)");
    console.log("  » GREP_CMD:   OS-command to query the dictionary");
    console.log("  » PORT:       TCP-port to listen on for the webserver");
    console.log("  » HOST:       Hostname or IP-address to listen on");
    console.log();
    console.log("Use the following placeholders in the grep command:");
    console.log();
    console.log("  » $search$:   Search string");
    console.log("  » $dict$:     Path of the dictionary file");
    console.log();
});
