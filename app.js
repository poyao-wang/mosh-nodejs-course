const EventEmitter = require("events");
const emitter = new EventEmitter();

//Register a listener
emitter.on("messageLogged", (arg) => {
  console.log("Listener called", arg);
});

// Raise and event
emitter.emit("messageLogged", { id: 1, url: "http://" });
