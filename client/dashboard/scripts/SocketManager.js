var socket = io.connect();

socket.on('connect', () => {
    console.log("uid: " + socket.io.engine.id);
});

socket.on('youtubeSearchResults', (id) => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
});