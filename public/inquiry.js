// Sends the inquiry form without leaving the page. Without JS the form still
// posts normally and the Worker redirects to /thanks.html.
(function () {
  const form = document.querySelector('.inquiry');
  if (!form) return;
  const status = form.querySelector('.inquiry__status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = 'Sending...';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      form.reset();
      form.classList.add('is-sent');
      status.textContent = 'Got it. We’ll be in touch soon.';
    } catch (err) {
      status.textContent = err.message + ' You can also email hello@thepartyrats.com.';
      button.disabled = false;
    }
  });
})();
