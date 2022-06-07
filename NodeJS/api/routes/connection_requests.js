const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");

const User = require("../models/user");
const Group = require("../models/group");
const ConnectionRequest = require("../models/connection-request");
const user = require("../models/user");
router.get("/", checkAuth, (req, res, next) => {
    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                if (user[0].isAdmin) {

                    ConnectionRequest.find({ groupId: user[0].group }).select('-_id connectionRequestId groupId sent',).sort({ date: 'descending', id: 'descending' }).exec((err, docs) => {
                        res.status(200).json(
                            {
                                "connectionRequestId": docs
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
        });
});

router.post("/", checkAuth, (req, res, next) => {
    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                if (user[0].isAdmin) {
                    Group.find({ primaryId: req.body.groupId })
                        .exec()
                        .then(group => {
                            ConnectionRequest.find({ senderGroupId: user[0].group, groupId: group[0].primaryId, }).exec().then(cr => {
                                if (cr.length < 1) {
                                    ConnectionRequest.count({}, function (err, count) {
                                        const connectionRequest = new ConnectionRequest({
                                            _id: new mongoose.Types.ObjectId,
                                            connectionRequestId: count + 1,
                                            senderGroupId: user[0].group,
                                            groupId: group[0].primaryId,
                                        });
                                        console.log("here45");
                                        connectionRequest.save()
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
                                    return res.status(400).json({
                                        "error": {
                                            "message": "Bad request!"
                                        }
                                    });
                                }
                            })

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
                    ConnectionRequest.find({ connectionRequestId: req.body.connectionRequestId })
                        .exec()
                        .then(connectionRequest => {
                            User.find({ group: connectionRequest[0].senderGroupId, isAdmin: true })
                                .exec()
                                .then(secondAdmin => {
                                    if (secondAdmin.length > 0) {
                                        connectionRequest[0].isAccepted = true;
                                        connectionRequest[0].save().then(async crResult => {
                                            listToAdd1 = adminUser[0].groupIdsInCommon;
                                            listToAdd1.addToSet(adminUser[0].group);
                                            listToAdd2 = secondAdmin[0].groupIdsInCommon;
                                            listToAdd2.addToSet(secondAdmin[0].group);
                                            listToAdd1.map(groupId => {
                                                secondAdmin[0].groupIdsInCommon.addToSet(groupId);
                                            });
                                            listToAdd2.map(groupId => {
                                                adminUser[0].groupIdsInCommon.addToSet(groupId);
                                            });
                                            const update1 = await User.find({
                                                group: { $in: adminUser[0].groupIdsInCommon }
                                            }).exec()
                                                .then(users => {

                                                    if (users.length > 0) {

                                                        users.map(user => {
                                                            if (user != null) {


                                                                var temp = [...new Set(user.groupIdsInCommon)];
                                                                console.log("temp: " + temp);
                                                                var temp2 = [...new Set(secondAdmin[0].groupIdsInCommon)];
                                                                console.log("temp2: " + temp2);
                                                                var temp3 = [...temp];
                                                                temp3.push(...temp2);
                                                                console.log("temp3: " + temp3);
                                                                var temp4 = [...new Set(temp3)]
                                                                console.log("temp4: " + temp4);

                                                                temp4.map(groupId => {
                                                                    user.groupIdsInCommon.addToSet(groupId);
                                                                });

                                                                console.log("user.groupIdsInCommon: " + user.groupIdsInCommon);
                                                                user.save();
                                                            }

                                                        })

                                                    }
                                                })


                                            const updat2 = await User.find({
                                                group: { $in: secondAdmin[0].groupIdsInCommon }
                                            }).exec()
                                                .then(users => {
                                                    if (users.length > 0) {
                                                        users.map(user => {
                                                            if (user != null) {
                                                                var temp = [...new Set(user.groupIdsInCommon)];
                                                                console.log("temp: " + temp);
                                                                var temp2 = [...new Set(adminUser[0].groupIdsInCommon)];
                                                                console.log("temp2: " + temp2);
                                                                var temp3 = [...temp];
                                                                temp3.push(...temp2);
                                                                console.log("temp3: " + temp3);
                                                                var temp4 = [...new Set(temp3)]
                                                                console.log("temp4: " + temp4);
                                                                temp4.map(groupId => {
                                                                    user.groupIdsInCommon.addToSet(groupId);
                                                                });
                                                                console.log("user.groupIdsInCommon: " + user.groupIdsInCommon);
                                                                user.save();
                                                            }

                                                        })
                                                    }
                                                })
                                            return res.status(200).json({
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
        });
});


module.exports = router;