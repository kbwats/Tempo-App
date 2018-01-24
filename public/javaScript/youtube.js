var player;

// Callback for when the Youtube iFrame player is ready.
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    // Sets player height and width
    height: '390',
    width: '640',
    // Set the id of the video to be played
    videoId: 'g8cFOm6VdpY',
    // Setup event listeners
    // These are covered in the next section
    events: {
      'onReady': onPlayerReady
    }
  })
}

function onPlayerReady() {
  player.playVideo()
}
