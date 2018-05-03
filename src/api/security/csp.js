// Report CSP violations (*ABOVE* CSURF in the middleware stack)
// Browsers will post violations to this route
// https://mathiasbynens.be/notes/csp-reports
app.post('/csp', bodyParser.json(), function (req, res) {
    // TODO - requires production level logging
    if (req.body) {
        // Just send to debug to see if this is working
        debug('CSP Violation: ' + JSON.stringify(req.body));
    } else {
        debug('CSP Violation: No data received!');
    }
    res.status(204).end();
});