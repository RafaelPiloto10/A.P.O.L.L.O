function getForecastMessage(weather) {

    let descriptions = new Map();
    let min_temps = [];
    let max_temps = [];
    let wind_speed = [];
    let humidity = [];

    weather.list.forEach((value, index, arr) => {
        if (descriptions.get(value.weather[0].description)) {
            descriptions.set(descriptions.get(value.weather[0].description) + 1);
        } else descriptions.set(value.weather[0].description, 1);

        min_temps.push(Math.floor(value.main.temp_min));
        max_temps.push(Math.floor(value.main.temp_max));
        wind_speed.push(Math.floor(value.wind.speed));
        humidity.push(Math.floor(value.main.humidity));

    });

    let max_avg = Math.floor(max_temps.reduce((prev, current) => prev + current) / max_temps.length);
    let min_avg = Math.floor(min_temps.reduce((prev, current) => prev + current) / min_temps.length);
    let windSpeed_avg = Math.floor(wind_speed.reduce((prev, current) => prev + current) / wind_speed.length);
    let humidity_avg = Math.floor(humidity.reduce((prev, current) => prev + current) / humidity.length);

    let maxCount = 0;
    let avg_descriptions = [];

    for (let [description, count] of descriptions) {
        if (count == maxCount) avg_descriptions.push(description)
        else if (count > maxCount) {
            avg_descriptions = [];
            avg_descriptions.push(description);
        }
    }

    let msg_descriptions = (avg_descriptions.length >= 3) ? avg_descriptions.join(", ") : avg_descriptions.join(" and ");

    return [
        ["The weather forecast predicts the average low to be " + min_avg + " and the average high to be " + max_avg +
            "."
        ],
        ["The average wind speed predicted is " + windSpeed_avg + " miles per hour. Humidity is predicted to average " + humidity_avg +
            " percent for this week."
        ],
        ["The overall weather for this week appears to be " + msg_descriptions + "."]
    ];
}

function sendEmail() {
    return new Promise(async resolve => {
        let TO, SUBJECT, TEXT;
        // .replace(" at ", "@").replace(" dot ", ".").split(" ").join("");
        while (TO == undefined) {
            console.log("Sending Email: Getting To");
            TO = await new Promise(async resolveTo => {
                await Apollo.speak(Apollo.randomResponse(Apollo.toPrompts));
                Apollo.shouldBeListening = true;
                let to = await Apollo.listen(10 * 1000);
                to = to.replace(" at ", "@").replace(" dot ", ".").split(" ").join("");
                let confirmedTo = false;
                while (!confirmedTo) {
                    await Apollo.speak(to + ". " + Apollo.randomResponse(Apollo.confirmPrompts));


                    let confirmation = await new Promise(resolve => {
                        let listenLoop = setTimeout(async () => {
                            Apollo.shouldBeListening = true;
                            Apollo.isListening = false;
                            console.log("Trying to get confirmation");
                            await Apollo.listen().then(c => {
                                if (c) {
                                    clearInterval(listenLoop);
                                    resolve(c);
                                }
                            });

                        }, 1000);
                    });
                    console.log("Confirmation:", confirmation);
                    if (confirmation == "yes") {
                        confirmedTo = true;
                        resolveTo(to);
                    } else if (confirmation == "no") {
                        confirmedTo = true;
                        resolveTo(undefined);
                    }
                }
            });
        }

        while (SUBJECT == undefined) {
            console.log("Sending Email: Getting Subject");
            SUBJECT = await new Promise(async resolveSubject => {
                await Apollo.speak(Apollo.randomResponse(Apollo.subjectPrompts));
                Apollo.shouldBeListening = true;
                let subject = await Apollo.listen();
                let confirmedSubject = false;
                while (!confirmedSubject) {
                    await Apollo.speak(subject + ". " + Apollo.randomResponse(Apollo.confirmPrompts));


                    let confirmation = await new Promise(resolve => {
                        let listenLoop = setTimeout(async () => {
                            Apollo.shouldBeListening = true;
                            Apollo.isListening = false;
                            console.log("Trying to get confirmation");
                            await Apollo.listen().then(c => {
                                if (c) {
                                    clearInterval(listenLoop);
                                    resolve(c);
                                }
                            });

                        }, 1000);
                    });
                    console.log("Confirmation:", confirmation);
                    if (confirmation == "yes") {
                        confirmedSubject = true;
                        resolveSubject(subject);
                    } else if (confirmation == "no") {
                        confirmedSubject = true;
                        resolveSubject(undefined);
                    }
                }
            });
        }

        while (TEXT == undefined) {
            console.log("Sending Email: Getting text");
            TEXT = await new Promise(async resolveText => {
                await Apollo.speak(Apollo.randomResponse(Apollo.textPrompts));
                Apollo.shouldBeListening = true;
                let text = await Apollo.listen(10 * 1000);
                let confirmedText = false;
                while (!confirmedText) {
                    await Apollo.speak(text + ". " + Apollo.randomResponse(Apollo.confirmPrompts));


                    let confirmation = await new Promise(resolve => {
                        let listenLoop = setTimeout(async () => {
                            Apollo.shouldBeListening = true;
                            Apollo.isListening = false;
                            console.log("Trying to get confirmation");
                            await Apollo.listen().then(c => {
                                if (c) {
                                    clearInterval(listenLoop);
                                    resolve(c);
                                }
                            });

                        }, 1000);
                    });
                    console.log("Confirmation:", confirmation);
                    if (confirmation == "yes") {
                        confirmedText = true;
                        resolveText(text);
                    } else if (confirmation == "no") {
                        confirmedText = true;
                        resolveText(undefined);
                    }
                }
            });
        }

        console.log("Finished getting to:", TO);
        console.log("Finished getting subject:", SUBJECT);
        console.log("Finished getting text:", TEXT);
        resolve({
            to: TO,
            subject: SUBJECT,
            text: TEXT
        });
    });
}