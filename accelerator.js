// Accelerator 2026 — sets the status pill based on the real date, so the page
// never claims "Upcoming" once the programme has started, and never invents
// an "Applications Now Open" state that was never asked for.
document.addEventListener('DOMContentLoaded', function () {
  var status = document.getElementById('prog-status');
  if (!status) return;

  var start = new Date(status.getAttribute('data-start') + 'T00:00:00');
  var end   = new Date(status.getAttribute('data-end')   + 'T23:59:59');
  var now   = new Date();

  if (now < start) {
    status.textContent = 'Upcoming programme';
  } else if (now >= start && now <= end) {
    status.textContent = 'Programme underway';
  } else {
    status.textContent = 'Programme completed';
  }
});
