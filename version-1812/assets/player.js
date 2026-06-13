function initMoviePlayer(source) {
  var video = document.getElementById("moviePlayer");
  var overlay = document.getElementById("playOverlay");
  var prepared = false;
  var hls = null;

  if (!video || !source) {
    return;
  }

  function prepare() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function playVideo() {
    prepare();

    if (overlay) {
      overlay.classList.add("is-hidden");
    }

    var playResult = video.play();

    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
    }
  }

  if (overlay) {
    overlay.addEventListener("click", playVideo);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  });
}
