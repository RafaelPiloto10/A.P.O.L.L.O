const {
    wikiSearch
} = require("./api_scripts/wiki");

const {
    searchYoutube,
    searchGoogle,
    searchGoogleMaps,
    setGoogleTimer,
    searchGoogleTranslate
} = require("./api_scripts/google");

const {
    getCurrentWeatherCoord,
    getCurrentWeatherCity,
    getWeatherForecastCoord,
    getWeatherForecastCity
} = require("./api_scripts/owm");

const {
    sendEmail
} = require("./api_scripts/email");

const later = require('later');
later.date.localTime();

async function handleCommand(witResults, args) { // client_location, reminder_callback, socket_callback)
    let transcript = witResults._text;
    console.log("Recieved NLP Parse request:", transcript);
    console.log(witResults);

    let platform = witResults.entities.platform ? witResults.entities.platform[0].value : undefined;
    let command = witResults.entities.command ? witResults.entities.command[0].value : undefined;
    let search_query = witResults.entities.search_query ?
        (witResults.entities.search_query.length > 1 ?
            witResults.entities.search_query.reduce((prev, current) => prev.value + " " + current.value) : witResults.entities.search_query[0].value) :
        undefined;
    let duration = witResults.entities.duration ? witResults.entities.duration[0].value + " " + witResults.entities.duration[0].unit : undefined;
    let location = witResults.entities.location ? witResults.entities.location[0].value : undefined;
    let reminder = witResults.entities.reminder ? witResults.entities.reminder[0].value : undefined;
    let datetime = witResults.entities.datetime ? new Date(witResults.entities.datetime[0].from.value) : undefined;
    // NEEDS FURTHER TESTING - AFTER CURRENTLY WORKS
    let time_key

    try {
        time_key = transcript.match(/(after | before | on | every | at | of | in)/)[0];
    } catch {}

    console.log("Platform:", platform || "NONE");
    console.log("Command:", command || "NONE");
    console.log("Query:", search_query || "NONE");
    console.log("Duration:", duration || "NONE");
    console.log("Location:", location || "NONE");
    console.log("Reminder:", reminder || "NONE");
    console.log("Date time:", datetime || "NONE");

    if (command == undefined && platform == undefined) {
        // This is a greeting intent
        args.socket_callback("greet_intent");

    } else if (platform == "google" && search_query) {
        // This is a google search
        let link = searchGoogle(search_query);
        args.socket_callback("google_Search_Results", link);

    } else if ((platform == "wikipedia" || platform == "wiki") && search_query) {
        // This is a wiki search
        let link = await wikiSearch(search_query).catch(err => console.error(err));
        args.socket_callback("wikipedia_Search_Results", link);

    } else if (platform == "youtube" && search_query) {
        // This is a youtube search
        let link = await searchYoutube(search_query).catch(err => console.error(err));
        args.socket_callback("youtube_Search_Results", link);

    } else if ((platform == "google maps" || (command == "find" && platform == undefined)) && (search_query || location)) {
        // This is a google maps search
        let link = searchGoogleMaps(search_query || location, args.client_location);
        args.socket_callback("google_maps_search_results", link);

    } else if ((command == "remind" || platform == "reminder") && reminder && (datetime || duration)) {
        // This is a reminder
        try {

            function send_reminder() {
                args.socket_callback("reminder_met", reminder);
            }

            let text = "after " + datetime.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });

            console.log(text);

            let timer = later.parse.text(text);

            later.setTimeout(send_reminder, timer);
        } catch (error) {
            console.error("Error when trying to set reminder:", error);
            args.socket_callback("custom_error", "Error while trying to set reminder");
        }

    } else if (platform == "timer" && (datetime || duration)) {
        // This is a timer
        let link = setGoogleTimer(duration || datetime);
        args.socket_callback("google_timer", link);

    } else if (search_query == "weather") {
        // This is a weather search
        if (location) {
            let weather = await getCurrentWeatherCity(location).catch(err => console.error(err));
            args.socket_callback("weather_current", weather);
        } else {
            let weather = await getCurrentWeatherCoord(args.location.lat, args.location.lon).catch(err => console.error(err));
            args.socket_callback("weather_current", weather);
        }
    } else if (search_query == "weather forecast") {
        // This is a weather forecast search
        if (location) {
            let weather = await getWeatherForecastCity(location).catch(err => console.error(err));
            args.socket_callback("weather_forecast", weather);
        } else {
            let weather = await getWeatherForecastCoord(args.location.lat, args.location.lon).catch(err => console.error(err));
            args.socket_callback("weather_forecast", weather);
        }

    } else if (command == "translate" && language && search_query) {
        // Translate search
        let link = searchGoogleTranslate(search_query, language);
        args.socket_callback("translation_link", link);
    } else if (command == "send" || search_query == "email" || platform == "gmail") {
        // send email
        args.socket_callback("begin_send_email");
    } else {
        args.socket_callback("retry_intent");
    }

}

module.exports = {
    handleCommand
}