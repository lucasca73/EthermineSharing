var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function getWorkers() {

    var result = new Promise(
        function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db("miners");
                database.collection("workers").find({}).toArray( function (err, resp) {
                    if (err) reject(err);
                    resolve(resp);
                });
            });
        }  
    );

    return result
}

function addWorkerLog(logs) {

    var result = new Promise(
        function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var database = db.db("miners");
                var collection = database.collection("workers");

                if (logs.length < 1 ) {
                    reject(null);
                    return
                }

                var workers = []
                var totalShare = 0
                
                logs.forEach(element => {
                    var w = {
                        name: element.worker,
                        avg: element.averageHashrate/1000000,
                        share: 0
                    };

                    totalShare += element.averageHashrate/1000000;

                    workers.push(w);
                });

                workers.forEach(element => {
                    element.share = element.avg/totalShare;
                });

                var obj =   {
                                "time": logs[0].time,
                                "totalShare": totalShare,
                                "workers": workers
                            }

                // set workers primary key
                collection.insertOne(obj)

                resolve(true)
            });
        }
    );

    return result
}

module.exports = {getWorkers, addWorkerLog}