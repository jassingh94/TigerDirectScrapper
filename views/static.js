const path = require('path');
module.exports.register = (app) => {
    //host html
    app.use('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../ui/index.html'));
    })
    return app;
}