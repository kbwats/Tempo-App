var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var request = require("request");
var app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("public"));



var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App listening on Port " + PORT);
});



require("./routes/api.js")(app, path, bodyParser);
