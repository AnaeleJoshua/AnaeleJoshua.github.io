// Contact form logic moved from index.html
(function () {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('send-btn');
  const spinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');
  const ENDPOINT = 'https://portfolio-server-snowy-omega.vercel.app/mail';

  function showToast(message, isSuccess = true) {
    Toastify({
      text: message,
      duration: 4000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: isSuccess ? 'linear-gradient(to right, #16a34a, #4ade80)' : 'linear-gradient(to right, #dc2626, #ef4444)',
      stopOnFocus: true
    }).showToast();
  }

  function setLoading(loading) {
    if (!btn) return;
    if (loading) {
      btn.setAttribute('disabled', 'disabled');
      btn.setAttribute('aria-busy', 'true');
      if (spinner) spinner.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Sending…';
      btn.classList.add('opacity-90');
    } else {
      btn.removeAttribute('disabled');
      btn.removeAttribute('aria-busy');
      if (spinner) spinner.classList.add('hidden');
      if (btnText) btnText.textContent = 'Send Message';
      btn.classList.remove('opacity-90');
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        showToast('❌ Please complete all required fields.', false);
        return;
      }

      const formData = new FormData(form);

      setLoading(true);

      fetch(ENDPOINT, {
        method: 'POST',
        body: formData
      })
      .then(async response => {
        const text = await response.text().catch(() => '');
        if (!response.ok) {
          throw new Error(text || 'Network response was not ok');
        }
        return text;
      })
      .then(() => {
        setLoading(false);
        showToast('✅ Message sent successfully!', true);
        form.reset();
      })
      .catch(err => {
        console.error('Contact form error:', err);
        setLoading(false);
        showToast('❌ Something went wrong. Please try again.', false);
      });
    });
  }
})();
