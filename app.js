"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var app = express();
var routes = require('./routes/index');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.locals.pretty = true; // made Jade HTML pretty
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
