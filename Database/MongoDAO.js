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
                database.collection("workers").insertMany(logs, ( function (err, resp) {
                    if (err) reject(err);
                    resolve(resp);
                }));
            });
        }
    );

    return result
}

module.exports = {getWorkers, addWorkerLog}