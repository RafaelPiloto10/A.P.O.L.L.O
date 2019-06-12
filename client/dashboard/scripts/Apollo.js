class Apollo {
    static isListening = false;
    static shouldBeListening = false;

    static agreementResponses = ["As you wish", "Yes sir", "What ever you say", "Right away"];

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
            console.log("Speaking:", message);

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
                console.log('Finished in ' + event.elapsedTime + ' ms.');
                Apollo.toggleMic();
                resolve();
            };

            msg.onerror = function (e) {
                console.log(e);
            }
        });
    }

    static listen() {
        return new Promise(resolve => {
            if (!Apollo.isListening && Apollo.shouldBeListening) {
                let listenLoop = setInterval(() => {
                    if (Apollo.isListening) clearInterval(listenLoop);
                    try {
                        recognition.start();
                    } catch {}

                }, 1000);
            } else {}

            recognition.onstart = function (event) {
                Apollo.isListening = true;
            }

            recognition.onresult = function (event) {
                let interimTranscripts = "";
                setTimeout(() => recognition.stop(), 7000);
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    let transcript = event.results[i][0].transcript;
                    transcript.replace("\n", "<br>");
                    if (event.results[i].isFinal) finalTranscript += transcript;
                    else interimTranscripts += transcript;
                    recogText.innerHTML = finalTranscript + '<span style="color:#999">' + interimTranscripts + '</span';
                }
            }

            recognition.onnomatch = function (event) {
                recognition.stop();
                Apollo.isListening = false;
                Apollo.speak("I couldn't understand that");

                resolve(Apollo.listen());
            }

            recognition.onerror = function (event) {

                if (event.error != "no-speech") {
                    console.log('Error occurred in recognition: ' + event.error);
                }

                recognition.stop();
                Apollo.isListening = false;

                resolve(Apollo.listen());
            }

            recognition.onspeechend = function (event) {
                recognition.stop();
                Apollo.isListening = false;
                Apollo.shouldBeListening = false;

                console.log("Speech ended");
                let transcript = finalTranscript;
                finalTranscript = "";
                recogText.innerHTML = "";
                resolve(transcript);

            }
        });
    }

    static randomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length - 1) + 1];
    }

}