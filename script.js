// ==========================================
// 1. NAVEGACIÓN Y MENÚ RESPONSIVO
// ==========================================
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('nav');

// Alternar menú desplegable
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation.classList.toggle('open', open);
});

// Cerrar menú al hacer clic en un enlace
navigation.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Cerrar menú al presionar la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// ==========================================
// 2. PIE DE PÁGINA Y NAVEGACIÓN ACTIVA
// ==========================================
// Actualizar el año dinámicamente en el footer
document.querySelector('#year').textContent = new Date().getFullYear();

// Marcar la página actual en la navegación
const currentPage = location.pathname.endsWith('sobre-nosotros.html')
  ? 'sobre-nosotros.html'
  : 'index.html';

document.querySelectorAll('nav a').forEach((a) => {
  if (a.getAttribute('href') === currentPage) {
    a.setAttribute('aria-current', 'page');
  }
});

// ==========================================
// 3. CARRUSEL / HERO SLIDER
// ==========================================
const slides = [
  {
    eyebrow: 'NATURALEZA QUE ACOMPAÑA',
    title: 'Una pausa para ti.<br>Un momento para <em>florecer.</em>',
    copy: 'Velas, jabones y sales de baño hechos a mano, para encontrar bienestar en los pequeños momentos.',
    link: '#productos',
    label: 'Descubre nuestros productos',
    image: 'assets/hero.png',
    alt: 'Velas y jabones artesanales entre flores y lino'
  },
  {
    eyebrow: 'CALIDEZ PARA TUS MOMENTOS',
    title: 'Enciende la calma.<br>Disfruta lo <em>simple.</em>',
    copy: 'Descubre nuestras velas artesanales y encuentra el aroma que acompañará tu próxima pausa.',
    link: '#productos',
    label: 'Explora nuestras velas',
    image: 'assets/velas.jpg',
    alt: 'Velas artesanales encendidas con pétalos de rosa'
  },
  {
    eyebrow: 'EL DETALLE DE LO HECHO A MANO',
    title: 'Regala un instante.<br>Comparte <em>bienestar.</em>',
    copy: 'Jabones y sales de baño para llenar la rutina de aromas, texturas y pequeños detalles.',
    link: '#productos',
    label: 'Encuentra tu próximo ritual',
    image: 'assets/jabones.jpg',
    alt: 'Jabones artesanales de inspiración botánica'
  }
];

if (document.querySelector('.hero')) {
  let active = 0;
  let timer = null;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dots = [...document.querySelectorAll('.dots button')];
  const pause = document.querySelector('#pause');

  function show(i) {
    active = (i + slides.length) % slides.length;
    const s = slides[active];

    document.querySelector('#hero-eyebrow').textContent = s.eyebrow;
    document.querySelector('#hero-title').innerHTML = s.title;
    document.querySelector('#hero-copy').textContent = s.copy;

    const link = document.querySelector('#hero-link');
    link.href = s.link;
    link.innerHTML = s.label + ' <span>↗</span>';

    const img = document.querySelector('.hero-image');
    img.src = s.image;
    img.alt = s.alt;

    dots.forEach((d, j) => d.setAttribute('aria-current', String(j === active)));
    document.querySelector('#slide-number').textContent = `0${active + 1} / 03`;
  }

  function start() {
    clearInterval(timer);
    if (!paused) {
      timer = setInterval(() => show(active + 1), 6500);
    }
    pause.textContent = paused ? '▷' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
  }

  // Event Listeners de Controles
  dots.forEach((d, i) =>
    d.addEventListener('click', () => {
      show(i);
      start();
    })
  );

  document.querySelector('#previous').addEventListener('click', () => {
    show(active - 1);
    start();
  });

  document.querySelector('#next').addEventListener('click', () => {
    show(active + 1);
    start();
  });

  pause.addEventListener('click', () => {
    paused = !paused;
    start();
  });

  // Pausar al enfocar elementos del carrusel o cambiar de pestaña
  document.querySelector('.hero').addEventListener('focusin', () => clearInterval(timer));
  document.querySelector('.hero').addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () =>
    document.hidden ? clearInterval(timer) : start()
  );

  start();
}

// ==========================================
// 4. FORMULARIO DE CONTACTO (WHATSAPP)
// ==========================================
const form = document.querySelector('#contact-form');

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.elements.name.value.trim();
  if (!name) {
    form.elements.name.focus();
    return;
  }

  const text = `Hola, soy ${name}. Me interesa: ${form.elements.interest.value}. ${form.elements.message.value.trim()}`;
  window.open(
    'https://wa.me/56930549400?text=' + encodeURIComponent(text),
    '_blank',
    'noopener,noreferrer'
  );
});

// ==========================================
// 5. GALERÍA COVERFLOW 3D Y AMPLIACIÓN
// Las fotos se leen del HTML: no hay que modificar este arreglo al agregar imágenes.
// ==========================================
const lightbox = document.querySelector('#lightbox');
function openGalleryImage(card) {
  if (!lightbox) return;
  const img = lightbox.querySelector('img');
  img.src = card.dataset.image;
  img.alt = card.querySelector('img').alt;
  lightbox.showModal();
}
document.querySelector('#close-lightbox')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

const coverflow = document.querySelector('.coverflow');
if (coverflow) {
  const stage = coverflow.querySelector('.coverflow-stage');
  const cards = [...stage.querySelectorAll('.coverflow-card')];
  const dotsContainer = coverflow.querySelector('.coverflow-dots');
  const status = coverflow.querySelector('.coverflow-status');
  const previous = document.querySelector('#gallery-prev');
  const next = document.querySelector('#gallery-next');
  const count = cards.length;
  let selected = Math.min(1, count - 1);
  let drag = null;
  let suppressClickUntil = 0;
  const wrap = (index) => (index % count + count) % count;
  const dots = cards.map((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Mostrar foto ${index + 1}: ${card.dataset.title || card.querySelector('img').alt}`);
    dot.addEventListener('click', () => select(index));
    dotsContainer.append(dot);
    return dot;
  });

  function spacing() {
    return Math.min(stage.clientWidth * 0.31, cards[0].offsetWidth * 0.78);
  }
  function render(position = selected) {
    cards.forEach((card, index) => {
      let distance = index - position;
      // Distancia circular: permite recorrer los extremos sin un límite artificial.
      if (count > 2) distance -= Math.round(distance / count) * count;
      const depth = Math.abs(distance);
      const active = index === selected;
      const hidden = depth > 2.5;
      const x = distance * spacing();
      const z = -Math.min(depth, 3) * 110;
      const angle = -Math.sign(distance) * Math.min(depth, 1) * 38;
      const scale = Math.max(0.58, 1 - depth * 0.17);
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg) scale(${scale})`;
      card.style.zIndex = String(100 - Math.round(depth * 10));
      card.style.opacity = hidden ? '0' : String(Math.max(0.3, 1 - depth * 0.17));
      card.style.pointerEvents = hidden ? 'none' : 'auto';
      card.classList.toggle('is-active', active);
      card.tabIndex = active ? 0 : -1;
      card.setAttribute('aria-hidden', String(hidden));
      card.setAttribute('aria-label', `${card.dataset.title || card.querySelector('img').alt}. Foto ${index + 1} de ${count}. ${active ? 'Ampliar imagen' : 'Centrar imagen'}`);
      dots[index].setAttribute('aria-current', String(active));
    });
  }
  function select(index, moveFocus = false) {
    if (!count) return;
    selected = wrap(index);
    render();
    status.textContent = `${selected + 1} / ${count} · ${cards[selected].dataset.title || cards[selected].querySelector('img').alt}`;
    if (moveFocus) cards[selected].focus({ preventScroll: true });
  }
  cards.forEach((card, index) => card.addEventListener('click', () => {
    if (performance.now() < suppressClickUntil) return;
    if (index === selected) openGalleryImage(card);
    else select(index);
  }));
  previous.addEventListener('click', () => select(selected - 1));
  next.addEventListener('click', () => select(selected + 1));
  previous.disabled = next.disabled = count < 2;
  stage.addEventListener('keydown', (event) => {
    let target;
    if (event.key === 'ArrowLeft') target = selected - 1;
    if (event.key === 'ArrowRight') target = selected + 1;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = count - 1;
    if (target !== undefined) {
      event.preventDefault();
      select(target, true);
    }
  });

  // Pointer Events sirven para mouse, lápiz y pantalla táctil.
  // pan-y conserva el desplazamiento vertical de la página en el celular.
  stage.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || count < 2 || drag) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, axis: null };
  });
  stage.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis === 'x') {
        stage.setPointerCapture(event.pointerId);
        coverflow.classList.add('is-dragging');
      }
    }
    if (drag.axis !== 'x') return;
    drag.dx = Math.max(-spacing(), Math.min(spacing(), dx));
    event.preventDefault();
    render(selected - drag.dx / spacing());
  });
  function finishDrag(event, cancelled = false) {
    if (!drag || drag.id !== event.pointerId) return;
    const gesture = drag;
    drag = null;
    coverflow.classList.remove('is-dragging');
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (gesture.axis !== 'x') return;
    suppressClickUntil = performance.now() + 350;
    const step = !cancelled && Math.abs(gesture.dx) > Math.min(45, spacing() * 0.22) ? (gesture.dx < 0 ? 1 : -1) : 0;
    select(selected + step);
  }
  stage.addEventListener('pointerup', (event) => finishDrag(event));
  stage.addEventListener('pointercancel', (event) => finishDrag(event, true));
  stage.addEventListener('lostpointercapture', (event) => finishDrag(event, true));
  // Un gesto iniciado en la tarjeta puede finalizar fuera del módulo sin capturar.
  window.addEventListener('pointerup', (event) => finishDrag(event));
  stage.addEventListener('dragstart', (event) => event.preventDefault());
  if (count) {
    coverflow.classList.add('is-ready');
    select(selected);
    new ResizeObserver(() => render()).observe(stage);
  }
}
