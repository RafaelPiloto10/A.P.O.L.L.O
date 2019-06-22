const fetch = require('node-fetch');
require("dotenv").config();

function getCurrentWeatherCoord(lat, lon) {
    return new Promise(resolve => {
        let link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OWMKEY}&units=imperial`;
        fetch(link).then(res => res.json()).then(weather => resolve(weather));
    });
}

function getCurrentWeatherCity(city) {
    return new Promise(resolve => {
        let link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OWMKEY}&units=imperial`;
        fetch(link).then(res => res.json()).then(weather => resolve(weather));
    });
}

function getWeatherForecastCoord(lat, lon, cnt = 5) {
    return new Promise(resolve => {
        let link = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${process.env.OWMKEY}&units=imperial`;
        fetch(link).then(res => res.json()).then(weather => resolve(weather));
    });
}

function getWeatherForecastCity(city, cnt = 5) {
    return new Promise(resolve => {
        let link = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${cnt}&appid=${process.env.OWMKEY}&units=imperial`;
        fetch(link).then(res => res.json()).then(weather => resolve(weather));
    });
}

module.exports = {
    getCurrentWeatherCoord: getCurrentWeatherCoord,
    getCurrentWeatherCity: getCurrentWeatherCity,
    getWeatherForecastCoord: getWeatherForecastCoord,
    getWeatherForecastCity: getWeatherForecastCity
}