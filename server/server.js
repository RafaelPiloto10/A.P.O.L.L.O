const express = require('express');
const path = require('path');
const cors = require('cors'); // Unused import
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

const {
    wikiSearch
} = require("./api_scripts/wiki");

const {
    searchYoutube,
    searchGoogle
} = require("./api_scripts/google");

const {
    getCurrentWeatherCoord,
    getCurrentWeatherCity,
    getWeatherForecastCoord,
    getWeatherForecastCity
} = require("./api_scripts/owm");

// run server
const route = app.listen(port, () => {
    console.log("Server is up and running on port " + port);
});

const io = require('socket.io')(route);

// Use middleweare
app.use(express.json());
app.use(bodyparser.json());
app.use(cookieparser());

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyparser.urlencoded({
    extended: true
}));

// Site is static
app.use(express.static(path.join(__dirname + "/../client/")));

// session middleware - sets cookie
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));



// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// home route
app.get("/", (req, res, next) => {
    res.status(200).redirect("/login");
});

// route to check if user is authenticated
app.get("/auth", (req, res, next) => {
    if (req.session.user == 'authenticated') {
        res.status(200).json({
            authenticated: true
        });
    } else {
        res.status(403).json({
            authenticated: false
        });
    }
});

// route for login
app
    .get("/login", sessionChecker, (req, res, next) => {
        res.send(200).send("login/");
    })
    .post("/login", sessionChecker, (req, res, next) => {
        if (typeof req.body.username != 'undefined' && typeof req.body.password != 'undefined') {
            // Check database here for password and username in order to properly authenticate
            req.session.user = "authenticated";
            res.status(200).redirect('/dashboard');

        } else {
            res.status(200).json({
                message: "There was an issue with the request",
                error: "Password or Username are incorrect"
            })
        }
    });

// route for dashboard (APOLLO)
app.get("/apollo", (req, res, next) => {
    if (req.session.user == "authenticated" && req.cookies.user_sid) {
        res.status(200).redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});

// route for 404 error
app.get("*", (req, res, next) => {
    res.status(404).json({
        message: "Page not found"
    });
});

io.sockets.on('connection', (socket) => {
    console.log("New socket connection: " + socket.id);

    socket.on("youtubeSearch", async (topic) => {
        // console.log("Client:", socket.id, "is searching youtube for:", topic);
        // console.log("Youtube Key:", process.env.YOUTUBEKEY);
        await searchYoutube(process.env.YOUTUBEKEY, topic).then(data => {
            // console.log("Got results:", data[0]);
            socket.emit("youtubeSearchResults", data[0].id.videoId);
        });
    });

    socket.on("wikipediaSearch", async (topic) => {
        await wikiSearch(topic).then(link => {
            socket.emit("wikipediaSearchResults", link);
        })
    });

    socket.on("googleSearch", topic => {
        let link = searchGoogle(topic);
        socket.emit("googleSearchResults", link);
    });

    socket.on("getWeatherCoord", async (lat, lon) => {
        await getCurrentWeatherCoord(lat, lon).then(weather => {
            socket.emit("weather_current", weather);
        });
    });

    socket.on("getWeatherCity", async city => {
        await getCurrentWeatherCity(city).then(weather => {
            socket.emit("weather_current", weather);
        });
    });

    socket.on("getForecastCoord", async (lat, lon) => {
        await getWeatherForecastCoord(lat, lon, 7).then(weather => {
            socket.emit("weather_forecast", weather);
        });
    });

    socket.on("getForecastCity", async city => {
        await getWeatherForecastCity(city, 7).then(weather => {
            socket.emit("weather_forecast", weather);
        });
    });

    socket.on('disconnect', () => {
        console.log("New socket disconnected: " + socket.id)
    });
});