var currentLocation;
if (navigator.geolocation) {
    let getLocation = navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        currentLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
    });
}