const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const form = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const formMsg = document.getElementById('formMsg');

if (form && emailInput && formMsg) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    formMsg.className = 'form-msg';

    if (!valid) {
      formMsg.textContent = 'Enter a valid email to join the waitlist.';
      formMsg.classList.add('err');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    setTimeout(() => {
      formMsg.textContent = 'You are in. Invite link and launch kit sent soon.';
      formMsg.classList.add('ok');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Reserve Spot';
    }, 700);
  });
}
