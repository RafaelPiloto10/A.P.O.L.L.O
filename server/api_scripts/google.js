const {
    google
} = require('googleapis'); // Load google api

const fs = require('fs');

require('dotenv').config();

const GoogleURL = "https://google.com/search?q=";

async function searchYoutube(topic) {
    let YouTubeAPI = google.youtube({ // Authenticate Youtube API
        version: 'v3',
        auth: process.env.GOOGLEKEY
    });

    return await YouTubeAPI.search.list({
        part: "snippet",
        q: topic
    }).then((videos) => {
        console.log("Sending youtube query results!");
        return `https://www.youtube.com/watch?v=${videos.data.items[0].id.videoId}`;
    }).catch((error) => {
        console.log(error);
        return error;
    });
}

function searchGoogle(topic) {

    let searchQuery = topic.split(" ").join("+").split("'").join("%27").split("!").join("%21").split("?").join("%3F");
    console.log("Searching Google:", topic);
    return GoogleURL + searchQuery;
}

function searchGoogleMaps(location) {
    let searchQuery = `https://www.google.com/maps/search/${location.target}/@${location.lat},${location.lon}z`
    console.log("Searching Google Maps:", location.target);
    return searchQuery;
}

function setGoogleTimer(time) {
    return searchGoogle("timer " + time);

}

function searchGoogleTranslate(tokens, language) {
    let contents = fs.readFileSync(require('path').resolve(__dirname, "../assets/language_codes.json"));
    let language_codes = JSON.parse(contents);

    tokens = tokens.split(" ").join("%20").split("?").join("%3F").split(",").join("%2C");
    let link = `https://translate.google.com/#view=home&op=translate&sl=en&tl=${language_codes[language]}&text=${tokens}`;
    console.log("Searching Google Translate:", tokens, "in", language, ",", language_codes[language]);
    return link;
}


module.exports = {
    searchYoutube,
    searchGoogle,
    searchGoogleMaps,
    setGoogleTimer,
    searchGoogleTranslate
}