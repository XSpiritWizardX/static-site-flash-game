(() => {
  const STORAGE_KEY = 'ssfg_waitlist';
  const BASE_COUNT = 217;

  const reveals = document.querySelectorAll('.reveal');
  const yearEl = document.getElementById('year');
  const countEl = document.getElementById('waitlistCount');
  const form = document.getElementById('waitlistForm');
  const emailInput = document.getElementById('waitlistEmail');
  const msg = document.getElementById('waitlistMsg');
  const joinBtn = document.getElementById('joinBtn');

  function getStoredList() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      const list = value ? JSON.parse(value) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function setStoredList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function updateCount() {
    if (!countEl) return;
    countEl.textContent = String(BASE_COUNT + getStoredList().length);
  }

  function setMessage(text, state) {
    if (!msg) return;
    msg.textContent = text;
    msg.dataset.state = state || '';
  }

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  updateCount();

  if (form && emailInput) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = emailInput.value.trim().toLowerCase();

      if (!/^[\S]+@[\S]+\.[\S]+$/.test(email)) {
        setMessage('Enter a valid email to join.', 'warn');
        emailInput.focus();
        return;
      }

      const list = getStoredList();
      if (list.includes(email)) {
        setMessage('This email is already on the list.', 'warn');
        return;
      }

      joinBtn.disabled = true;
      joinBtn.textContent = 'Joining...';

      window.setTimeout(() => {
        list.push(email);
        setStoredList(list);
        updateCount();
        setMessage('You are in. Early access invite sent soon.', 'ok');
        form.reset();
        joinBtn.disabled = false;
        joinBtn.textContent = 'Request Access';
      }, 550);
    });
  }
})();
