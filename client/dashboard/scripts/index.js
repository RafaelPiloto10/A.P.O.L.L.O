let server = location.hostname == "localhost" || location.hostname == "127.0.0.1" ? "http://localhost:3000" : "https://apollo-assistant.herokuapp.com/";

window.onload = () => {
    if (!('SpeechRecognition' in window)) {
        window.location.replace("/unsupported");
    }

    fetch(server + "/auth").then(response => response.json()).then(response => {

        if (!response.authenticated) {
            window.location.replace("/login");
            console.error("Could not authenticate with server");

        } else {
            fetch("https://ipapi.co/json")
                .then(results => results.json())
                .then(results => socket.emit("new_user_info", results))
                .catch(() => {
                    window.location.replace("/login");
                    console.error("Error: Could not authenticate IP");
                });
        }
    }).catch((err) => {
        console.log(err);
        window.location.replace("/login");
        console.error("Error: There was an error trying to authenticate with server");
    });

    Apollo.speak(""); // Buffer speak to get rid of female voice
}

function setup() {
    noLoop();
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        Apollo.shouldBeListening = true;
        Apollo.ListenAndParse();
    }
    if (keyCode == DOWN_ARROW) {
        recognition.stop();
        Apollo.isListening = false;
        Apollo.shouldBeListening = false;
        console.log("Stopped listening");
    }
}