module.exports = function(app, path, bodyParser) {
  var YTSearch = require('youtube-api-search');


   var API_Key = 'AIzaSyDGbeWcI9o5f2jmPLff4wNkUgGdYHhVD_M'

   app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "/public/index.html"));

   });

   app.get("/search", (req, res) => {
     YTSearch({key: API_Key, term: 'dogs'}, function(response) {
       console.log(response);
       res.json(response);
     });
   });



}
