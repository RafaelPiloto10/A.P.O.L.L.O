require('dotenv').config();

let api_url = 'https://spotify-mood.herokuapp.com/api/v1/';

function getLikeSong(song_title, exclude = undefined) {
    return new Promise(async resolve => {
        let url = api_url + `song-title?auth=${process.env.CUSTOMSPOTIFYAUTH}&song=${song_title}${exclude ? "&exclude=" + exclude : ""}`;
        let results = await fetch(url).then(res => res.json()).catch(err => console.log("Error with custom Spotify API:", err));
        resolve(results);
    });
}

function getSongFromMood(sentence, exclude = undefined) {
    return new Promise(async resolve => {
        let url = api_url + `sentiment?auth=${process.env.CUSTOMSPOTIFYAUTH}&sentence=${sentence}${exclude ? "&exclude=" + exclude : ""}`;
        let results = await fetch(url).then(res => res.json()).catch(err => console.log("Error with custom Spotify API:", err));
        resolve(results);
    });
}

module.exports = {
    getLikeSong,
    getSongFromMood
}