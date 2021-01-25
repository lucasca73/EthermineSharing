const axios = require('axios').default;

// {
//     "BTC": 0.04418,
//     "USD": 1447.37,
//     "EUR": 1187.5
// }

function getCurrentDolarEther() {
    var url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR"
    return axios.get(url)
}

module.exports = {getCurrentDolarEther}