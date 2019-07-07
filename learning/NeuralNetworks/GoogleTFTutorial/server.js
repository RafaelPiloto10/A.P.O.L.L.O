// https://codelabs.developers.google.com/codelabs/tfjs-training-regression/index.html#0

const express = require('express');
const app = express();

app.use(express.static("./public/"));

const route = app.listen(3000, () => {
    console.log("Server listening on http://localhost:3000");
});