/**
 * Created by aresn on 16/5/11.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var status_code = require('.././helper/status_code');
var uuid = require('node-uuid');
var User = require('../.././model/user');

var SignUpHandler = function(req, res) {
    var mail = req.body.mail || undefined;
    var name = req.body.name || '';
    var passwd = req.body.passwd || undefined;

    if (mail && passwd) {
        // 查询邮箱是否已存在
        User.findOne({
            where: {
                mail: mail
            }
        }).then(function(user) {
            if (user) {
                res.make_response(
                    status_code.ERROR_USER_SIGNUP_ACCOUNT,
                    status_code.ERROR_USER_SIGNUP_ACCOUNT_MSG
                );
            } else {
                var md5 = crypto.createHash('md5');
                md5.update(passwd);

                var passwd_code = md5.digest('hex').substr(0, 16);

                User.create({
                    mail: mail,
                    name: name,
                    passwd: passwd_code
                }).then(function(user) {
                    res.make_response(
                        status_code.SUCCESS,
                        status_code.SUCCESS_MSG,
                        {
                            'user_info': user.get('to_dict')
                        }
                    );
                });
            }
        });
    } else {
        res.make_response(
            status_code.ERROR_PARAM,
            status_code.ERROR_PARAM_MSG
        );
    }
};

var SignInHandler = function(req, res) {
    var mail = req.body.mail || undefined;
    var passwd = req.body.passwd || undefined;

    if (mail && passwd) {
        var md5 = crypto.createHash('md5');
        md5.update(passwd);
        var passwd_code = md5.digest('hex').substr(0, 16);

        User.findOne({
            where: {
                mail: mail,
                passwd: passwd_code
            }
        }).then(function(user) {
            if (user) {
                // 注册sid
                var sid = uuid.v1();
                req.session[sid] = user.get('id');

                res.make_response(
                    status_code.SUCCESS,
                    status_code.SUCCESS_MSG,
                    {
                        'user_info': user.get('to_dict'),
                        'token': sid
                    }
                );
            } else {
                res.make_response(
                    status_code.ERROR_USER_SIGNIN_ACCOUNT,
                    status_code.ERROR_USER_SIGNIN_ACCOUNT_MSG
                );
            }
        })
    } else {
        res.make_response(
            status_code.ERROR_PARAM,
            status_code.ERROR_PARAM_MSG
        );
    }
};

var SignInfoHandler = function(req, res) {
    req.cur_user().then(function(user) {
        res.make_response(
            status_code.SUCCESS,
            status_code.SUCCESS_MSG,
            {
                'user_info': user
            }
        );
    }, function() {
        res.sendStatus(401);
    });
};

router.post('/signup', SignUpHandler);
router.post('/signin', SignInHandler);
router.post('/info', SignInfoHandler);

module.exports = router;