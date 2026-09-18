// About page — values accordion
document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('#values-accordion .value-item');

  items.forEach(function (item) {
    var trigger = item.querySelector('.value-trigger');
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      items.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.value-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
