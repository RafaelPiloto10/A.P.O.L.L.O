let finalTranscript = "";
var recogText = document.getElementById("recognition-text");

// Prepare all speech recongnition api's
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

let colors = ['apollo', 'aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral'];
let grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

var recognition = new SpeechRecognition();
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 10;


// If the api loaded?
// if (annyang) {
//     var commands = {
//         // Interactive commands
//         "(hello) (hey) Apollo": function () {
//             Apollo.speak("Hello");
//         },

//         // ----------- Experiemental search --------------
//         "(hey) (Apollo) :command *topic on :platform": function (command, topic, platform) {
//             console.log(command, topic, platform);

//         },

//         // -------------------- Test output commands ---------------------------
//         ":nomatch": function (nomatch) {
//             Apollo.speak("Sorry I do not recognize the command: " + nomatch)
//         }
//     }
// }

// annyang.addCommands(commands); // Listen for these commands

// annyang.addCallback("resultNoMatch", (phrases) => {
//     phrases.forEach(r => {
//         if (r.toLowerCase().includes("apollo")) {
//             console.log("Could not find command:", phrases);
//             return;
//         }
//     });
// });

// annyang.start(); // Begin listening

recognition.start();

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
recognition.onspeechend = function (event) {
    console.log("Speech ended");
    TextAnalysis.parseCommand(finalTranscript);

    finalTranscript = "";
    recogText.innerHTML = "";

}

recognition.onnomatch = function (event) {
    Apollo.speak("I couldn't understand that");
}

recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
    recognition.stop();
    annyang.start();
}