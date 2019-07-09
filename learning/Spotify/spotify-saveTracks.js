require('dotenv').config();
const Spotify = require('node-spotify-api');
const emotional = require('emotional');
const playlist_id = "1PPuh6XMr3gAe1lvLSotld";
const fs = require('fs');

let spotify = new Spotify({
    id: process.env.SpotifyClientID,
    secret: process.env.SpotifyClientSecret
});

function get100SongFeatures(tracks) {
    return new Promise(resolve => {
        let song_ids = "";

        for (const song of tracks) {
            song_ids += song.track.id + ",";
        }
        song_ids = song_ids.slice(0, (song_ids.length - 1));

        spotify.request(`https://api.spotify.com/v1/audio-features/?ids=${song_ids}`).then(features => {
            resolve(features);
        }).catch(err => {
            console.log("Error in getting song features:" + err);
        });
    });
}

async function getSongs(playlist_id) {
    let songs = [];
    let song_features = [];

    let complete_songs = [];

    console.log("Getting songs..");

    let tracks = await spotify.request(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`);
    let track_features = await get100SongFeatures(tracks.items);

    songs = songs.concat(tracks.items);
    song_features = song_features.concat(track_features.audio_features);

    while (tracks.next) {
        console.log("Found more songs.. adding to list.. current count:", songs.length);
        tracks = await spotify.request(tracks.next);
        track_features = await get100SongFeatures(tracks.items);

        songs = songs.concat(tracks.items);
        song_features = song_features.concat(track_features.audio_features);
    }

    for (let i = 0; i < songs.length; i++) {
        const track = songs[i];

        complete_songs.push({
            "artists": JSON.stringify(track.track.artists),
            "name": track.track.name,
            "url": track.track.href,
            "id": track.track.id,
            "features": song_features[i]
        });
    }
    console.log("------------ Finished Gathering Songs -----------");
    return complete_songs;
}

async function run() {
    return new Promise(async resolve => {
        let tracks = await getSongs(playlist_id);
        console.log("Total songs received:", tracks.length);
        fs.writeFileSync("tracks.json", JSON.stringify(tracks), 'utf8');
        resolve(tracks);
    });
}

run();