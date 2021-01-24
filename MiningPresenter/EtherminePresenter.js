const getWorkers = require("../MiningService/EthermineAPI").getWorkers;
const database = require("../Database/MongoDAO");
const cron = require("node-cron");

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
                var uniqueWorkers = []
                var individualShares = []

                resp.forEach(element => {
                    element.workers.forEach( w => {
                        if (uniqueWorkers.includes(w.name) == false) {
                            individualShares.push(0);
                            uniqueWorkers.push(w.name);
                        }
                    });
                });

                // calculates each share
                resp.forEach( share => {

                    // for each worker    
                    share.workers.forEach( w => {
                        for (let index = 0; index < uniqueWorkers.length; index++) {
                            const element = uniqueWorkers[index];

                            // find the respective worker
                            if (element == w.name) {
                                // increments his share
                                individualShares[index] = individualShares[index] + w.share;
                            }
                        };
                    });
                });

                individualShares = individualShares.map( e => e/resp.length );

                var time = 0

                if (resp.length > 0) {
                    time = resp[0].time
                }

                var result = {
                    time: time,
                    share: []
                }

                console.log()

                for (let index = 0; index < uniqueWorkers.length; index++) {
                    const w = uniqueWorkers[index];
                    const share = individualShares[index]
                    
                    result.share.push( {
                        worker: w,
                        share: share
                    })
                };

                resolve(result)
            }).catch ( err => {
                reject(err)
            });

        }
    )

    return result

}

function startScheduler() {

    updateCurrentWorkers()

            //   # ┌────────────── second (optional)
            //   # │ ┌──────────── minute
            //   # │ │ ┌────────── hour
            //   # │ │ │   ┌──────── day of month
            //   # │ │ │   │ ┌────── month
            //   # │ │ │   │ │ ┌──── day of week
            //   # │ │ │   │ │ │
            //   # │ │ │   │ │ │
            //   # * * *   * * *
    cron.schedule("0 0 */2 * * *", () => {
        updateCurrentWorkers()
    });
}

module.exports = {updateCurrentWorkers, getWorkersShare, startScheduler}