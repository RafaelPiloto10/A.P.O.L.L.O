require('dotenv').config();
const Spotify = require('node-spotify-api');
const emotional = require('emotional');

let spotify = new Spotify({
    id: process.env.SpotifyClientID,
    secret: process.env.SpotifyClientSecret
});


const map = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getSongsFromList(playlist_list) {
    let songs = []
    return new Promise(async resolve => {
        let features_list = await getSongFeaturesFromList(playlist_list.items);
        console.log("Features list:", features_list.audio_features.length, "should be:", playlist_list.items.length);

        for (let i = 0; i < playlist_list.items.length; i++) {
            let track = playlist_list.items[i];
            songs.push({
                "artists": JSON.stringify(track.track.artists),
                "name": track.track.name,
                "url": track.track.href,
                "id": track.track.id,
                "features": features_list.audio_features[i]
            });
        }

        resolve(songs);
    });
}

function getSongFeaturesFromList(song_list) {
    return new Promise(resolve => {
        let song_ids = "";

        for (const song of song_list) {
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

function run() {
    return new Promise(resolve => {
        spotify
            .request('https://api.spotify.com/v1/browse/featured-playlists')
            .then(async data => {
                let track_list = [];
                for (const playlist of data.playlists.items) {
                    console.log("Getting Playlist:", playlist.name);
                    let tracks = await spotify.request(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`).catch(err => console.log(err));
                    let result = await getSongsFromList(tracks);
                    track_list = track_list.concat(result);

                }
                resolve(track_list);

            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });

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

    let pol_map = map(sentiment.polarity, -1, 1, 0, 1);
    let sub_map = map(sentiment.subjectivity, 0, 1, 0, .3);

    return {
        danceability: Math.min((pol_map + sub_map) / 2 + dance_weight, .8),
        energy: Math.min(((pol_map + sub_map) / 2) + energy_weight, .8),
        loudness: Math.max(-map(sentiment.polarity, -1, 1, 0, 60), -55),
        valence: Math.min(((sentiment.polarity + sub_map) / 2) + valence_weight, .8)
    }
}

emotional.load(() => {
    Promise.resolve(run()).then(songs => {
        console.log("--------------------");
        console.log("Finised getting all songs:", songs.length);

        let sentiment = emotional.get("I am having a terrible day!");
        console.log(sentiment);

        let target_song = calculate_best_song(sentiment);
        console.log("Target song:", target_song);

        let best_song_error = {
            name: "",
            danceability: 1,
            energy: 1,
            loudness: -60,
            valence: 1
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

        console.log("------ Finding best song ---------");

        for (const song of songs) {
            let {
                danceability,
                energy,
                loudness,
                valence,
                tempo,
                instrumentalness,
                speechiness
            } = song.features;

            if (instrumentalness > .25 || song.name.toLowerCase().includes("relaxation")) continue;

            let name = song.name;
            let artists = song.artists;
            let url = song.url
            let id = song.id;

            let dance_error = Math.abs(target_song.danceability - danceability);
            let energy_error = Math.abs(target_song.energy - energy);
            let loudness_error = Math.abs(target_song.loudness - loudness);
            let valence_error = Math.abs(target_song.valence - valence);

            if (dance_error < .25 && energy_error < .20 && loudness_error < 40 && valence_error < .20) {
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
                    instrumentalness
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
        console.log("Suggested songs found:", suggested_songs);
    });


});