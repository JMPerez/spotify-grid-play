(function () {
  "use strict";
  var sp = getSpotifyApi(),
    models = sp.require("$api/models"),
    views = sp.require("$api/views"),
    container = document.getElementById('covers-container');

  var playlist;

  // retrieve playlist, compose players and inject them
  models.Playlist.fromURI('spotify:user:nowplaylist:playlist:6QHyDeqaPNZ0nyLFJbSKTL', function (p) {
    playlist = p;
    var htmlCode = '';
    for (var i = 0, l = playlist.length; i < l; i++) {
      var track = playlist.get(i);
      if (track.playable) {
        htmlCode += '<div class="sp-player sp-player-paused sp-player-custom" id="track-' + track.uri + '">' +
          '<a href="' + track.uri + '" class="sp-player-image sp-image-loaded">' +
          '<img width="128" src="' + track.image + '" />' + '<button class="sp-player-button" data-index="' + i + '" ' + 'data-uri="' + track.uri + '"></button>' +
          '</a>' + '</div>';
      }
    }
    container.innerHTML = htmlCode;
  });

  function showPausedState(element) {
    if (element) {
      element.classList.remove('sp-player-playing');
      element.classList.add('sp-player-paused');
    }
  }

  function showPlayingState(element) {
    if (element) {
      element.classList.add('sp-player-playing');
      element.classList.remove('sp-player-paused');
    }
  }

  // manages click on button element
  container.addEventListener('click', function (e) {
    var target = e.target;
    if (target.nodeName == 'BUTTON') {
      e.preventDefault();

      var prevPlayer = container.querySelector('.sp-player-playing');
      var currentPlayer = e.target.parentNode.parentNode;

      if (models.player.track && models.player.track.uri == target.getAttribute('data-uri')) {
        models.player.playing = !models.player.playing;
      } else {
        models.player.play(target.getAttribute('data-uri'), playlist, +target.getAttribute('data-index'));
      }
    }
  });

  // manages player changes
  models.player.observe(models.EVENT.CHANGE, function (e) {
    var currentTrack = models.player.track,
      prevPlayer;

    if (currentTrack) {
      var currentPlayer = document.getElementById('track-' + currentTrack.uri);

      if (models.player.playing) {
        prevPlayer = container.querySelector('.sp-player-playing');
        showPausedState(prevPlayer);
        showPlayingState(currentPlayer);
      } else {
        showPausedState(currentPlayer);
      }
    } else {
      // no current track, show play button in paused item
      prevPlayer = container.querySelector('.sp-player-playing');
      showPausedState(prevPlayer);
    }
  });
})();
