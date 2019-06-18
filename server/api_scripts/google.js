const {
    google
} = require('googleapis'); // Load google api

const GoogleURL = "https://google.com/search?q=";

async function searchYoutube(key, topic) {
    console.log("YoutubeKey:", key);
    let YouTubeAPI = google.youtube({ // Authenticate Youtube API
        version: 'v3',
        auth: key
    });

    return await YouTubeAPI.search.list({
        part: "snippet",
        q: topic
    }).then((videos) => {
        console.log("Sending youtube query results!");
        return videos.data.items;
    }).catch((error) => {
        console.log(error);
        return error;
    });
}

function searchGoogle(topic) {

    let searchQuery = topic.replace(" ", "+").replace("'", "%27").replace("!", "%21").replace("?", "%3F");
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

module.exports = {
    searchYoutube,
    searchGoogle,
    searchGoogleMaps,
    setGoogleTimer
}