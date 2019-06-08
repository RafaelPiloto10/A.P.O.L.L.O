require('dotenv').config();

let SpotifyWebAPI = require('spotify-web-api-node');

let spotifyApi = new SpotifyWebAPI({
    clientId: process.env.SpotifyClientID,
    clientSecret: process.env.SpotifyClientSecret,
    redirectUri: 'http://www.example.com/callback'

});

spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);

        spotifyApi.getMySavedTracks({
                limit: 2,
                offset: 1
            })
            .then(function (data) {
                console.log('Done!');
            }, function (err) {
                console.log('Something went wrong!', err);
            });


    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err.message);
    });