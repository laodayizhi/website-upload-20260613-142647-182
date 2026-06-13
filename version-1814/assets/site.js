(function () {
    function toggleMobileMenu() {
        var button = document.querySelector('.mobile-menu-button');
        var nav = document.querySelector('.mobile-nav');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            button.setAttribute('aria-expanded', String(open));
            button.textContent = open ? '×' : '☰';
        });
    }

    function initCardFilters() {
        var input = document.querySelector('.filter-input');
        var select = document.querySelector('.filter-select');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        if (!cards.length || (!input && !select)) {
            return;
        }
        var years = [];
        cards.forEach(function (card) {
            var text = card.getAttribute('data-tags') || '';
            var matches = text.match(/\b(?:19|20)\d{2}\b/g) || [];
            matches.forEach(function (year) {
                if (years.indexOf(year) === -1) {
                    years.push(year);
                }
            });
        });
        years.sort(function (a, b) {
            return Number(b) - Number(a);
        });
        if (select) {
            years.forEach(function (year) {
                var option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                select.appendChild(option);
            });
        }
        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var year = select ? select.value : '';
            cards.forEach(function (card) {
                var haystack = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || '')).toLowerCase();
                var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var okYear = !year || haystack.indexOf(year) !== -1;
                card.classList.toggle('is-hidden-card', !(okKeyword && okYear));
            });
        }
        if (input) {
            input.addEventListener('input', apply);
        }
        if (select) {
            select.addEventListener('change', apply);
        }
    }

    window.bindMoviePlayer = function (src) {
        var video = document.getElementById('movie-player');
        var button = document.getElementById('movie-play-button');
        if (!video || !button || !src) {
            return;
        }
        var started = false;
        function start() {
            if (started) {
                video.play().catch(function () {});
                return;
            }
            started = true;
            button.classList.add('is-hidden');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.play().catch(function () {});
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        button.classList.remove('is-hidden');
                        started = false;
                    }
                });
                return;
            }
            video.src = src;
            video.play().catch(function () {
                button.classList.remove('is-hidden');
                started = false;
            });
        }
        button.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (!started) {
                start();
            }
        });
    };

    window.initSearchPage = function () {
        var input = document.getElementById('site-search-input');
        var button = document.getElementById('site-search-button');
        var results = document.getElementById('site-search-results');
        var records = window.SEARCH_MOVIES || [];
        if (!input || !button || !results) {
            return;
        }
        function card(movie) {
            var tags = movie.tags.slice(0, 3).map(function (tag) {
                return '<span>' + escapeHtml(tag) + '</span>';
            }).join('');
            return '<article class="movie-card">' +
                '<a class="poster" href="' + movie.url + '">' +
                '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                '<span class="play-chip">播放</span>' +
                '</a>' +
                '<div class="movie-card-body">' +
                '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>' +
                '<p>' + escapeHtml(movie.oneLine) + '</p>' +
                '<div class="meta-row"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
                '<div class="tag-row">' + tags + '</div>' +
                '</div>' +
                '</article>';
        }
        function render(list) {
            results.innerHTML = list.slice(0, 120).map(card).join('');
        }
        function search() {
            var keyword = input.value.trim().toLowerCase();
            if (!keyword) {
                render(records.slice(0, 60));
                return;
            }
            render(records.filter(function (movie) {
                return movie.searchText.toLowerCase().indexOf(keyword) !== -1;
            }));
        }
        button.addEventListener('click', search);
        input.addEventListener('input', search);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                search();
            }
        });
        render(records.slice(0, 60));
    };

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        toggleMobileMenu();
        initCardFilters();
    });
})();
