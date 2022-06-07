const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Group = require("../models/group");
const checkAuth = require("../middleware/check-auth");


router.get("/", checkAuth, (req, res, next) => {
    Group.find({}).select('-_id primaryId name description',).sort({ primaryId: 'descending'  }).exec((err, docs) => {
        const groupsListResponse = docs.map(item => {
            const newMap = {};
            newMap.id = item.primaryId;
            newMap.name = item.name;
            newMap.description = item.description;
            return newMap;
        })
       return res.status(200).json(
            {
                "groups": groupsListResponse
            }
        );
    });

});

router.post("/", checkAuth, (req, res, next) => {
    Group.find({ name: req.body.name })
        .exec()
        .then(group => {
            if (group.length < 1) {
                User.find({ email: req.userData.email })
                    .exec()
                    .then(user => {
                        if (user.length >= 1) {
                            if (user[0].group == null) {
                                Group.count({}, function (err, count) {
                                    const group = new Group({
                                        _id: new mongoose.Types.ObjectId,
                                        primaryId: count + 1,
                                        name: req.body.name,
                                        description: req.body.description,
                                    });
                                    group.save()
                                        .then(result => {
                                            var conditions = { email: user[0].email }
                                                , update = { group: result.primaryId, isAdmin: true };
                                            User.updateOne(conditions, update, { multi: true }).then(updatedRows => {
                                                console.log(updatedRows);
                                            }).catch(err => {
                                                console.log(err)
                                            })
                                            return res.status(200).json({
                                                "group": {
                                                    "id": count + 1
                                                },
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
                        } else {

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
});

router.get("/my", checkAuth, (req, res, next) => {
    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                if (user[0].group != null) {
                    Group.find({ primaryId: user[0].group })
                        .exec()
                        .then(group => {
                            User.find({ group: group[0].primaryId }).select('-_id primaryId name isAdmin',).sort({ dateOfjoin: 'descending', primaryId: 'descending' }).exec((err, members) => {

                                const membersListResponse = members.map(item => {
                                    const newMap = {};
                                    newMap.id = item.primaryId;
                                    newMap.name = item.name;
                                    newMap.email = item.email;
                                    newMap.rule = item.isAdmin ? "owner" : "normal";
                                    return newMap;
                                })
                                return res.status(400).json({
                                    "group": {
                                        "name": group[0].name,
                                        "description": group[0].description,
                                        "members": membersListResponse
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