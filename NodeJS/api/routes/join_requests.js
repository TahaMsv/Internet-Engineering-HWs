const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");

const User = require("../models/user");
const Group = require("../models/group");
const JoinRequest = require("../models/join-request");


router.get("/", checkAuth, (req, res, next) => {
    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            JoinRequest.find({ userId: user[0].primaryId }).select('-_id id groupId userId date',).sort({ date: 'descending', id: 'descending' }).exec((err, docs) => {
                const requestsListResponse = docs.map(item => {
                    const newMap = {};
                    newMap.id = item.id;
                    newMap.groupId = item.groupId;
                    newMap.userId = item.userId;
                    newMap.date = item.date;
                    return newMap;
                })
                res.status(200).json(
                    {
                        "joinRequests": requestsListResponse
                    }
                );
            })
        });
});

router.post("/", checkAuth, (req, res, next) => {

    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                if (user[0].group == null) {
                    Group.find({ primaryId: req.body.groupId })
                        .exec()
                        .then(group => {
                            if (group.length > 0) {
                                JoinRequest.find({ userId: user[0].primaryId, groupId: group[0].primaryId })
                                    .exec()
                                    .then(joinRequest => {
                                        if (joinRequest.length == 0) {
                                            JoinRequest.count({}, function (err, count) {
                                                const joinRequest = new JoinRequest({
                                                    _id: new mongoose.Types.ObjectId,
                                                    id: count + 1,
                                                    userId: user[0].primaryId,
                                                    groupId: group[0].primaryId,
                                                });
                                                joinRequest.save()
                                                    .then(result => {
                                                        return res.status(200).json({
                                                            "message": "successful"
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        return res.status(400).json({
                                                            "error": {
                                                                "message": "Bad request!"
                                                            }
                                                        });
                                                    });
                                            })
                                        } else {
                                            if(joinRequest[0].isAccepted){
                                                return res.status(400).json({
                                                    "error": {
                                                        "message": "Bad request!"
                                                    }
                                                });
                                            }
                                            joinRequest[0].date = Date.now()
                                            joinRequest[0].save();
                                            return res.status(200).json({
                                                "message": "successful"
                                            });
                                        }

                                    })
                            } else {
                                return res.status(400).json({
                                    "error": {
                                        "message": "Bad request!"
                                    }
                                });
                            }
                        });
                } else {
                    return res.status(400).json({
                        "error": {
                            "message": "Bad request!"
                        }
                    });
                }
            } else {
                return res.status(400).json({
                    "error": {
                        "message": "Bad request!"
                    }
                });
            }
        })

});

router.get("/group", checkAuth, (req, res, next) => {
    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                if (user[0].isAdmin) {
                    JoinRequest.find({ groupId: user[0].group }).select('-_id id groupId userId date',).sort({ date: 'descending', id: 'descending' }).exec((err, docs) => {
                        const requestsListResponse = docs.map(item => {
                            const newMap = {};
                            newMap.id = item.id;
                            newMap.groupId = item.groupId;
                            newMap.userId = item.userId;
                            newMap.date = item.date;
                            return newMap;
                        })

                        res.status(200).json(
                            {
                                "joinRequests": requestsListResponse
                            }
                        );
                    });
                } else {
                    return res.status(400).json({
                        "error": {
                            "message": "Bad request!"
                        }
                    });
                }
            } else {
                return res.status(400).json({
                    "error": {
                        "message": "Bad request!"
                    }
                });
            }
        })
});

router.post("/accept", checkAuth, (req, res, next) => {
    User.find({ email: req.userData.email })
        .exec()
        .then(adminUser => {
            if (adminUser.length >= 1) {
                if (adminUser[0].isAdmin) {
                    JoinRequest.find({ id: req.body.joinRequestId, groupId: adminUser[0].group })
                        .exec()
                        .then(joinRequest => {
                            User.find({ primaryId: joinRequest[0].userId })
                                .exec()
                                .then(normalUser => {

                                    if (normalUser[0].group == null) {
                                        joinRequest[0].isAccepted = true;
                                        joinRequest[0].save();

                                        normalUser[0].group = joinRequest[0].groupId;
                                        normalUser[0].dateOfjoin = Date.now();
                                        normalUser[0].save();
                                        return res.status(400).json({
                                            "message": "successful"
                                        });

                                    } else {
                                        return res.status(400).json({
                                            "error": {
                                                "message": "Bad request!"
                                            }
                                        });
                                    }
                                })
                        }).catch(err => {
                            return res.status(400).json({
                                "error": {
                                    "message": "Bad request!"
                                }
                            });
                        });
                } else {
                    return res.status(400).json({
                        "error": {
                            "message": "Bad request!"
                        }
                    });
                }
            } else {
                return res.status(400).json({
                    "error": {
                        "message": "Bad request!"
                    }
                });
            }
        })
});


module.exports = router;