let server = "http://localhost:3000";
window.onload = () => {
    fetch(server + "/auth").then(response => response.json()).then(response => {
        if (!response.authenticated) {
            window.location.replace("/login");
        }
    });
    Apollo.speak(""); // Buffer speak to get rid of female voice
}

function setup() {
    noLoop();
}

function keyPressed() {
    if (keyCode == UP_ARROW) {}
}