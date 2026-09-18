// Get Involved page — donate frequency toggle + amount chip selection
document.addEventListener('DOMContentLoaded', function () {

  // One-time / Monthly toggle
  var donateOptions = document.querySelectorAll('.donate-option');
  donateOptions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      donateOptions.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });

  // Amount chip selection (clears custom input when a chip is chosen)
  var amountChips = document.querySelectorAll('.amount-chip');
  var customInput = document.getElementById('donate-custom');
  amountChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      amountChips.forEach(function (c) { c.classList.remove('is-selected'); });
      chip.classList.add('is-selected');
      if (customInput) customInput.value = '';
    });
  });
  if (customInput) {
    customInput.addEventListener('input', function () {
      amountChips.forEach(function (c) { c.classList.remove('is-selected'); });
    });
  }

  // Volunteer form — placeholder submit handling (no backend yet)
  var volunteerForm = document.querySelector('.volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('This form is not yet connected to a backend. Wire it to a form service (e.g. Formspree) before publishing.');
    });
  }
});
