class TextAnalysis {

    static parseCommand(transcript) {
        transcript = transcript.toLowerCase();
        let pattern = /(?:(hey))?(?:(apollo))?(?<command>(search)|(get)|(find)|(send))(?<topic>.*(?=on))(?<platform>.*)/;
        let results = transcript.match(pattern);
        console.log(transcript, results);

        try {
            let command = results.groups["command"];
            let topic = results.groups["topic"];
            let platform = results.groups["platform"].split(" ").pop();

            console.log(command, topic, platform);
            this.processCommand(command, topic, platform);
        } catch {
            console.log("No match:", transcript);
        }
    }

    static processCommand(command, topic, platform) {
        switch (command) {
            case "search":
                switch (platform) {
                    case "youtube":
                        socket.emit("youtubeSearch", topic);
                        recognition.start();
                        break;
                }
                break;
        }
    }

}