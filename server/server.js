const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const session = require('express-session');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname + "/../client/")));

app.get("/", (req, res, next) => {
    res.status(200).redirect("/login");
});

app
    .get("/login", (req, res, next) => {
        res.send(200).send("login/");
    })
    .post("/login", (req, res, next) => {
        if (typeof req.body.username != 'undefined' && typeof req.body.password != 'undefined') {
            res.status(200).json({
                message: "POST on login was recieved.",
                error: ""
            });
        } else {
            res.status(200).json({
                message: "There was an issue with the request",
                error: "Password or Username are incorrect"
            })
        }
    });

app.get("/dashboard", (req, res, next) => {
    res.status(200).send("dashboard/");
});


app.get("*", (req, res, next) => {
    res.status(404).json({
        message: "Page not found"
    });
});

app.listen(port, () => {
    console.log("Server is up and running on port " + port);
});