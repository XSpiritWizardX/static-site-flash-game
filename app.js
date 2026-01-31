const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

reveals.forEach((el) => observer.observe(el));

const form = document.getElementById('waitlist-form');
const note = document.getElementById('waitlist-note');

if (form && note) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = data.get('email');
    if (!email) {
      return;
    }
    note.textContent = 'Thanks, ' + email + ' is in line for early access.';
    note.classList.add('success');
    form.reset();
  });
}
