/**
 * Created by aresn on 16/5/10.
 */
var express = require('express');
var router = express.Router();

var SignUpHandler = function(req, res) {
    var context = {

    };
    res.html_response('signup', true, context);
};

router.get('/signup', SignUpHandler);

exports.routes = router;