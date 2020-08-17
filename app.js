const fs = require("fs");

//Synchronous function
// const files = fs.readdirSync("./");
// console.log(files);

//Asynchronous function
fs.readdir("./", function (err, files) {
  if (err) console.log("Error", err);
  else console.log("Result", files);
});
