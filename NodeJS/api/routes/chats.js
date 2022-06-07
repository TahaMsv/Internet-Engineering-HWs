const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");

const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");

router.get("/", checkAuth, (req, res, next) => {
    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                Chat.find({ $or: [{ user1ID: user[0].primaryId }, { user2ID: user[0].primaryId }] })
                    .select('-_id user1ID user2ID',)
                    .sort({ lastmessageDate: 'descending', id: 'descending' })
                    .exec(async (err, docs) => {
                        if (docs.length == 0) {
                            return res.status(200).json(
                                {
                                    "chats": []
                                }
                            );
                        }
                        console.log("here27")
                        const chatsListResponse =  docs.map(async item => {
                            const newMap = {};
                            var idToFind = item.user2ID;
                            if (item.user1ID == user[0].primaryId) {
                                idToFind = item.user2ID;
                            } else {
                                idToFind = item.user1ID;
                            }
                            console.log("here35")
                            const user2 = await User.find({ primaryId: idToFind })
                                .exec();
                            console.log(user2);
                            console.log("here38")
                            console.log(user2.name)
                            newMap.userId = idToFind;
                            newMap.name = user2[0].name;
                            return newMap;


                        })
                        const list = await Promise.all(chatsListResponse)
                        console.log("here47")
                        return res.status(200).json(
                            {
                                "chats": list
                            }
                        );
                    });




            } else {
                return;
            }
        }).catch(err => {
            return;
        })
});

router.get("/:user_id", checkAuth, (req, res, next) => {
    console.log("here63")
    User.find({ email: req.userData.email })
        .exec()
        .then(user1 => {
            console.log("here67")
            if (user1.length >= 1) {
                User.find({ primaryId: req.params.user_id })
                    .exec()
                    .then(user2 => {
                        console.log("here72")
                        console.log([{ user1: user1[0].primaryId, user2: user2[0].primaryId }
                            , { user1: user2[0].primaryId, user2: user1[0].primaryId }])
                        if (user2.length >= 1) {
                            Message.find({
                                $or: [{ sentby: user1[0].primaryId, receiver: user2[0].primaryId }
                                    , { sentby: user2[0].primaryId, receiver: user1[0].primaryId }]
                            }).select('-_id message date sentby',).sort({ date: 'descending', id: 'descending' }).exec((err, docs) => {
                                console.log("here85");
                                console.log(docs);
                                if (docs.length == 0) {
                                    console.log("here85")
                                    return res.status(400).json({
                                        "error": {
                                            "message": "Bad request!"
                                        }
                                    });
                                }
                                console.log("here92")
                                res.status(200).json(
                                    {
                                        "messages": docs
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

router.post("/:user_id", checkAuth, (req, res, next) => {

    User.find({ email: req.userData.email })
        .exec()
        .then(user1 => {
            if (user1.length >= 1) {
                console.log("here128");
                User.find({ primaryId: req.params.user_id })
                    .exec()
                    .then(user2 => {
                        console.log("here131");
                        if (user2.length >= 1) {
                            console.log("here134");
                            var haveCommonGroup = false
                            console.log(user2[0].group);
                            console.log(user1[0].group);
                            if (user2[0].group == user1[0].group) {
                                console.log("haveCommonGroup = true;");
                                haveCommonGroup = true;

                            }
                            if (!haveCommonGroup) {
                                user1[0].groupIdsInCommon.map(g1 => {
                                    console.log("here136: " + g1);
                                    user2[0].groupIdsInCommon.map(g2 => {
                                        console.log("here138: " + g2);
                                        if (g1 == g2 || g1 == user2[0].group || g2 == user1[0].group) {
                                            haveCommonGroup = true;

                                        }
                                    })
                                })

                            }
                            console.log("here156");
                            console.log(haveCommonGroup);
                            if (haveCommonGroup) {
                                Chat.find({
                                    $or: [{ user1: user1[0].primaryId, user2: user2[0].primaryId }
                                        , { user1: user2[0].primaryId, user2: user1[0].primaryId }]
                                })
                                    .exec()
                                    .then(chat => {
                                        if (chat.length < 1) {
                                            Chat.count({}, function (err, count) {
                                                const chat = new Chat({
                                                    _id: new mongoose.Types.ObjectId,
                                                    id: count + 1,
                                                    user1ID: user1[0].primaryId,
                                                    user2ID: user2[0].primaryId,
                                                });
                                                chat.save()
                                                    .then(result => {
                                                        const message = new Message({
                                                            _id: new mongoose.Types.ObjectId,
                                                            id: result.messages.length + 1,
                                                            sentby: user1[0].primaryId,
                                                            receiver: user2[0].primaryId,
                                                            message: req.body.message,
                                                        });
                                                        message.save()
                                                            .then(messageResult => {
                                                                result.messages.push(messageResult.id);
                                                                result.lastmessageDate = Date.now();
                                                                result.save();
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
                                                    })
                                                    .catch(err => {
                                                        return res.status(400).json({
                                                            "error": {
                                                                "message": "Bad request!"
                                                            }
                                                        });
                                                    });
                                            })
                                        } else {
                                            const message = new Message({
                                                _id: new mongoose.Types.ObjectId,
                                                id: chat[0].messages.length + 1,
                                                sentby: user1[0].primaryId,
                                                receiver: user2[0].primaryId,
                                                message: req.body.message,
                                            });
                                            message.save()
                                                .then(messageResult => {
                                                    chat[0].messages.push(messageResult.id);
                                                    chat[0].lastmessageDate = Date.now();
                                                    chat[0].save();
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
                                        }

                                    })
                            } else {
                                console.log("here194");
                                return res.status(400).json({
                                    "error": {
                                        "message": "Bad request!"
                                    }
                                });
                            }

                        } else {
                            console.log("here201");
                            return res.status(400).json({
                                "error": {
                                    "message": "Bad request!"
                                }
                            });
                        }
                    })
            } else {
                console.log("here210");
                return res.status(400).json({
                    "error": {
                        "message": "Bad request!"
                    }
                });
            }
        })

});


module.exports = router;