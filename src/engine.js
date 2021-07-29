const express = require('express');
const routes = require('./../views/routes');

module.exports = {
    app: null,
    //init app
    init: function (port = 3000) {
        const app = express();
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
        this.app = app;
        return this;
    },
    //init routes
    routes: function () {
        if (!this.app)
            throw "App not initialized";
        routes
            .app(this.app)
            .register();
        return this;
    }

}