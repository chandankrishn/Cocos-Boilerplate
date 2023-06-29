var Watcher = require("watch-fs").Watcher;
var curl = require("curl");

var watcher = new Watcher({
  paths: ["./assets/"],
  filters: {
    includeFile: function (name) {
      return /\.ts$/.test(name);
    },
  },
});

var options = {};
var isUpdateable = true;

function updateDB() {
  if (!isUpdateable) {
    return;
  }
  console.log("UPDATE DB");
  isUpdateable = false;

  curl.get("http://localhost:7456/asset-db/refresh", options, function (err, response, body) {});
  setTimeout(canUpdate, 2000);
}

function canUpdate() {
  isUpdateable = true;
}

watcher.on("create", function (name) {
  console.log("file " + name + " created");
  updateDB();
});

watcher.on("change", function (name) {
  console.log("file " + name + " changed");
  updateDB();
});

watcher.on("delete", function (name) {
  console.log("file " + name + " deleted");
  updateDB();
});

watcher.start(function (err, failed) {
  console.log("watcher started");
  console.log("files not found", failed);
  console.log("err", err);
});
