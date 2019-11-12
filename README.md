# A.P.O.L.L.O (A Pretty Original Lovely Looking Object)

## Description

A Personal Assistant hosted on the browser that can complete various tasks upon request using your voice!

## Functionality

Current Obvious Trigger words:

* `search` (topic) `on` (platform)
* `find` (topic) `on` (platform)
* `send` (topic) `on` (platform)

Current platforms implemented:

* GMAIL
* YouTube
* Google
* Wikipedia
* Google Maps
* Google Translate

Other commands include:

* Getting the weather / weather forecast for the current location or requested city
* Request voice recognition to be turned off
  * `Stop listening` or `Give me some privacy` disables voice recongnition
  * Pressing the down arrow key also disables voice recognition (pressing the up arrow enables)
* `Set a timer (time)` - Sets a timer on a different tab
* `Set a reminder to (reminder) (at/before/after/on/etc) (time)`
  * Order in which the reminder and time are said does not matter

### Spotify Recommender Command

Request a song recommendation using either:

* Sentiment Analysis - Provide a sentence that describes your current mood.
* Similar Song - Provide a song title that describes your current mood and a similar song will be recommended.

## Installation

Coming Soon!

## Senior Seminar

[Senior Seminar Folder](senior-seminar/)

## TODO

* [x] Implement [Socket.IO](https://socket.io/)
* [x] Implement YouTube API
* [x] Implement Wikipedia API
* [x] Implement Google Search
* [X] Implement [OpenWeatherMap](https://openweathermap.org/) API
* [X] Implement [Nodemailer](https://nodemailer.com/about/) Library
* [X] Implement [IP Search](https://ipapi.co/) for security
* [X] Implement Google Maps Search
* [x] Implement Timer functionality
* [X] Implement [Reminder](https://bunkat.github.io/later/index.html) functionality (+10 seconds only)
* [X] Implement [Google Translate Search](https://developers.google.com/admin-sdk/directory/v1/languages)
* [X] Implemenet [DialogFlow](https://dialogflow.com/) for better language processing (hard to implement with Node JS)
* [X] Implement [Wit.ai](https://wit.ai/docs/quickstart) for easier language processing integration
* [ ] Implement Spotify Mood Player
  * Built prototype - COMPLETE
  * Built prototype Neural Network - Need to export model and implement with JS
* [ ] Build/Improve landing page for Spotify Recommender API

* [More ideas for future implementation](https://fossbytes.com/useful-google-assistant-voice-commands/)
* Discovered solution to Google Security Policy preventing device access ie Microphone & location [Solution](https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339)
  * [chrome://flags/#unsafely-treat-insecure-origin-as-secure](chrome://flags/#unsafely-treat-insecure-origin-as-secure)
