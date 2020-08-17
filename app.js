const EventEmitter = require("events");
const emitter = new EventEmitter();

//Register a listener
emitter.on("messageLogged", function () {
  console.log("Listener called");
});

// Raise and event
emitter.emit("messageLogged");
