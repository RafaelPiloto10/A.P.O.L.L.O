require('dotenv').config();
const Spotify = require('node-spotify-api');

let spotify = new Spotify({
    id: process.env.SpotifyClientID,
    secret: process.env.SpotifyClientSecret
});


function getFeaturedPlaylist() {
    return new Promise(resolve => {
        spotify
            .request('https://api.spotify.com/v1/browse/featured-playlists')
            .then(data => {
                data.playlists.items.forEach((playlist, i, arr) => {
                    console.log(playlist.name);
                })
                spotify.request(`https://api.spotify.com/v1/playlists/${data.playlists.items[0].id}/tracks`).then(async playlist => {
                    resolve(playlist);
                });
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });

    });
}

function getSongs(playlist) {
    let songs = []
    return new Promise(async resolve => {
        for (const track of playlist.items) {
            let track_features = await getSongFeatures(track.track.id);
            songs.push({
                "artists": JSON.stringify(track.track.artists),
                "song-name": track.track.name,
                "url": track.track.href,
                "id": track.track.id,
                "features": track_features
            });
        }
        resolve(songs);
    });
}

function getSongFeatures(track_id) {
    return new Promise(resolve => {
        spotify.request(`https://api.spotify.com/v1/audio-features/${track_id}`).then(features => {
            resolve(features);
        }).catch(err => {
            console.log("Error in getting song features:" + err);
        });
    });
}

Promise.resolve(getFeaturedPlaylist()).then(playlist => {
    Promise.resolve(getSongs(playlist)).then(songs => {
        // console.log(songs);
    });
});