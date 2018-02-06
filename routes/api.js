module.exports = function(app, path, bodyParser) {
  var YTSearch = require('youtube-api-search');


   var API_Key = 'AIzaSyDGbeWcI9o5f2jmPLff4wNkUgGdYHhVD_M'

   app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "/public/index.html"));

   });

   app.get("/search/:video", (req, res) => {
     let video = req.params.video;
     YTSearch({key: API_Key, term: video}, function(response) {
       console.log(response);
       res.json(response);
     });
   });



}
