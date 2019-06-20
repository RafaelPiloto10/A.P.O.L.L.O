class TextAnalysis {

    static parseCommand(t) {
        // Wait until the listening promise has been resolved
        Promise.resolve(t).then(function (transcript) {
            try {
                transcript = transcript.toLowerCase();

                let pattern = /(?:(hey))?(?:(apollo))?(?<command>(search)|(get)|(find)|(send))(?<topic>.*(?=on))(?<platform>.*)/;
                let results = transcript.match(pattern);
                // console.log(transcript, results);

                let command = results.groups["command"];
                let topic = results.groups["topic"];
                let platform = results.groups["platform"].split(" ").pop();

                console.log(command, topic, platform);
                TextAnalysis.processCommand(command, topic, platform);
            } catch (error) {
                // console.log(error, transcript);
                TextAnalysis.wildCardParse(transcript.toLowerCase());
            }

        });

    }

    static async processCommand(command, topic, platform) {
        switch (command) {
            case "search":
                switch (platform) {
                    case "youtube":
                        socket.emit("youtube_Search", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "wikipedia":
                        socket.emit("wikipedia_Search", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "google":
                        socket.emit("google_Search", topic);
                        Apollo.ListenAndParse();
                        break;

                    default:
                        socket.emit("google_Search", topic);
                        Apollo.ListenAndParse();
                        break;
                }
                break;
            case "find":
                switch (platform) {
                    case "youtube":
                        socket.emit("youtube_Search", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "wikipedia":
                        socket.emit("wikipedia_Search", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "google":
                        socket.emit("google_Search", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "maps":
                        socket.emit("google_Maps_Search", {
                            lat: currentLocation.lat,
                            lon: currentLocation.lon,
                            target: topic
                        });
                        Apollo.ListenAndParse();
                        break;

                    default:
                        socket.emit("google_Search", topic);
                        Apollo.ListenAndParse();
                        break;
                }
                break;
            case "send":
                switch (platform) {
                    case "gmail":
                        let email = await sendEmail();
                        socket.emit("send_email", email);
                        break;
                    default:
                        break;

                }
        }
    }

    static wildCardParse(transcript) {
        // Stop listening
        if (transcript.includes("stop listening") || transcript.includes("give me some privacy")) {
            Apollo.shouldBeListening = false;
            let response = Apollo.randomResponse(Apollo.agreementResponses);
            Apollo.speak(response);
        }

        // Get the weather
        if (transcript.includes("weather")) {

            if (transcript.includes(" in ")) { // Specified location
                let index = transcript.split(" ").findIndex(word => word == "in");
                let location = transcript.split(" ").slice(index + 1, transcript.length).join(" ");

                if (transcript.includes("forecast")) { // Forecast
                    socket.emit("get_Forecast_City", location);
                } else { // Current weather
                    socket.emit("get_Weather_City", location);
                }

            } else { // Use current location (Coordinates)
                if (transcript.includes("forecast")) { // Forecast
                    socket.emit("get_Forecast_Coord", currentLocation.lat, currentLocation.lon);
                } else { // Current weather
                    socket.emit("get_Weather_Coord", currentLocation.lat, currentLocation.lon);
                }
            }
        }

        if (transcript.includes("timer")) {
            let pattern = /[0-9]+ [a-z]+(( and |, |\s)[0-9]+ [a-z]+)*/;
            let time = timer.match(pattern)[0];
            socket.emit("set_timer", time);

        }

        if (transcript.includes("reminder")) {
            let pattern1 = /(?<reason>to .+)(?<time>(on|every|after|before|at|of|in) .+)/;
            let pattern2 = /(?<time>(on|every|after|before|at|of|in) .+)(?<reason>to .+)/;
            let match1 = transcript.match(pattern1);
            let match2 = transcript.match(pattern2);

            let reason = match1.groups.reason || match2.groups.reason;
            let time = match1.groups.time || match2.groups.time;

            console.log(transcript);
            console.log("time:", time);
            console.log("reason:", reason);
            if (reason && time) {
                socket.emit("set_reminder", time, reason);
                Apollo.speak("Reminder set").then(() => {
                    Apollo.ListenAndParse();
                });
            } else Apollo.speak("Could not parse your reminder").then(() => Apollo.ListenAndParse());

        }

        if (transcript.includes("translate")) {
            let pattern = /translate (?<tokens>[a-z].+) (to|in) (?<language>[a-z]*)/;
            let match = transcript.match(pattern);
            try {
                let {
                    tokens,
                    language
                } = match.groups;

                socket.emit("get_translation", tokens, language);

            } catch (error) {
                Apollo.speak("Could not parse your translation.").then(() => Apollo.ListenAndParse());
            }
        }
    }
}