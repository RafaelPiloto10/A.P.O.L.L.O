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

                // console.log(command, topic, platform);
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
                        socket.emit("youtubeSearch", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "wikipedia":
                        socket.emit("wikipediaSearch", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "google":
                        socket.emit("googleSearch", topic);
                        Apollo.ListenAndParse();
                        break;

                    default:
                        socket.emit("googleSearch", topic);
                        Apollo.ListenAndParse();
                        break;
                }
                break;
            case "find":
                switch (platform) {
                    case "youtube":
                        socket.emit("youtubeSearch", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "wikipedia":
                        socket.emit("wikipediaSearch", topic);
                        Apollo.ListenAndParse();
                        break;

                    case "google":
                        socket.emit("googleSearch", topic);
                        Apollo.ListenAndParse();
                        break;

                    default:
                        socket.emit("googleSearch", topic);
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
                    socket.emit("getForecastCity", location);
                } else { // Current weather
                    socket.emit("getWeatherCity", location);
                }

            } else { // Use current location (Coordinates)
                if (transcript.includes("forecast")) { // Forecast
                    socket.emit("getForecastCoord", currentLocation.lat, currentLocation.lon);
                } else { // Current weather
                    socket.emit("getWeatherCoord", currentLocation.lat, currentLocation.lon);
                }
            }
        }
    }

}