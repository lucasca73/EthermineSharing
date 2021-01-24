var presenter = require("./MiningPresenter/EtherminePresenter");

//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;
const axios = require('axios').default;

function start() {
    //Create HTTP server and listen on port 3000 for requests
    const server = http.createServer( async (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        var response = await presenter.getWorkersShare()
        res.end(JSON.stringify(response));
    });

    //listen for request on port 3000, and as a callback function have the port listened on logged
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

module.exports = {start}