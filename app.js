const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealEls.forEach((el) => observer.observe(el));

const form = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email');
const statusEl = document.getElementById('form-status');

const saved = localStorage.getItem('ssfg_waitlist_email');
if (saved) {
  emailInput.value = saved;
  statusEl.textContent = 'You are already on the waitlist.';
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    statusEl.textContent = 'Enter a valid email address.';
    return;
  }

  const button = form.querySelector('button');
  const prevText = button.textContent;
  button.disabled = true;
  button.textContent = 'Joining...';
  statusEl.textContent = 'Submitting request...';

  setTimeout(() => {
    localStorage.setItem('ssfg_waitlist_email', email);
    statusEl.textContent = 'Access request received. Check your inbox for next drop.';
    button.disabled = false;
    button.textContent = prevText;
    form.reset();
  }, 700);
});
