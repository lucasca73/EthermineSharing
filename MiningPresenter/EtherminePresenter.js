const getWorkers = require("../MiningService/EthermineAPI").getWorkers;
const database = require("../Database/MongoDAO");

function updateCurrentWorkers() {

    getWorkers().then( resp => {
        console.log("Adding logs to database...")
        database.addWorkerLog(resp.data.data)
    })

}

function getWorkersShare() {

    var result = new Promise(
        function (resolve, reject) {

            database.getWorkers().then( resp => {
                console.log(resp)
            }).catch ( err => {
                console.log(err)
            });

        }
    )

    return result

}

module.exports = {updateCurrentWorkers, getWorkersShare}