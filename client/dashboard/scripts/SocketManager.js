const socket = io.connect();

socket.on('connect', () => {
    console.log("uid: " + socket.io.engine.id);
});