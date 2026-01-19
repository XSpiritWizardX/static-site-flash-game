const waitlistForm = document.getElementById('waitlist-form');

waitlistForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = waitlistForm.elements.email.value;
  console.log(email);
});
