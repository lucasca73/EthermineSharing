const axios = require('axios').default;
const Miner = "0x73Fbb3ABeD739764a4aaF97E060434fb02d33866"

function getWorkerHistory(worker) {
    return axios.get(`https://api.ethermine.org/miner/${Miner}/worker/${worker}/history`)
}

// [
//     {
//         "start": 11680964,
//         "end": 11704134,
//         "amount": 3003631965851380000,
//         "txHash": "0x82c43db5e1a308cd395574da9d9c2699cce167c546ff4663aad8fcc75cd3db60",
//         "paidOn": 1611303084
//     }
// ]
function getPayout() {
    return axios.get(`https://api.ethermine.org/miner/${Miner}/payouts` )
}

function getWorkers() {
    return axios.get(`https://api.ethermine.org/miner/${Miner}/workers`)
}

function getUnpaidStats() {
    return axios.get(`https://api.ethermine.org/miner/${Miner}/currentStats`)
}

module.exports = {getWorkers, getWorkerHistory, getPayout, getUnpaidStats}