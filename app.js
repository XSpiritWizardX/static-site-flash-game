const revealItems = document.querySelectorAll('.reveal');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistMessage = document.getElementById('waitlist-message');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach(item => observer.observe(item));

waitlistForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = new FormData(waitlistForm).get('email');
  waitlistMessage.textContent = `Thanks, ${email}. You are on the list.`;
  waitlistForm.reset();
});
