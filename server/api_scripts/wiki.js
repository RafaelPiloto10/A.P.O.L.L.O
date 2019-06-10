const fetch = require("node-fetch");

const APIURL = "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=";
const searchURL = "https://en.wikipedia.org/?curid=";


async function wikiSearch(topic) {
    return new Promise(resolve => {
        console.log("Searching wiki for:", topic)
        let url = fetch(APIURL + topic)
            .then(res => res.json())
            .then(json => resolve(searchURL + json.query.search[0].pageid))
            .catch(error => console.log(error));
    })
}

module.exports = {
    wikiSearch: wikiSearch
}