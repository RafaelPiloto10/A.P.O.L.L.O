// Tutorial followed by Daniel Shiffman - The Coding Train (https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw)
const express = require('express');
const app = express();

app.use(express.static("./public/"));

let route = app.listen(3000, () => {
    console.log("Server is up and listening");
});