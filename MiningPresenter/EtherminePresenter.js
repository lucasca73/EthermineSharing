const ethermineService = require("../MiningService/EthermineAPI");
const getCurrentDolarEther = require("../MiningService/CurrencyAPI").getCurrentDolarEther;
const database = require("../Database/MongoDAO");
const cron = require("node-cron");

function updateCurrentWorkers() {

    ethermineService.getWorkers().then( resp => {
        console.log("Adding logs to database...")
        database.addWorkerLog(resp.data.data)
    })

}

async function getPayments() {

    var payouts = (await ethermineService.getPayout()).data.data;
    var stats = (await ethermineService.getUnpaidStats()).data.data;
    var dolar = (await getCurrentDolarEther()).data;

    var payments = []

    payouts.forEach( p => {
        payments.push({
            paid: true,
            time: p.paidOn,
            eth: p.amount * 0.000000001 * 0.000000001,
            usd: p.amount * 0.000000001 * 0.000000001 * dolar.USD
        })
    });

    payments.push({
        paid: false,
        time: stats.time,
        eth: stats.unpaid * 0.000000001 * 0.000000001,
        usd: stats.unpaid * 0.000000001 * 0.000000001 * dolar.USD
    })

    return payments
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
                    time = new Date(resp[0].time*1000);
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

module.exports = {updateCurrentWorkers, getWorkersShare, startScheduler, getPayments}