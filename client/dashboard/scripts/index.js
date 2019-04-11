let server = "http://localhost:3000";
fetch(server + "/auth").then(response => response.json()).then(response => {
    if (!response.authenticated) {
        window.location.replace("/login");
    }
});