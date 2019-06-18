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
            let pattern = /([0-9]+)([a-z]+)/;
            let time = timer.match(pattern)[0];
            socket.emit("set_timer", time);

        }
    }
}