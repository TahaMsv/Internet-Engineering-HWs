const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");
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
                        return res.status(400).json({
                            "error": {
                                "message": "Bad request!"
                            }
                        });
                    } else {
                    
                        User.count({}, function (err, count) {
                        
                            const user = new User({
                                _id: new mongoose.Types.ObjectId,
                                primaryId: count + 1,
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                            });
                            user.save()
                                .then(result => {
                                    const token = jwt.sign({
                                        email: user.email,
                                        userId: user._id
                                    }, "secret", {
                                        expiresIn: "23h"
                                    });
                                
                                    return res.status(200).json({
                                        "token": token,
                                        "message": "successful"
                                    });
                                })
                                .catch(err => {
                                    
                                    return res.status(400).json({
                                        "error": {
                                            "message": "Bad request!"
                                        }
                                    });
                                });
                        })
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
                            userId: user[0]._id
                        }, "secret", {
                            expiresIn: "23h"
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
