﻿var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var webreg = require('../controller/website_registration');
var Account = require('../models/webaccount');

/**
 * @author David Greenberg
 * @module
 * */

/**
 * @api {post} /websites/games/add
 * @apiName AddGame
 * @apiGroup GameManagement
 *
 * @apiParam {String} name The name of the game
 *
 *
 * @apiSuccess {json} Array of game names and ids
 * @apiSuccessExample {json} Success-Response:
  HTTP/1.1 200 OK
  { "name":"Let's Start",
    "id":"124-544-332"
  }
 * @apiError AlreadyExists Game Name already exists
 * @apiErrorExample {json} Error-Response:
  HTTP/1.1 409 Conflict
    {
      "error":"AlreadyExists",
      "reason":
    }
 */
router.post("/add", webreg.isLoggedIn, function (req, res, next) {
    
    
    Account.findOneAndUpdate(
        {
            'username': req.user.username
        }, 
        {
            $push: 
 {
                "game_code":
 {
                   'name': req.body.name,
                   'game_id': uuid.v1()
                }
            }
        }, {
            safe: true,
            upsert: true
        },
    function (err, model) {
            console.log(err);
            //Redirect to the site, later change to json
            res.redirect("/website/settings");
        });




});

module.exports = router;