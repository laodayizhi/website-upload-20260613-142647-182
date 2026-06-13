(function () {
  function startPlayer(wrapper) {
    var video = wrapper.querySelector("video");
    var button = wrapper.querySelector("[data-player-button]");
    if (!video) {
      return;
    }
    var stream = video.getAttribute("data-stream");
    if (!stream) {
      return;
    }
    if (!video.dataset.ready) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video._hls = hls;
      } else {
        video.src = stream;
      }
      video.dataset.ready = "1";
    }
    if (button) {
      button.classList.add("is-hidden");
    }
    video.controls = true;
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        if (button) {
          button.classList.remove("is-hidden");
        }
      });
    }
  }

  function bindPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (wrapper) {
      var button = wrapper.querySelector("[data-player-button]");
      var video = wrapper.querySelector("video");
      if (button) {
        button.addEventListener("click", function () {
          startPlayer(wrapper);
        });
      }
      if (video) {
        video.addEventListener("click", function () {
          if (!video.dataset.ready || video.paused) {
            startPlayer(wrapper);
          }
        });
      }
    });
  }

  if (document.readyState !== "loading") {
    bindPlayers();
  } else {
    document.addEventListener("DOMContentLoaded", bindPlayers);
  }
})();
