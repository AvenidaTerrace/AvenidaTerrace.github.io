(function () {
  var toast = document.querySelector('.toast');
  var toastText = toast ? toast.querySelector('.toast__text') : null;
  var toastTimeout;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-item__question');
    if (!question) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        var q = other.querySelector('.faq-item__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  var copyBtn = document.getElementById('copy-address-btn');
  var addressText = 'Av. Libertad 86, Bonao 42000, República Dominicana';

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(addressText)
          .then(function () {
            showToast('Dirección copiada al portapapeles');
          })
          .catch(function () {
            showToast('No se pudo copiar la dirección');
          });
      } else {
        showToast('No se pudo copiar la dirección');
      }
    });
  }
})();
