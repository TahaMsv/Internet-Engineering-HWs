const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Group = require("../models/group");
const checkAuth = require("../middleware/check-auth");
const { response } = require("../../app");

const myUsers = [
    { name: 'shark', likes: 'ocean' },
    { name: 'turtle', likes: 'pond' },
    { name: 'otter', likes: 'fish biscuits' }
]



router.get("/", checkAuth, (req, res, next) => {
    
    Group.find({}).select('-_id primaryId name description',).sort({ primaryId: 'ascending' }).exec((err, docs) => {

        const groupsListResponse = docs.map(item => {
            const newMap = {};
            newMap.id = item.primaryId;
            newMap.name = item.name;
            newMap.description = item.description;
            
            // container[item.name] = item.likes;
            // container.age = item.name.length * 10;
        
            return newMap;
        })

        res.status(200).json(
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
                                        requestIDs: [],
                                    });
                                    group.save()
                                        .then(result => {
                                            // user[0].group
                                            var conditions = { email: user[0].email }
                                                , update = { group: result.primaryId, isAdmin: true };
                                            console.log(conditions)
                                            console.log(update)
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

    // var numberOFGroups =0;
    // Group.count({}, function( err, count){
    //     numberOFGroups =count ;
    // })
    // const group = new User({
    //     _id: new mongoose.Types.ObjectId,
    //     id:numberOFGroups,
    //     name: req.body.name,
    //     description: req.body.description,
    //     requestIDs: [],
    // });

    // group.save()
    // .then(result => {
    //     console.log(result);
    //     return res.status(200).json({

    //         // create id
    //         "group": {
    //           "id": "1"
    //         },
    //         "message": "successful"
    //       });
    // })
    // .catch(err => {
    //     console.log(err);
    //     return res.status(500).json({
    //         "error": {
    //           "message": "Bad request!"
    //         }
    //       });
    // });
});

// router.post("/my", (req, res, next) => {
//   res.status(200).json(
//     {
//       "message": "handling my method requests in groups"
//     }
//   );
// });


module.exports = router;