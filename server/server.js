const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname + "/../client/")));

app.get("/", (req, res, next) => {
    res.status(200).redirect("/login");
});

app.get("/login", (req, res, next) => {
    res.send(200).send("login/");
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