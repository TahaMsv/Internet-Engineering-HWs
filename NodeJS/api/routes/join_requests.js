const express = require("express");
const router = express.Router();

// router.get("/", (req, res, next) => {
//     res.status(200).json({
//         "message": "handling Get requests in join_request"
//     });
// });

router.post("/", (req, res, next) => {

    User.find({ email: req.userData.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                if (user[0].group != req.body.groupId) {
                    Group.find({ primaryId: req.body.groupId })
                        .exec()
                        .then(group => {



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

// router.get("/group", (req, res, next) => {
//     res.status(200).json({
//         "message": "handling Get method requests in join_request/group"
//     });
// });

// router.post("/accept", (req, res, next) => {
//     res.status(200).json({
//         "message": "handling Post method requests in join_request/accept"
//     });
// });


module.exports = router;