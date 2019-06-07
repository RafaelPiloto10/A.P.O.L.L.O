class Apollo {
    static toggleMic() {
        let imgURl = document.getElementById("mic").src;
        if (imgURl.includes("active")) {
            document.getElementById("mic").src = imgURl.replace("active", "idle");
        } else {
            document.getElementById("mic").src = imgURl.replace("idle", "active");
        }
    }

    static speak(message) {
        return new Promise(resolve => {
            let msg = new SpeechSynthesisUtterance(message);
            // AHA Moment! Voices load after window loads / first call to speak is made. Need a buffer call
            msg.voice = speechSynthesis.getVoices().find((voice) => voice.voiceURI == "Google UK English Male");
            msg.pitch = 1;
            msg.volume = 1; // 0 to 1
            msg.rate = 1; // 0.1 to 10

            speechSynthesis.speak(msg);

            msg.onstart = function (e) {
                Apollo.toggleMic()
            }

            msg.onend = function (e) {
                console.log('Finished in ' + event.elapsedTime + ' seconds.');
                Apollo.toggleMic();
                resolve();
            };
        })
    }

    static listen() {

    }
}