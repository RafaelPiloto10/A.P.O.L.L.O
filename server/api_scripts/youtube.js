const {
    google
} = require('googleapis'); // Load google api

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

module.exports = {
    searchYoutube: searchYoutube
}