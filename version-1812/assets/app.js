(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-to]"));
    var prev = slider.querySelector("[data-slide-prev]");
    var next = slider.querySelector("[data-slide-next]");
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === activeIndex);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === activeIndex);
      });
    }

    function startTimer() {
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    function resetTimer() {
      if (timer) {
        window.clearInterval(timer);
      }

      startTimer();
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide-to")) || 0);
        resetTimer();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(activeIndex - 1);
        resetTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(activeIndex + 1);
        resetTimer();
      });
    }

    startTimer();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='q']");
      var query = input ? input.value.trim() : "";
      var url = "./search.html";

      if (query) {
        url += "?q=" + encodeURIComponent(query);
      }

      window.location.href = url;
    });
  });

  var filterInput = document.querySelector("[data-filter-input]");
  var yearSelect = document.querySelector("[data-filter-year]");
  var typeSelect = document.querySelector("[data-filter-type]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid .movie-card"));
  var emptyHint = document.querySelector("[data-empty-hint]");

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = normalize(filterInput ? filterInput.value : "");
    var year = normalize(yearSelect ? yearSelect.value : "");
    var type = normalize(typeSelect ? typeSelect.value : "");
    var shown = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var cardYear = normalize(card.getAttribute("data-year"));
      var cardType = normalize(card.getAttribute("data-type"));
      var ok = true;

      if (query && text.indexOf(query) === -1) {
        ok = false;
      }

      if (year && cardYear !== year) {
        ok = false;
      }

      if (type && cardType !== type) {
        ok = false;
      }

      card.style.display = ok ? "" : "none";

      if (ok) {
        shown += 1;
      }
    });

    if (emptyHint) {
      emptyHint.classList.toggle("show", shown === 0);
    }
  }

  if (filterInput || yearSelect || typeSelect) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");

    if (initialQuery && filterInput) {
      filterInput.value = initialQuery;
    }

    [filterInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  }
})();
