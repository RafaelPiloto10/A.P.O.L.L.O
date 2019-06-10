let server = "http://localhost:3000";
window.onload = () => {
    fetch(server + "/auth").then(response => response.json()).then(response => {
        if (!response.authenticated) {
            window.location.replace("/login");
        }
    });

    Apollo.speak(""); // Buffer speak to get rid of female voice
    Apollo.shouldBeListening = true;
    TextAnalysis.parseCommand(Apollo.listen());
}

function setup() {
    noLoop();
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        Apollo.shouldBeListening = true;
        Apollo.listen().then(results => {
            TextAnalysis.parseCommand(results);
        });
    }
    if (keyCode == DOWN_ARROW) {
        recognition.stop();
        Apollo.isListening = false;
        Apollo.shouldBeListening = false;
        console.log("Stop listening");
    }
}