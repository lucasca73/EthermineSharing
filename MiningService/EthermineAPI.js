const axios = require('axios').default;
const Miner = "0x73Fbb3ABeD739764a4aaF97E060434fb02d33866"

function getWorkerHistory(worker) {
    return axios.get(`https://api.ethermine.org/miner/${Miner}/worker/${worker}/history`)
}

function getWorkers() {
    return axios.get(`https://api.ethermine.org/miner/${Miner}/workers`)
}

module.exports = {getWorkers, getWorkerHistory}