
// Just a note that I can really understand why front-end frameworks can be
// really useful. In this code, it would even be easy to use a template in
// order build DOM elements for the videos that are thumbnails and are not the
// video in que after a user makes a query.


$(function() {

  // Grabs the input field to extract the value when user types enter.
  const video = $('#video');
  let query = null;
  // Add listener on the form to grab input value when user presses enter.
  $('#video-form').on('keyup', (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      query = video.val().trim();
      $.ajax({
        method: "GET",
        url: "/search/" + query
      }).done(function (response) {
        console.log(response)
        var videoId = response[0].id.videoId;
        console.log(videoId)
        url = `https://www.youtube.com/embed/${videoId}`;
        $('.video iframe').attr('src', url)
        $('#thumb1').attr('src', response[1].snippet.thumbnails.default.url);
        $('#thumb2').attr('src', response[2].snippet.thumbnails.default.url);
        $('#thumb3').attr('src', response[3].snippet.thumbnails.default.url);
      });
    }



  })



})
