class TextAnalysis {

    static processCommand(transcript) {
        transcript = transcript.toLowerCase();
        let pattern = /(hey)? (apollo)? (?<command>(search)|(get)|(find))(?<topic>.*(?=on))(?<platform>.*)/
        let results = transcript.match(pattern);

        let command = results.groups["command"];
        let topic = results.groups["topic"];
        let platform = results.groups["platform"].split(" ").pop();

        console.log(command, topic, platform);
    }

}