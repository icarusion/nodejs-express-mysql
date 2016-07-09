/**
 * Created by aresn on 16/5/10.
 */
var express = require("express");
var User = require('../.././model/user');
var q = require('q');

module.exports = function(req, res, next) {
    // 回html
    res.html_response = function(template_name, cache, context) {
        if (cache) {
            res.set('Cache-Control', 'public, max-age=86400');
        } else {
            res.set('Cache-Control', 'no-store, no-cache');
        }
        res.set({
            'Date': new Date(),
            'Content-Type': 'text/html; charset=utf-8'
        });

        res.render(template_name, context, function(err, html) {
            res.send(html);
        });
    };

    // 回接口
    res.make_response = function(status_code, msg, data) {
        data = data || '';

        res.set({
            'Date': new Date(),
            'Cache-Control': 'private',
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        });
        res.send({
            'status_code': status_code.toString(),
            'msg': msg,
            'data': data
        });
    };

    // 判断我是不是我
    req.cur_user = function() {
        var dfd = q.defer();

        var user_id = req.session[req.cookies.token] || undefined;

        User.findOne({
            where: {
                id: user_id
            }
        }).then(function(user) {
            if (user) {
                dfd.resolve(user.get('to_dict'));
            } else {
                dfd.reject();
            }
        });

        return dfd.promise;
    };
    next();
};