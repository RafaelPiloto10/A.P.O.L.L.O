const fs = require('fs');
const emotional = require('emotional');


const file = fs.readFileSync(__dirname + "/../../SongLyrics.json");
let songs = JSON.parse(file);


function run() {
    let cleaned_songs = [];

    return new Promise(async resolve => {
        for (let i = 0; i < songs.length; i++) {
            if (songs[i].message.header.status_code == 200) {
                let song = songs[i];
                song.message.body.lyrics.lyrics_body = songs[i].message.body.lyrics.lyrics_body.slice(0, -59).split("\n").join(" ");
                let sentiment = await getSentiment(song.message.body.lyrics.lyrics_body);
                song.sentiment = sentiment;
                cleaned_songs.push(song);
                console.log("Finished song", i, "/", songs.length);
            }
        }

        resolve(cleaned_songs);
    });
}


function getSentiment(lyric) {
    return new Promise(resolve => {
        emotional.load(() => {
            let sentiment = emotional.get(lyric);
            resolve(sentiment);
        });
    });
}
run().then(cleaned_songs => {
    fs.writeFileSync("lyrics-clean.json", JSON.stringify(cleaned_songs));
});