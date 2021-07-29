const registerApi = require('./scrape').register;
const registerUi = require('./static').register
module.exports = {
    _app: null,
    app: function (app) {
        this._app = app;
        return this;
    },
    //register all routes
    register: function () {
        if (!this._app)
            throw "App not set";
        registerApi(this._app)
        registerUi(this._app)
        return this;
    }
}