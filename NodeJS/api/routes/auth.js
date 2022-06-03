const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../../models/user");
const { use } = require("express/lib/router");

router.post("/signup", (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
              
                return res.status(400).json({
                    "error": {
                        "message": "Bad request!"
                    }
                });
            } else {

                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            "error": err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            isAdmin: false,
                            dateOfjoin: Date.now(),
                            requestIDs: [],
                            chatsIDs: [],
                        });
                        user.save()
                            .then(result => {
                                console.log('here42');
                                console.log(result);
                                const token = jwt.sign({
                                    email: user.email,
                                    userId: user._id  // esm parametr doroste?
                                }, process.env.JWT_KEY, {
                                    expiresIn: "1h"
                                });
                                console.log('here50');
                                return res.status(200).json({

                                    "token": token,
                                    "message": "successful"

                                });
                            })
                            .catch(err => {
                                console.log(err);
                                console.log('here60');
                                return res.status(500).json({
                                    "error": err
                                });
                            });
                    }
                });
            }
        })


});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(400).json({
                    "error": {
                        "message": "Bad request!"
                    }
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, function (err, result) {
                    if (err) {
                        return res.status(400).json({
                            "error": {
                                "message": "Bad request!"
                            }
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id  // esm parametr doroste?
                        }, "secret", {
                            expiresIn: "1h"
                        });
                        return res.status(200).json({

                            "token": token,
                            "message": "successful"

                        });
                    }
                });
            }
        })


});




module.exports = router;