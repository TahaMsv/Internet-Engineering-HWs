const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");

const User = require("../models/user");
const Group = require("../models/group");
const ConnectionRequest = require("../models/connection-request");
const connectionRequest = require("../models/connection-request");
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
                                    connectionRequest[0].isAccepted = true;
                                    connectionRequest[0].save().then(result => {
                                        adminUser[0].groupIdsInCommon.addToSet(secondAdmin[0].group);
                                        secondAdmin[0].groupIdsInCommon.addToSet(adminUser[0].group);
                                        adminUser[0].groupIdsInCommon.map(item =>
                                            {
                                                if(secondAdmin[0].group !=item){
                                                    secondAdmin[0].groupIdsInCommon.addToSet(item)
                                                }
                                                
                                            } );
                                        secondAdmin[0].groupIdsInCommon.map(item => {
                                            if(adminUser[0].group !=item){
                                                adminUser[0].groupIdsInCommon.addToSet(item);
                                            }
                                            
                                        });
                                        adminUser[0].save();
                                        secondAdmin[0].save();
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