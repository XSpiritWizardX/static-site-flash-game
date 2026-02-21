const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const form = document.querySelector('[data-waitlist]');
const message = document.querySelector('.form-message');

if (form && message) {
  const emailInput = form.querySelector("input[type='email']");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      message.textContent = 'Enter a valid email address.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving your spot...';
    message.textContent = '';

    setTimeout(() => {
      const key = 'static_site_flash_game_waitlist';
      const count = Number(localStorage.getItem(key) || 0) + 1;
      localStorage.setItem(key, String(count));

      form.reset();
      message.textContent = `You are in. Early access slot #${count} confirmed.`;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join Waitlist';
    }, 700);
  });
}

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());
