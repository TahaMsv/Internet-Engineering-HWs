const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const grouupsRoutes = require("./api/routes/groups");
const chatsRoutes = require("./api/routes/chats");
const authRoutes = require("./api/routes/auth");
const connectionRequestsRoutes = require("./api/routes/connection_requests");
const joinRequestsRoutes = require("./api/routes/join_requests");


mongoose.connect('mongodb://localhost/chatMessenger');
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use("/api/v1/groups", grouupsRoutes);
app.use("/chats", chatsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/connection_requests", connectionRequestsRoutes);
app.use("/join_requests", joinRequestsRoutes);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            
        }
    });
});


module.exports = app;
