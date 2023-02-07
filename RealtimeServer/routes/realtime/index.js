var express = require("express");

module.exports = (app) => {
    var router = express.Router();

    router.post('/msgsent', (req, res) => {
        
        res.json({});
    });

    return router;
}