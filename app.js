"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const app = express();
const index_1 = require("./routes/index");
const bp = require("body-parser");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bp.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.router);
if (app.get('env') === 'development') {
    app.locals.pretty = true;
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map