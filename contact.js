// Contact page — preselect reason from ?reason= query param, placeholder submit handling
document.addEventListener('DOMContentLoaded', function () {

  var params = new URLSearchParams(window.location.search);
  var reason = params.get('reason');
  var reasonSelect = document.getElementById('c-reason');
  if (reason && reasonSelect) {
    var match = Array.prototype.find.call(reasonSelect.options, function (opt) {
      return opt.value === reason;
    });
    if (match) reasonSelect.value = reason;
  }

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('This form is not yet connected to a backend. Wire it to a form service (e.g. Formspree) before publishing.');
    });
  }
});
