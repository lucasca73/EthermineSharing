var presenter = require("./MiningPresenter/EtherminePresenter");
var server = require("./server")

// Initiate scheduler
presenter.startScheduler();

// Initiate server
server.start()