const CART_KEY = 'fr_cart';

// ── State ──────────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

function save() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── DOM refs ────────────────────────────────────────────────────────────────
const drawerEl   = document.getElementById('cart-drawer');
const overlayEl  = document.getElementById('cart-overlay');
const itemsEl    = document.getElementById('cart-items');
const footerEl   = document.getElementById('cart-footer');
const countEl    = document.getElementById('cart-count');
const totalEl    = document.getElementById('cart-total-price');
const cartBtn    = document.getElementById('cart-btn');
const closeBtn   = document.getElementById('cart-close');
const checkoutBtn = document.getElementById('checkout-btn');

// ── Open / Close ────────────────────────────────────────────────────────────
function openCart() {
  drawerEl.classList.add('open');
  overlayEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  drawerEl.classList.remove('open');
  overlayEl.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn?.addEventListener('click', openCart);
closeBtn?.addEventListener('click', closeCart);
overlayEl?.addEventListener('click', closeCart);

// ── Render ──────────────────────────────────────────────────────────────────
function render() {
  // Badge
  const total = cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) {
    countEl.textContent = total;
    countEl.hidden = total === 0;
  }

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" width="40" height="40">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <p>Votre panier est vide</p>
    </div>`;
    if (footerEl) footerEl.hidden = true;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${item.price > 0 ? 'À partir de ' + item.price + ' €' : 'Sur devis'}</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        <button class="remove-btn" data-id="${item.id}" aria-label="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Total
  const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = sum > 0 ? sum + ' €' : 'Sur devis';
  if (footerEl) footerEl.hidden = false;

  // Qty / remove listeners
  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const idx = cart.findIndex(i => i.id === id);
      if (idx === -1) return;
      if (btn.dataset.action === 'inc') cart[idx].qty++;
      else if (cart[idx].qty > 1) cart[idx].qty--;
      else cart.splice(idx, 1);
      save(); render();
    });
  });
  itemsEl.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cart = cart.filter(i => i.id !== btn.dataset.id);
      save(); render();
    });
  });
}

// ── Add to cart ─────────────────────────────────────────────────────────────
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const id    = card.dataset.id;
    const name  = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, name, price, qty: 1 });
    save(); render();
    openCart();

    // Button feedback
    const orig = btn.textContent;
    btn.textContent = '✓ Ajouté';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1200);
  });
});

// ── Filters ──────────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      const cats = card.dataset.cat || '';
      card.style.display = (filter === 'all' || cats.includes(filter)) ? '' : 'none';
    });
  });
});

// ── Checkout ─────────────────────────────────────────────────────────────────
checkoutBtn?.addEventListener('click', async () => {
  if (cart.length === 0) return;

  checkoutBtn.textContent = 'Redirection…';
  checkoutBtn.disabled = true;

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart.map(i => ({ id: i.id, qty: i.qty })) }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Erreur');
    }
  } catch (err) {
    checkoutBtn.textContent = `Erreur : ${err.message}`;
    checkoutBtn.style.background = '#8b1a1a';
    setTimeout(() => {
      checkoutBtn.textContent = 'Passer commande →';
      checkoutBtn.disabled = false;
      checkoutBtn.style.background = '';
    }, 3000);
  }
});

// ── Init ─────────────────────────────────────────────────────────────────────
render();
