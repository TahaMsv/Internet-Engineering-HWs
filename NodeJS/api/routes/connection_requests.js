const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");

const User = require("../models/user");
const Group = require("../models/group");
const ConnectionRequest = require("../models/connection-request");
const CommonGroups = require("../models/common-groups");
const commonGroups = require("../models/common-groups");
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
                                        connectionRequest[0].save().then(crResult => {
                                            console.log("here121");
                                            console.log("adminUser[0].group: " + adminUser[0].group);
                                            console.log("secondAdmin[0].group: " + secondAdmin[0].group);
                                            console.log("adminUser[0].groupIdsInCommon: " + adminUser[0].groupIdsInCommon);
                                            console.log("secondAdmin[0].groupIdsInCommon: " + secondAdmin[0].groupIdsInCommon);
                                            listToAdd1 = adminUser[0].groupIdsInCommon;
                                            console.log("listToAdd1: " + listToAdd1);
                                            listToAdd1.addToSet(adminUser[0].group);
                                            console.log("listToAdd1: " + listToAdd1);
                                            listToAdd2 = secondAdmin[0].groupIdsInCommon;
                                            console.log("listToAdd2: " + listToAdd2);
                                            listToAdd2.addToSet(secondAdmin[0].group);
                                            console.log("listToAdd2: " + listToAdd2);
                                            console.log("listToAdd1: " + listToAdd1);
                                            listToAdd1.map(groupId => {
                                                console.log("groupId: " + groupId);
                                                secondAdmin[0].groupIdsInCommon.addToSet(groupId);
                                                console.log("secondAdmin[0].groupIdsInCommon: " + secondAdmin[0].groupIdsInCommon);
                                            });
                                            listToAdd2.map(groupId => {
                                                console.log("groupId: " + groupId);
                                                adminUser[0].groupIdsInCommon.addToSet(groupId);
                                                console.log("adminUser[0].groupIdsInCommon: " + adminUser[0].groupIdsInCommon);
                                            });
                                            console.log("here128");
                                            console.log("adminUser[0].groupIdsInCommon: " + adminUser[0].groupIdsInCommon);
                                            console.log("secondAdmin[0].groupIdsInCommon: " + secondAdmin[0].groupIdsInCommon);

                                            User.find({
                                                group: { $in: adminUser[0].groupIdsInCommon }
                                            })
                                                .exec()
                                                .then(users => {

                                                    if (users.length > 0) {
                                                        users.map(user => {
                                                            console.log("here143");
                                                            var temp = [...new Set(user.groupIdsInCommon)];
                                                            var temp2 = [...new Set(adminUser[0].groupIdsInCommon)];
                                                            var temp3 = [...temp];
                                                            temp3.push(...temp2);
                                                            var temp4 = [...new Set(temp3)]
                                                            // user.groupIdsInCommon = [];
                                                            user.groupIdsInCommon = temp4;
                                                            user.save();
                                                        })
                                                    }
                                                })

                                            console.log("here150");

                                            User.find({
                                                group: { $in: secondAdmin[0].groupIdsInCommon }
                                            })
                                                .exec()
                                                .then(users => {
                                                    // console.log(users);
                                                    if (users.length > 0) {
                                                        users.map(user => {
                                                            console.log("here160");
                                                            var temp = [...new Set(user.groupIdsInCommon)];
                                                            var temp2 = [...new Set(secondAdmin[0].groupIdsInCommon)];
                                                            var temp3 = [...temp];
                                                            temp3.push(...temp2);
                                                            var temp4 = [...new Set(temp3)]
                                                            // user.groupIdsInCommon = [];
                                                            user.groupIdsInCommon = temp4;

                                                            user.save();
                                                        })
                                                    }
                                                })
                                            // }

                                            console.log("here162");

                                            console.log("secondAdmin[0].groupIdsInCommon: " + secondAdmin[0].groupIdsInCommon);
                                            return res.status(400).json({
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