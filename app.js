const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const form = document.getElementById('waitlist-form');
const note = document.getElementById('form-note');
const emailInput = document.getElementById('waitlist-email');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      note.textContent = 'Please add an email to join the waitlist.';
      note.style.color = '#ff4d87';
      return;
    }
    note.textContent = `You are in. We will ping ${email} soon.`;
    note.style.color = '#30f2b2';
    form.reset();
  });
}
