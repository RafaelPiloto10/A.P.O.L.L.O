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