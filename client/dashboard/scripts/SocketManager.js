var socket = io.connect();

socket.on('connect', () => {
    console.log("uid: " + socket.io.engine.id);
});

socket.on('youtube_Search_Results', (link) => {
    openLink(link)
});

socket.on('wikipedia_Search_Results', link => {
    openLink(link);
});

socket.on('google_Search_Results', link => {
    openLink(link);
});

socket.on("weather_current", weather => {
    let currentWeather = weather.weather[0];

    Apollo.speak(Apollo.randomResponse(Apollo.agreementResponses) +
        ". The weather appears to be: " + currentWeather.description +
        " with a low of " + Math.floor(weather.main.temp_min) +
        " and a high of " + Math.floor(weather.main.temp_max) +
        ". Wind is traveling " + Math.floor(weather.wind.speed) +
        " miles per hour at " + weather.wind.deg + " degrees.").then(() => {
        Apollo.ListenAndParse();
    })
});

socket.on("weather_forecast", weather => {
    let message = getForecastMessage(weather);
    Apollo.speak(Apollo.randomResponse(Apollo.agreementResponses) + ". " + message[0][0])
        .then(Apollo.speak(message[1][0]))
        .then(Apollo.speak(message[2][0]))
        .then(() => {
            Apollo.ListenAndParse();
        })
});

socket.on("email_sent", async status => {
    console.log(status);
    if (status.status == "ERROR") await Apollo.speak("There was an issue with sending the email");
    else await Apollo.speak("Email sent successfully!");
    Apollo.ListenAndParse();
});

socket.on("google_maps_search_results", link => {
    openLink(link);
});

socket.on("google_timer", link => {
    openLink(link);
});

socket.on("reminder_met", reason => {
    if (window.speechSynthesis.speaking) {
        let waitLoop = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
                clearInterval(waitLoop);
            }
        }, 2000);
    }

    Apollo.speak("Time to " + reason);
});

socket.on("translation_link", link => {
    openLink(link);
});

socket.on("custom_error", error => {
    console.log(error);
})