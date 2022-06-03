const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../../models/user");
const Group = require("../../models/group");

// const CreateGroup = require("../../models/createGroup");

// // var groupID =1;

// router.get("/", (req, res, next) => {
//   res.status(200).json(
//     {
//       "message": "handling Get requests in groups"
//     }
//   );
// });

router.post("/", (req, res, next) => {

    //check if user exist in the group//
 
    const group = new User({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        description: req.body.description,
        requestIDs: [],
    });

    group.save()
    .then(result => {
        console.log(result);
        return res.status(200).json({

            // create id
            "group": {
              "id": "1"
            },
            "message": "successful"
          });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            "error": {
              "message": "Bad request!"
            }
          });
    });
});

// router.post("/my", (req, res, next) => {
//   res.status(200).json(
//     {
//       "message": "handling my method requests in groups"
//     }
//   );
// });


module.exports = router;