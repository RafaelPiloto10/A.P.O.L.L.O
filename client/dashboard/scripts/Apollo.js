class Apollo {
    static toggleMic() {
        let imgURl = document.getElementById("mic").src;
        if (imgURl.includes("active")) {
            document.getElementById("mic").src = imgURl.replace("active", "idle");
        } else {
            document.getElementById("mic").src = imgURl.replace("idle", "active");
        }
    }
}