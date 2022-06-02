const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");

const CreateGroup = require("../../models/createGroup");

// var groupID =1;

router.get("/", (req, res, next) => {
  res.status(200).json(
    {
      "message": "handling Get requests in groups"
    }
  );
});

router.post("/", (req, res, next) => {

  const cg = new CreateGroup(
    {
      name: req.body.groups,
      description: req.body.groups
    }
  );
  cg.save()
    .then(result => {
      console.log(result);
      res.status(200).json(
        {
          "group": {
            "id": groupID,
          },
          "message": "successful",
          "groupCreted": cg
        }
      );
      // groupID+=1;
    })
    .catch(err => {
      console.log(err);
    });
 
});

router.post("/my", (req, res, next) => {
  res.status(200).json(
    {
      "message": "handling my method requests in groups"
    }
  );
});


module.exports = router;