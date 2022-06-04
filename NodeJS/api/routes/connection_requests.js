const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");

const User = require("../models/user");
const Group = require("../models/group");
const ConnectionRequest = require("../models/connection-request");
// router.get("/", checkAuth, (req, res, next) => {
//     User.find({ email: req.userData.email })
//     .exec()
//     .then(user => {
//         const connectionRequestsListResponse = user[0].connectionRequestIDs.map(crId => {
//             JoinRequest.find({ id: crId })
//                 .exec()
//                 .then(jr => { return jr[0]; })
//         });
//         const filterdList = connectionRequestsListResponse.filter(item => item.connectionRequestId != )
//         joinRequestsListResponse.select('-_id id groupId userId date',).sort({ date: 'descending' }).exec((err, docs) => {
//             res.status(200).json(
//                 {
//                     "joinRequests": docs
//                 }
//             );
//         });
//     });
// });

// router.post("/", checkAuth, (req, res, next) => {
//     User.find({ email: req.userData.email })
//         .exec()
//         .then(user => {
//             if (user.length >= 1) {
//                 if (user[0].isAdmin) {
//                     Group.find({ primaryId: req.body.groupId })
//                         .exec()
//                         .then(group => {
//                             ConnectionRequest.count({}, function (err, count) {
//                                 const connectionRequest = new ConnectionRequest({
//                                     _id: new mongoose.Types.ObjectId,
//                                     connectionRequestId: count + 1,
//                                     groupId: group[0].primaryId,
//                                 });

//                                 connectionRequest.save()
//                                     .then(result => {
//                                         user[0].connectionRequestIDs.push(result.id);
//                                         user[0].save();
//                                         group[0].recievedConnectionRequestIDs.push(result.id)
//                                         return res.status(200).json({
//                                             "message": "successful"
//                                         });
//                                     })
//                                     .catch(err => {
//                                         console.log(err);
//                                         return res.status(400).json({
//                                             "error": {
//                                                 "message": "Bad request!"
//                                             }
//                                         });
//                                     });
//                             })
//                         });
//                 } else {
//                     return res.status(400).json({
//                         "error": {
//                             "message": "Bad request!"
//                         }
//                     });
//                 }
//             } else {
//                 return res.status(400).json({
//                     "error": {
//                         "message": "Bad request!"
//                     }
//                 });
//             }
//         })
// });


// router.post("/accept", checkAuth, (req, res, next) => {
//     res.status(200).json({
//         "message": "handling Post method requests inconnection_requests/accept"
//     });
// });


module.exports = router;