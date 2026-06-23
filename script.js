// Mobile nav toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Boutique: click "Commander" → prefill service select & scroll to form
document.querySelectorAll('.btn-order').forEach(btn => {
  btn.addEventListener('click', () => {
    const label = btn.closest('.product-item').dataset.preselect;
    const select = document.getElementById('devis-service');
    // find matching option
    const options = Array.from(select.options);
    const match = options.find(o => label.toLowerCase().includes(o.value.toLowerCase().split(' ')[0].toLowerCase()));
    if (match) select.value = match.value;
    document.getElementById('devis-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('devis-desc').focus();
  });
});

// Form submit feedback
function handleForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = 'Message envoyé ✓';
        btn.style.background = '#1a6b3a';
        form.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; btn.style.background = ''; }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Erreur — réessayez';
      btn.style.background = '#8b1a1a';
      setTimeout(() => { btn.textContent = original; btn.disabled = false; btn.style.background = ''; }, 3000);
    }
  });
}

handleForm('devis-form');
handleForm('contact-form');

// Scroll: add shadow to nav
window.addEventListener('scroll', () => {
  document.getElementById('nav').style.boxShadow = window.scrollY > 10 ? '0 1px 16px rgba(0,0,0,0.08)' : '';
});
