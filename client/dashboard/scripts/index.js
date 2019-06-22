let server = "http://localhost:3000";
window.onload = () => {
    fetch(server + "/auth").then(response => response.json()).then(response => {
        if (!response.authenticated) {
            window.location.replace("/login");
        } else {
            fetch("https://ipapi.co/json")
                .then(results => results.json())
                .then(results => socket.emit("new_user_info", results))
                .catch(() => {
                    window.location.replace("/login");
                    alert("Error: Could not authenticate IP");
                });
        }
    }).catch(() => {
        window.location.replace("/login");
        alert("Error: Could not authenticate with server");
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