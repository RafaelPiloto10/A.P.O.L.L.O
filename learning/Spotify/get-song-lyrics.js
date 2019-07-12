const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();



let file = fs.readFileSync(__dirname + "/../tracks.json");
let tracks = JSON.parse(file);

let song_lyrics = [];

async function get_song_lyrics() {
    for (let i = 0; i < tracks.length; i++) {
        let song = tracks[i];
        let song_name = song.name;
        let artist = JSON.parse(song.artists)[0].name;
        let song_features = song.features;
        let url = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&q_track=${song_name}&q_artist=${artist.split(" ").join("%20")}&apikey=${process.env.MUSIXMATCHAPI}`;

        let request = await fetch(url).then(res => res.json());

        request["song_name"] = song_name;
        request["artist"] = artist;
        request["features"] = song_features;

        song_lyrics.push(request);

        console.log("Song", i, "/", tracks.length);
        if (request.message.header.status_code != 200) {
            console.log("Status code is not 200 for song:", song_name, "by", artist);
        }
    }
}

get_song_lyrics().then(() => {
    fs.writeFileSync("./SongLyrics.json", JSON.stringify(song_lyrics));
})