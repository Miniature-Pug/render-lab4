let http = require('https');
let url = require("url");
let qs = require("querystring")
const PORT = process.env.PORT || 3030;

const word_to_definition = {}

http.createServer(function (request, response) {
    let parsed_url = url.parse(request.url, true)
    if (request.method == "GET") {
        let word = parsed_url.query["word"]
        if (word in word_to_definition) {
            response.writeHead(200, {'Content-type': "text/plain"});
            response.write(word_to_definition[word]);
            response.end();
        } else {
            response.writeHead(400, {'Content-type': "text/plain"});
            response.write(`${word} does not have an existing definition`);
            response.end();
        }
    } else if (request.method == "POST") {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let parsed_body = qs.parse(body);
            if (parsed_body["word"] && parsed_body["definition"]) {
                if (!(parsed_body["word"] in word_to_definition)) {
                    word_to_definition[parsed_body["word"]] = parsed_body["definition"]
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end(`New definition saved for word "${parsed_body["word"]}" with the definition "${parsed_body["definition"]}". Number of definitions in dictionary = ${Object.keys(word_to_definition).length}`);
                } else {
                    response.writeHead(400, { 'Content-Type': 'text/plain' });
                    response.end("Definition already exists for this word");
                }
            } else {
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                response.end("Missing 'definition' or 'word' parameter in POST body");
            }
        });
    }

}).listen(PORT);

console.log(`Listening on port ${PORT}...`)