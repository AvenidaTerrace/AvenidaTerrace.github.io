(function () {
  var progressBar = document.querySelector('.progress-bar');
  var navbar = document.querySelector('.navbar');
  var backToTop = document.querySelector('.back-to-top');

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var progress = max > 0 ? window.scrollY / max : 0;

    if (progressBar) {
      progressBar.style.width = (progress * 100).toFixed(2) + '%';
    }

    if (navbar) {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    }

    if (backToTop) {
      backToTop.classList.toggle('is-visible', window.scrollY > 700);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      var navHeight = navbar ? navbar.offsetHeight : 0;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  var revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
    );
    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
