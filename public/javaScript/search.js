


var termInput = document.querySelector('.term');

termInput.addEventListener('keyup', function(e) {
  if (e.keyCode === 13) {
    var term = e.target.value
  }
})

$.ajax({
  method: "GET",
  url: "/search"
}).done(function (response) {
  var videoId = response[0].id.videoId;
  console.log(videoId)
  url = `https://www.youtube.com/embed/${videoId}`;
  $('.video iframe').attr('src', url)
  console.log(response);
});
