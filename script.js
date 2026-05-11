// ─── DATOS DE PRODUCTOS ───
const products = [
  {
    id: 1, name: "Arroz Blanco", seller: "Finca El Recreo · Vereda El Patá",
    price: 2500, unit: "kg", stock: 100,
    image: "images/arroz_blanco.webp",
    fallback: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    category: "zona-baja", rating: 4.8, reviews: 32
  },
  {
    id: 2, name: "Sorgo", seller: "Asociación Campesina La Esperanza",
    price: 1800, unit: "kg", stock: 80,
    image: "/images/sorgo.webp",
    fallback: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
    category: "zona-baja", rating: 4.5, reviews: 18
  },
  {
    id: 3, name: "Café Orgánico", seller: "Finca Los Andes · Montaña",
    price: 15000, unit: "kg", stock: 50,
    image: "images/cafe_organico.webp",
    fallback: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
    category: "montana", rating: 5.0, reviews: 61
  },
  {
    id: 4, name: "Frijol Rojo", seller: "Cooperativa El Futuro",
    price: 3500, unit: "kg", stock: 70,
    image: "images/frijol_rojo.webp",
    fallback: "https://images.unsplash.com/photo-1615485291075-9c5ca647a97e?w=400&q=80",
    category: "montana", rating: 4.7, reviews: 24
  },
  {
    id: 5, name: "Cacao", seller: "Finca La Paz · Montaña",
    price: 12000, unit: "kg", stock: 40,
    image: "images/cacao_fruto.webp",
    fallback: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
    category: "montana", rating: 4.9, reviews: 45
  },
  {
    id: 6, name: "Tilapia Fresca", seller: "Piscicultura Aipe",
    price: 8000, unit: "kg", stock: 30,
    image: "images/tilapia_fresca.webp",
    fallback: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80",
    category: "piscicultura", rating: 4.6, reviews: 29
  },
  {
    id: 7, name: "Cachama", seller: "Estanque Los Pescadores",
    price: 9000, unit: "kg", stock: 25,
    image: "images/cachama.jpg",
    fallback: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
    category: "piscicultura", rating: 4.4, reviews: 17
  },
  {
    id: 8, name: "Limón Tahití", seller: "Huerto Frutal El Sol",
    price: 2000, unit: "kg", stock: 60,
    image: "/images/limon.webp",
    fallback: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80",
    category: "frutales", rating: 4.7, reviews: 38
  },
  {
    id: 9, name: "Piña Tropical", seller: "Finca La Joya · Vereda La Joya",
    price: 1500, unit: "unidad", stock: 90,
    image: "images/pina_tropical.webp",
    fallback: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80",
    category: "frutales", rating: 4.8, reviews: 52
  },
  {
    id: 10, name: "Arroz Integral", seller: "Finca Orgánica Verde",
    price: 3000, unit: "kg", stock: 45,
    image: "images/arroz_integral.webp",
    fallback: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    category: "zona-baja", rating: 4.6, reviews: 21
  }
];

// Mapa de zonas
const zoneLabels = {
  'zona-baja': 'Zona Baja',
  'montana': 'Montaña',
  'piscicultura': 'Piscicultura',
  'frutales': 'Frutales'
};

// ─── ESTADO ───
let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let searchQuery = '';

// ─── UTILIDADES ───
const $ = id => document.getElementById(id);
const fmt = n => '$' + n.toLocaleString('es-CO');
const stars = r => {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '<i class="fa-solid fa-star"></i>'.repeat(full)
    + (half ? '<i class="fa-solid fa-star-half-stroke"></i>' : '')
    + '<i class="fa-regular fa-star"></i>'.repeat(empty);
};

function showToast(msg, icon = '<i class="fa-solid fa-circle-check"></i>') {
  $('toast-icon').innerHTML = icon;
  $('toast-msg').textContent = msg;
  const t = $('toast');
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ─── RENDER PRODUCTOS ───
function getFilteredSorted() {
  let list = currentFilter === 'all'
    ? [...products]
    : products.filter(p => p.category === currentFilter);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q)
    );
  }

  switch (currentSort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

function renderProducts() {
  const grid = $('product-grid');
  const list = getFilteredSorted();

  // Subtítulo
  const subtitles = {
    'all': 'Mostrando todos los productos de Aipe',
    'zona-baja': 'Cultivos de riego — Zona Baja de Aipe',
    'montana': 'Productos de las laderas y montañas',
    'piscicultura': 'Peces frescos de estanques locales',
    'frutales': 'Frutas frescas del trópico huilense'
  };
  $('catalog-subtitle').textContent = subtitles[currentFilter] || '';

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>No se encontraron productos para "<strong>${searchQuery}</strong>"</p>
      </div>`;
    return;
  }

  grid.innerHTML = '';
  list.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.setAttribute('aria-label', `Producto: ${p.name}`);

    const inCart = cart.some(c => c.id === p.id);

    card.innerHTML = `
      <div class="card-img-wrap">
        <img
          src="${p.image}"
          alt="Foto de ${p.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='${p.fallback}'"
        >
        <span class="card-badge"><i class="fa-solid fa-circle-check"></i> Verificado</span>
        <span class="card-zone">${zoneLabels[p.category] || p.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${p.name}</h3>
        <p class="card-seller"><i class="fa-solid fa-location-dot"></i> ${p.seller}</p>
        <div class="card-stars" title="${p.rating} de 5 estrellas">
          ${stars(p.rating)} <span style="color:var(--text-muted)">(${p.reviews})</span>
        </div>
        <div class="card-price-row">
          <span class="card-price">${fmt(p.price)}</span>
          <span class="card-unit">/ ${p.unit}</span>
        </div>
        <p class="card-stock"><i class="fa-solid fa-box"></i> ${p.stock} ${p.unit} disponibles</p>
        <button
          class="btn-add add-to-cart"
          data-id="${p.id}"
          aria-label="Agregar ${p.name} al carrito"
          ${inCart ? 'style="opacity:0.7"' : ''}
        >
          <i class="fa-solid fa-cart-shopping"></i> ${inCart ? 'Agregado <i class="fa-solid fa-circle-check"></i>' : 'Agregar al carrito'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── RENDER CARRITO ───
function renderCart() {
  const list = $('cart-items');
  const footer = $('cart-footer');
  updateCartBadge();

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
        <p>Tu carrito está vacío.<br>¡Agrega algunos productos frescos!</p>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  list.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    return `
      <div class="cart-item" data-id="${item.id}">
        <img
          class="cart-item-img"
          src="${item.image}"
          alt="${item.name}"
          onerror="this.onerror=null;this.src='${item.fallback}'"
        >
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${fmt(item.price)} / ${item.unit}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${item.seller.split('·')[0].trim()}</div>
          <div class="cart-item-meta">
            <div class="cart-item-qty">
              <button class="qty-btn decrease-qty" data-id="${item.id}" aria-label="Restar cantidad">-</button>
              <input class="qty-input" type="number" min="1" max="${item.stock}" value="${item.quantity}" data-id="${item.id}" aria-label="Cantidad de ${item.name}">
              <button class="qty-btn increase-qty" data-id="${item.id}" aria-label="Sumar cantidad">+</button>
            </div>
            <div class="cart-item-line">Subtotal: ${fmt(lineTotal)}</div>
          </div>
        </div>
        <button class="btn-remove remove-from-cart" data-id="${item.id}" aria-label="Eliminar ${item.name}"><i class="fa-solid fa-trash"></i></button>
      </div>`;
  }).join('');

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  footer.innerHTML = `
    <div class="cart-total">
      <span>Total (${itemCount} productos)</span>
      <span>${fmt(total)}</span>
    </div>
    <button class="btn-checkout" id="checkout-btn">
      <i class="fa-solid fa-box-open"></i> Finalizar pedido — ingresar datos
    </button>
  `;

  // Al finalizar compra → cierra carrito y abre checkout de comprador
  $('checkout-btn').addEventListener('click', () => {
    closeModal('cart-modal');
    openCheckout();
  });
}

function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $('cart-count').textContent = count;
  $('mobile-cart-count').textContent = count;
}

function clampCartQuantity(id, qty) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.quantity = Math.max(1, Math.min(qty, item.stock));
  renderCart();
  renderProducts();
}

// ─── MODALES ───
function openModal(id) {
  $(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  $(id).classList.remove('open');
  document.body.style.overflow = '';
}

// ─── CONTADORES ANIMADOS ───
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.target === '100' ? '%' : el.dataset.target === '500' ? 'kg' : '+';
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// IntersectionObserver para los contadores
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

// ─── FILTROS ───
function setFilter(category) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  const titles = {
    'all': 'Todos los Productos', 'zona-baja': 'Zona Baja (Riego)',
    'montana': 'Zona de Montaña', 'piscicultura': 'Piscicultura', 'frutales': 'Frutales'
  };
  $('catalog-title').textContent = titles[category] || 'Productos';
  renderProducts();
}

// ─── DRAWER MÓVIL ───
function openDrawer() {
  $('mobile-drawer').classList.add('open');
  $('drawer-overlay').classList.add('open');
  $('mobile-menu-btn').setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  $('mobile-drawer').classList.remove('open');
  $('drawer-overlay').classList.remove('open');
  $('mobile-menu-btn').setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ─── BÚSQUEDA ───
function doSearch(q) {
  searchQuery = q.trim();
  renderProducts();
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  // Contadores
  const impactCard = document.querySelector('.impact-card');
  if (impactCard) counterObserver.observe(impactCard);

  // Filtros
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.category));
  });

  // Sort
  $('sort-select').addEventListener('change', e => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Búsqueda desktop
  $('search-input').addEventListener('input', e => doSearch(e.target.value));
  $('search-btn').addEventListener('click', () => doSearch($('search-input').value));
  $('search-input').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(e.target.value); });

  // Búsqueda móvil
  $('mobile-search').addEventListener('input', e => doSearch(e.target.value));

  // Agregar al carrito (delegado)
  $('product-grid').addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
        renderCart();
        renderProducts();
        showToast(`Cantidad de ${product.name} actualizada a ${existing.quantity}`, '<i class="fa-solid fa-cart-shopping"></i>');
      } else {
        showToast(`No hay más stock disponible de ${product.name}`, '⚠️');
      }
      return;
    }

    cart.push({ ...product, quantity: 1 });
    updateCartBadge();
    btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Agregado <i class="fa-solid fa-circle-check"></i>';
    btn.style.opacity = '0.7';
    showToast(`${product.name} agregado al carrito`, '<i class="fa-solid fa-party-horn"></i>');
  });

  // Eliminar del carrito (delegado)
  $('cart-items').addEventListener('click', e => {
    const btn = e.target.closest('.remove-from-cart');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    cart = cart.filter(c => c.id !== id);
    renderCart();
    renderProducts();
    showToast('Producto eliminado del carrito', '<i class="fa-solid fa-trash"></i>');
  });

  $('cart-items').addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    const item = cart.find(c => c.id === id);
    if (!item) return;

    if (btn.classList.contains('increase-qty')) {
      if (item.quantity < item.stock) {
        item.quantity += 1;
        renderCart();
        renderProducts();
      } else {
        showToast(`No hay más stock disponible de ${item.name}`, '⚠️');
      }
    }

    if (btn.classList.contains('decrease-qty')) {
      item.quantity = Math.max(1, item.quantity - 1);
      renderCart();
      renderProducts();
    }
  });

  $('cart-items').addEventListener('change', e => {
    const input = e.target.closest('.qty-input');
    if (!input) return;
    const id = parseInt(input.dataset.id);
    const item = cart.find(c => c.id === id);
    if (!item) return;

    let qty = parseInt(input.value, 10) || 1;
    if (qty < 1) qty = 1;
    if (qty > item.stock) {
      qty = item.stock;
      showToast(`Máximo ${item.stock} ${item.unit} disponibles`, '⚠️');
    }
    item.quantity = qty;
    renderCart();
    renderProducts();
  });

  // Menú perfil
  $('profile-btn').addEventListener('click', () => {
    const menu = $('profile-menu');
    const isOpen = menu.classList.toggle('open');
    $('profile-btn').setAttribute('aria-expanded', isOpen.toString());
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.profile-dropdown')) {
      $('profile-menu').classList.remove('open');
      $('profile-btn').setAttribute('aria-expanded', 'false');
    }
  });

  // Modal login → solo para productores
  $('login-btn').addEventListener('click', e => { e.preventDefault(); resetLoginForm(); openModal('login-modal'); });
  $('mobile-login-btn').addEventListener('click', e => { e.preventDefault(); closeDrawer(); resetLoginForm(); openModal('login-modal'); });
  $('close-login').addEventListener('click', () => closeModal('login-modal'));
  $('become-seller-btn').addEventListener('click', () => { resetLoginForm(); openModal('login-modal'); });

  // Login de productor
  $('btn-login-submit').addEventListener('click', () => {
    if (validateLogin()) handleLogin();
  });
  $('toggle-login-pass').addEventListener('click', () => {
    const input = $('login-password');
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    $('toggle-login-pass').innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
  });
  $('open-register-from-login').addEventListener('click', e => {
    e.preventDefault();
    closeModal('login-modal');
    openRegister('productor');
  });

  // Limpiar errores al tipear en login
  ['login-email','login-password'].forEach(id => {
    const errMap = { 'login-email':'err-login-email', 'login-password':'err-login-password' };
    $(id).addEventListener('input', e => { e.stopPropagation(); clearError(id, errMap[id]); });
  });

  // Modal carrito
  $('cart-btn').addEventListener('click', () => { renderCart(); openModal('cart-modal'); });
  $('mobile-cart-btn').addEventListener('click', () => { closeDrawer(); renderCart(); openModal('cart-modal'); });
  $('close-cart').addEventListener('click', () => closeModal('cart-modal'));

  // Cerrar modales al hacer clic fuera
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('login-modal');
      closeModal('cart-modal');
      closeModal('register-modal');
      closeModal('checkout-modal');
      closeModal('producer-panel-modal');
      closeDrawer();
    }
  });

  // Drawer móvil
  $('mobile-menu-btn').addEventListener('click', openDrawer);
  $('close-drawer').addEventListener('click', closeDrawer);
  $('drawer-overlay').addEventListener('click', closeDrawer);

  // Hero CTA
  $('hero-cta-btn').addEventListener('click', () => {
    document.querySelector('.main-layout').scrollIntoView({ behavior: 'smooth' });
  });
});

// ══════════════════════════════════════════
// MÓDULO DE REGISTRO SIMULADO
// ══════════════════════════════════════════

let regRole = 'productor'; // 'comprador' | 'productor'

function openRegister(role) {
  regRole = role;
  resetRegisterForm();
  openModal('register-modal');
}

function resetRegisterForm() {
  // Pasos
  showRegStep(1);

  // Badge
  const badge = $('reg-role-badge');
  badge.innerHTML = '<i class="fa-solid fa-tractor"></i> Productor';
  badge.className = 'reg-role-badge amber-badge';
  $('register-modal-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Registro de Productor';

  // Limpiar campos comunes
  ['reg-nombre','reg-email','reg-tel','reg-password'].forEach(id => {
    $(id).value = '';
    $(id).classList.remove('error');
  });
  ['err-nombre','err-email','err-tel','err-password'].forEach(id => $(id).textContent = '');

  // Limpiar campos paso 2
  const prodFields = $('reg-productor-fields');
  prodFields.classList.remove('hidden');
  $('reg-finca').value = '';
  $('reg-vereda').value = '';
  $('reg-hectareas').value = '';
  ['err-finca','err-vereda'].forEach(id => $(id).textContent = '');
}

function showRegStep(step) {
  $('reg-step-1').classList.toggle('hidden', step !== 1);
  $('reg-step-2').classList.toggle('hidden', step !== 2);
  $('reg-step-success').classList.toggle('hidden', step !== 3);

  const labels = { 1: 'Paso 1 de 2 — Datos personales', 2: 'Paso 2 de 2 — Datos específicos', 3: '¡Listo!' };
  $('register-step-indicator').textContent = labels[step] || '';
}

// Validar paso 1
function validateStep1() {
  let ok = true;
  const nombre = $('reg-nombre').value.trim();
  const email  = $('reg-email').value.trim();
  const tel    = $('reg-tel').value.trim();
  const pass   = $('reg-password').value;

  // Nombre
  if (!nombre || nombre.length < 3) {
    setError('reg-nombre', 'err-nombre', 'Ingresa tu nombre completo (mín. 3 caracteres)');
    ok = false;
  } else clearError('reg-nombre', 'err-nombre');

  // Email
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    setError('reg-email', 'err-email', 'Ingresa un correo válido');
    ok = false;
  } else clearError('reg-email', 'err-email');

  // Teléfono
  const telRe = /^[0-9]{7,11}$/;
  if (!telRe.test(tel.replace(/\s/g,''))) {
    setError('reg-tel', 'err-tel', 'Ingresa un teléfono válido (7-11 dígitos)');
    ok = false;
  } else clearError('reg-tel', 'err-tel');

  // Contraseña
  if (pass.length < 6) {
    setError('reg-password', 'err-password', 'La contraseña debe tener mínimo 6 caracteres');
    ok = false;
  } else clearError('reg-password', 'err-password');

  return ok;
}

// Validar paso 2
function validateStep2() {
  let ok = true;
  const finca  = $('reg-finca').value.trim();
  const vereda = $('reg-vereda').value;
  if (!finca) { setError('reg-finca','err-finca','Ingresa el nombre de tu finca'); ok=false; }
  else clearError('reg-finca','err-finca');
  if (!vereda) { setError('reg-vereda','err-vereda','Selecciona tu zona'); ok=false; }
  else clearError('reg-vereda','err-vereda');
  return ok;
}

function setError(inputId, errId, msg) {
  $(inputId).classList.add('error');
  $(errId).textContent = msg;
}
function clearError(inputId, errId) {
  $(inputId).classList.remove('error');
  $(errId).textContent = '';
}

function resetLoginForm() {
  const loginEmail = $('login-email');
  const loginPass = $('login-password');
  if (loginEmail) {
    loginEmail.value = '';
    loginEmail.classList.remove('error');
  }
  if (loginPass) {
    loginPass.value = '';
    loginPass.classList.remove('error');
    loginPass.type = 'password';
  }
  ['err-login-email','err-login-password'].forEach(id => { if ($(id)) $(id).textContent = ''; });
  if ($('toggle-login-pass')) $('toggle-login-pass').innerHTML = '<i class="fa-solid fa-eye"></i>';
}

function validateLogin() {
  let ok = true;
  const email = $('login-email').value.trim();
  const pass = $('login-password').value;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRe.test(email)) {
    setError('login-email','err-login-email','Ingresa un correo válido');
    ok = false;
  } else {
    clearError('login-email','err-login-email');
  }

  if (!pass || pass.length < 6) {
    setError('login-password','err-login-password','Ingresa una contraseña válida (mín. 6 caracteres)');
    ok = false;
  } else {
    clearError('login-password','err-login-password');
  }

  return ok;
}

function handleLogin() {
  const email = $('login-email').value.trim();
  const password = $('login-password').value;
  const data = window._producerData || {};
  const defaultName = email.split('@')[0].replace(/[^a-zA-Z0-9]+/g, ' ').trim() || 'Productor';
  const nombre = data.nombre || defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

  window._producerData = {
    nombre,
    email,
    password,
    finca: data.finca || 'Finca simulada',
    vereda: data.vereda || 'Zona Baja',
    prods: '10 productos del catálogo de AgroAipe',
    ha: data.ha || ''
  };

  closeModal('login-modal');
  clearSearchAndRefresh();
  openProducerPanel();
}

// Mostrar pantalla de éxito del registro de productor
function showSuccess() {
  const nombre = $('reg-nombre').value.trim();
  const email  = $('reg-email').value.trim();
  const pass   = $('reg-password').value;
  const finca  = $('reg-finca').value;
  const vereda = $('reg-vereda').options[$('reg-vereda').selectedIndex]?.text || '';
  const ha = $('reg-hectareas').value;
  const prods = '10 productos del catálogo de AgroAipe';

  $('success-title').innerHTML = `¡Hola, ${nombre}! Tu finca ya está en AgroAipe <i class="fa-solid fa-leaf"></i>`;
  $('success-msg').textContent = 'Tu cuenta de productor está lista. Ahora puedes ver el catálogo compartido de productos.';
  $('success-summary').innerHTML = `
    <div><i class="fa-solid fa-user"></i> <strong>Nombre:</strong> ${nombre}</div>
    <div><i class="fa-solid fa-envelope"></i> <strong>Correo:</strong> ${email}</div>
    <div><i class="fa-solid fa-seedling"></i> <strong>Finca:</strong> ${finca}</div>
    <div><i class="fa-solid fa-location-dot"></i> <strong>Zona:</strong> ${vereda}</div>
    <div><i class="fa-solid fa-cart-shopping"></i> <strong>Productos:</strong> ${prods}</div>
    ${ha ? `<div><i class="fa-solid fa-ruler-combined"></i> <strong>Hectáreas:</strong> ${ha}</div>` : ''}
  `;
  // Guardar datos del productor para el panel
  window._producerData = { nombre, email, password: pass, finca, vereda, prods, ha };
  showRegStep(3);
}

// Inicializar listeners del registro
document.addEventListener('DOMContentLoaded', () => {
  // Cerrar registro
  $('close-register').addEventListener('click', () => closeModal('register-modal'));
  $('register-modal').addEventListener('click', e => {
    if (e.target === $('register-modal')) closeModal('register-modal');
  });

  // Paso 1 → Paso 2
  $('btn-step1-next').addEventListener('click', () => {
    if (validateStep1()) showRegStep(2);
  });

  // Paso 2 → Paso 1 (atrás)
  $('btn-step2-back').addEventListener('click', () => showRegStep(1));

  // Enviar registro
  $('btn-register-submit').addEventListener('click', () => {
    if (validateStep2()) showSuccess();
  });

  // Cerrar pantalla de éxito del productor → abrir panel del productor
  $('btn-close-success').addEventListener('click', () => {
    closeModal('register-modal');
    clearSearchAndRefresh();
    openProducerPanel();
  });

  // Si cierra el modal de registro sin completar, también limpia la búsqueda
  $('close-register').addEventListener('click', clearSearchAndRefresh);

  // Mostrar/ocultar contraseña
  $('toggle-pass').addEventListener('click', () => {
    const input = $('reg-password');
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    $('toggle-pass').innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
  });

  // Limpiar error al tipear (sin afectar la búsqueda)
  ['reg-nombre','reg-email','reg-tel','reg-password'].forEach(id => {
    const errMap = { 'reg-nombre':'err-nombre', 'reg-email':'err-email', 'reg-tel':'err-tel', 'reg-password':'err-password' };
    $(id).addEventListener('input', e => {
      e.stopPropagation(); // evitar que el evento burbujee al search
      clearError(id, errMap[id]);
    });
  });
});

// Limpia la búsqueda y vuelve a mostrar todos los productos
function clearSearchAndRefresh() {
  searchQuery = '';
  const si = $('search-input');
  const ms = $('mobile-search');
  if (si) si.value = '';
  if (ms) ms.value = '';
  renderProducts();
}

// ══════════════════════════════════════
// CHECKOUT DEL COMPRADOR
// ══════════════════════════════════════
function openCheckout() {
  // Resetear formulario
  ['co-nombre','co-tel','co-municipio','co-direccion'].forEach(id => {
    $(id).value = '';
    $(id).classList.remove('error');
  });
  $('co-pago').value = '';
  ['co-err-nombre','co-err-tel','co-err-municipio','co-err-direccion','co-err-pago']
    .forEach(id => $(id).textContent = '');

  // Mini resumen del carrito
  const total = cart.reduce((s,i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  $('checkout-summary-mini').innerHTML = `
    <div class="checkout-cart-summary">
      <span><i class="fa-solid fa-cart-shopping"></i> ${itemCount} producto(s)</span>
      <span class="checkout-total">${fmt(total)}</span>
    </div>
  `;

  // Mostrar formulario, ocultar éxito
  $('checkout-form-step').classList.remove('hidden');
  $('checkout-success-step').classList.add('hidden');
  $('checkout-step-label').textContent = 'Datos de entrega';

  openModal('checkout-modal');
  setTimeout(() => {
    const nombreInput = $('co-nombre');
    if (nombreInput) nombreInput.focus();
  }, 0);
}

function validateCheckout() {
  let ok = true;
  const nombre = $('co-nombre').value.trim();
  const tel    = $('co-tel').value.trim().replace(/\s/g,'');
  const mun    = $('co-municipio').value.trim();
  const dir    = $('co-direccion').value.trim();
  const pago   = $('co-pago').value;

  if (!nombre || nombre.length < 3) { setError('co-nombre','co-err-nombre','Ingresa tu nombre completo'); ok=false; }
  else clearError('co-nombre','co-err-nombre');

  if (!/^[0-9]{7,11}$/.test(tel)) { setError('co-tel','co-err-tel','Teléfono válido (7-11 dígitos)'); ok=false; }
  else clearError('co-tel','co-err-tel');

  if (!mun) { setError('co-municipio','co-err-municipio','Indica tu municipio'); ok=false; }
  else clearError('co-municipio','co-err-municipio');

  if (!dir) { setError('co-direccion','co-err-direccion','Indica tu dirección de entrega'); ok=false; }
  else clearError('co-direccion','co-err-direccion');

  if (!pago) { setError('co-pago','co-err-pago','Selecciona un método de pago'); ok=false; }
  else clearError('co-pago','co-err-pago');

  return ok;
}

function confirmOrder() {
  const nombre = $('co-nombre').value.trim();
  const tel    = $('co-tel').value.trim();
  const mun    = $('co-municipio').value.trim();
  const dir    = $('co-direccion').value.trim();
  const pagoOpt = $('co-pago');
  const pago   = pagoOpt.options[pagoOpt.selectedIndex].text;
  const total  = cart.reduce((s,i) => s + i.price * i.quantity, 0);
  const items  = cart.map(i => `${i.name} (${i.quantity})`).join(', ');

  $('checkout-success-summary').innerHTML = `
    <div><i class="fa-solid fa-user"></i> <strong>Nombre:</strong> ${nombre}</div>
    <div><i class="fa-solid fa-mobile-screen-button"></i> <strong>Teléfono:</strong> ${tel}</div>
    <div><i class="fa-solid fa-location-dot"></i> <strong>Municipio:</strong> ${mun}</div>
    <div><i class="fa-solid fa-house"></i> <strong>Dirección:</strong> ${dir}</div>
    <div><i class="fa-solid fa-credit-card"></i> <strong>Pago:</strong> ${pago}</div>
    <div><i class="fa-solid fa-cart-shopping"></i> <strong>Productos:</strong> ${items}</div>
    <div><i class="fa-solid fa-money-bill-wave"></i> <strong>Total:</strong> ${fmt(total)}</div>
  `;

  $('checkout-form-step').classList.add('hidden');
  $('checkout-success-step').classList.remove('hidden');
  $('checkout-step-label').textContent = '¡Pedido confirmado!';

  // Vaciar carrito
  cart = [];
  updateCartBadge();
}

// Listeners del checkout
document.addEventListener('DOMContentLoaded', () => {
  $('close-checkout').addEventListener('click', () => closeModal('checkout-modal'));
  $('checkout-modal').addEventListener('click', e => {
    if (e.target === $('checkout-modal')) closeModal('checkout-modal');
  });
  $('btn-confirm-order').addEventListener('click', () => {
    if (validateCheckout()) confirmOrder();
  });
  $('btn-close-checkout-success').addEventListener('click', () => {
    closeModal('checkout-modal');
    clearSearchAndRefresh();
    showToast('¡Gracias por tu pedido! Pronto te contactamos', '<i class="fa-solid fa-party-horn"></i>');
  });

  // Limpiar errores al tipear en checkout
  ['co-nombre','co-tel','co-municipio','co-direccion'].forEach(id => {
    const errId = id.replace('co-','co-err-');
    $(id).addEventListener('input', e => { e.stopPropagation(); clearError(id, errId); });
  });
});

// ══════════════════════════════════════
// PANEL DEL PRODUCTOR
// ══════════════════════════════════════
function openProducerPanel() {
  const d = window._producerData || {};
  $('producer-panel-title').textContent = `¡Hola, ${d.nombre || 'Productor'}!`;
  $('producer-info-bar').innerHTML = `
    <div class="producer-info-row">
      <span><i class="fa-solid fa-seedling"></i> <strong>${d.finca || ''}</strong></span>
      <span><i class="fa-solid fa-location-dot"></i> ${d.vereda || ''}</span>
      <span><i class="fa-solid fa-box-open"></i> Catálogo: 10 productos comunes</span>
    </div>
  `;

  // Listar los 10 productos del marketplace
  $('producer-product-list').innerHTML = products.map(p => `
    <div class="producer-product-row">
      <img src="${p.image}" onerror="this.src='${p.fallback}'" alt="${p.name}" class="producer-prod-img">
      <div class="producer-prod-info">
        <div class="producer-prod-name">${p.name}</div>
        <div class="producer-prod-meta">${fmt(p.price)} / ${p.unit} — Stock: ${p.stock}</div>
      </div>
      <span class="producer-prod-status"><i class="fa-solid fa-circle-check"></i> Activo</span>
    </div>
  `).join('');

  openModal('producer-panel-modal');
  showToast('¡Bienvenido a tu panel, productor!', '<i class="fa-solid fa-seedling"></i>');
}

document.addEventListener('DOMContentLoaded', () => {
  $('close-producer-panel').addEventListener('click', () => closeModal('producer-panel-modal'));
  $('close-producer-panel-btn').addEventListener('click', () => closeModal('producer-panel-modal'));
  $('producer-panel-modal').addEventListener('click', e => {
    if (e.target === $('producer-panel-modal')) closeModal('producer-panel-modal');
  });
});