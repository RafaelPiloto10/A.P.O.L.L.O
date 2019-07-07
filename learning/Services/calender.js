// https://stackoverflow.com/questions/42015397/still-possible-to-use-google-calendar-api-with-api-key
const {
    google
} = require('googleapis'); // Load google api

require('dotenv').config();

console.log(process.env.GOOGLEKEY);

function listEvents() {
    const calendar = google.calendar({
        version: 'v3',
        auth: process.env.GOOGLEKEY
    });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}

listEvents();