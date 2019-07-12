const express = require('express');
const app = express();
const fs = require('fs');

const file = fs.readFileSync("./assets/lyrics-clean.json");
const data = JSON.parse(file);

app.use(express.static("./public/"));

const route = app.listen(3000, () => {
    console.log("App listening on http://localhost:3000");
});

app.get("/trainingData", (req, res, next) => {
    res.status(200).json(data);
});