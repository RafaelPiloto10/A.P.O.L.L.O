require('dotenv').config();
const Spotify = require('node-spotify-api');
const emotional = require('emotional');
const playlist_id = "1PPuh6XMr3gAe1lvLSotld";

let spotify = new Spotify({
    id: process.env.SpotifyClientID,
    secret: process.env.SpotifyClientSecret
});

let best_song_error = {
    name: "",
    danceability: 1,
    energy: 1,
    loudness: -60,
    valence: 1,
    dance_error: 1,
    energy_error: 1,
    valence_error: 1

}

let suggested_songs = {
    danceable: {
        name: "",
        danceability: 1,
        energy: 1,
        loudness: -60,
        valence: 1,
        dance_error: 1,
        energy_error: 1,
        loudness_error: 1,
        valence_error: 1,
    },
    energetic: {
        name: "",
        danceability: 1,
        energy: 1,
        loudness: -60,
        valence: 1,
        dance_error: 1,
        energy_error: 1,
        loudness_error: 1,
        valence_error: 1,
    },
    most_valent: {
        name: "",
        danceability: 1,
        energy: 1,
        loudness: -60,
        valence: 1,
        dance_error: 1,
        energy_error: 1,
        loudness_error: 1,
        valence_error: 1,
    }
};


const map = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

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
        resolve(tracks);
    });
}


/**
 * 
 * danceability: 0.0 -> 1.0 most danceable
 * energy: 0.0 -> 1.0 high intensity and activity
 * loudness: typically between -60 and 0 (0 being quiet)
 * valence: 0.0 -> 1.0 very positive track
 * tempo: no limit
 * 
 */

function calculate_best_song(sentiment) {

    let dance_weight = .3;
    let energy_weight = .2;
    let valence_weight = .2;

    let dance_max = 1;
    let energy_max = 1;
    let loudness_max = -59;
    let valence_max = 1;

    let pol_map = map(sentiment.polarity, -1, 1, 0, 1);
    let sub_map = map(sentiment.subjectivity, 0, 1, 0, .5);

    return {
        danceability: Math.max(Math.min((pol_map + sub_map) / 2 + dance_weight, dance_max), 0),
        energy: Math.max(Math.min(((pol_map + sub_map) / 2) + energy_weight, energy_max), 0),
        loudness: Math.max(-map(sub_map, 0, .5, 0, 60), loudness_max) - 1,
        valence: Math.max(Math.min(pol_map + valence_weight, valence_max), 0)
    }
}

emotional.load(() => {
    Promise.resolve(run()).then(results => {
        let bound_1 = Math.min(Math.floor(Math.random() * results.length) + 75, results.length);
        let bound_2 = Math.max(Math.floor(Math.random() * results.length) - 50, 0);

        let lower_bound = Math.min(bound_1, bound_2);
        let upper_bound = Math.max(bound_1, bound_2);

        let songs = results.slice(lower_bound, upper_bound);

        console.log("--------------------\n");
        console.log("Lower bound:", lower_bound, "Upper bound:", upper_bound, "\n");

        let sentiment = emotional.get("I am having a bad day.");
        console.log("Sentence Sentiment Score:", sentiment);
        console.log("\n");

        let target_song = calculate_best_song(sentiment);
        console.log("Target song:", target_song);
        console.log("\n");


        console.log("\n------ Finding best song ---------");

        for (const song of songs) {
            let {
                danceability,
                energy,
                loudness,
                valence,
                tempo,
            } = song.features;


            let name = song.name;
            let artists = song.artists;

            let dance_error = Math.abs(danceability - target_song.danceability) / target_song.danceability;
            let energy_error = Math.abs(energy - target_song.energy) / target_song.energy;
            let loudness_error = Math.abs(loudness - target_song.loudness) / target_song.loudness;
            let valence_error = Math.abs(valence - target_song.valence) / target_song.valence;

            if (dance_error < best_song_error.dance_error && energy_error < best_song_error.energy_error && valence_error < best_song_error.valence_error) {
                best_song_error = {
                    danceability,
                    energy,
                    loudness,
                    valence,
                    tempo,
                    dance_error,
                    energy_error,
                    loudness_error,
                    valence_error,
                    name,
                    artists,
                }
            }

            if (dance_error <= suggested_songs.danceable.dance_error) {
                suggested_songs.danceable = {
                    danceability,
                    energy,
                    loudness,
                    valence,
                    tempo,
                    dance_error,
                    energy_error,
                    loudness_error,
                    valence_error,
                    name,
                    artists
                }
            }
            if (energy_error <= suggested_songs.energetic.energy_error) {
                suggested_songs.energetic = {
                    danceability,
                    energy,
                    loudness,
                    valence,
                    tempo,
                    dance_error,
                    energy_error,
                    loudness_error,
                    valence_error,
                    name,
                    artists
                }
            }
            if (valence_error <= suggested_songs.most_valent.valence_error) {
                suggested_songs.most_valent = {
                    danceability,
                    energy,
                    loudness,
                    valence,
                    tempo,
                    dance_error,
                    energy_error,
                    loudness_error,
                    valence_error,
                    name,
                    artists
                }
            }
        }

        console.log("Best song found:", best_song_error.name == '' ? "NONE" : best_song_error);
        console.log("\n\n");
        console.log("Suggested songs found:", suggested_songs);
    });


});