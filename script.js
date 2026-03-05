/**
 * Associação de Recreio e Cultura Bairro da Tabaqueira
 * script.js – Interatividade principal
 */

/* ============================================================
   1. NAVBAR – scroll effect & active link
============================================================ */
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

// Sticky navbar com fundo ao descer
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  updateActiveNavLink();
  toggleBackToTop();
});

// Hamburger menu (mobile)
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Fechar menu ao clicar num link
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Destacar link ativo consoante a secção visível
function updateActiveNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const links     = document.querySelectorAll('.nav-link');
  let currentId   = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) currentId = sec.id;
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentId) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   2. SMOOTH SCROLL para âncoras internas
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   3. SCROLL REVEAL (AOS simples sem biblioteca externa)
============================================================ */
const aosElements = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Respeita data-aos-delay se definido
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        aosObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

aosElements.forEach(el => aosObserver.observe(el));

/* ============================================================
   4. MENU TABS
============================================================ */
const tabBtns    = document.querySelectorAll('.tab-btn');
const menuTabs   = document.querySelectorAll('.menu-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    // Remover activo de todos
    tabBtns.forEach(b => b.classList.remove('active'));
    menuTabs.forEach(t => {
      t.classList.remove('active');
      t.style.animation = '';
    });

    // Activar selecionado
    btn.classList.add('active');
    const activeTab = document.getElementById('tab-' + tabId);
    if (activeTab) {
      activeTab.classList.add('active');
      activeTab.style.animation = 'tab-fade .4s ease';
    }
  });
});

// Injectar animação CSS de transição de tab dinamicamente
const tabStyle = document.createElement('style');
tabStyle.textContent = `
  @keyframes tab-fade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(tabStyle);

/* ============================================================
   5. BACK TO TOP BUTTON
============================================================ */
const backToTop = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   6. FORMULÁRIO DE CONTACTO – validação e feedback
============================================================ */
const form        = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const btnText     = form ? form.querySelector('.btn-text')    : null;
const btnLoading  = form ? form.querySelector('.btn-loading') : null;

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação simples
    const nome     = form.nome.value.trim();
    const email    = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      shakeForm(form);
      highlightEmptyFields(form);
      return;
    }

    if (!isValidEmail(email)) {
      highlightField(form.email, 'Email inválido');
      return;
    }

    // Simular envio (substituir por fetch/API real)
    btnText.style.display    = 'none';
    btnLoading.style.display = 'flex';

    setTimeout(() => {
      btnText.style.display    = 'inline-flex';
      btnLoading.style.display = 'none';
      formSuccess.style.display = 'flex';
      form.reset();

      // Esconder mensagem de sucesso após 6s
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 6000);
    }, 1800);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function highlightEmptyFields(f) {
  ['nome', 'email', 'mensagem'].forEach(name => {
    const field = f[name];
    if (field && !field.value.trim()) {
      highlightField(field, '');
    }
  });
}

function highlightField(field, msg) {
  field.style.borderColor = '#E57373';
  field.focus();
  setTimeout(() => { field.style.borderColor = ''; }, 2500);
}

function shakeForm(el) {
  el.style.animation = 'none';
  // Injectar keyframe de shake se ainda não existir
  if (!document.getElementById('shake-style')) {
    const s = document.createElement('style');
    s.id = 'shake-style';
    s.textContent = `
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-6px); }
        40%      { transform: translateX(6px); }
        60%      { transform: translateX(-4px); }
        80%      { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(s);
  }
  el.style.animation = 'shake .4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

/* ============================================================
   7. RATING BARS – animar quando visíveis
============================================================ */
const barFills = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // A largura já está definida inline no HTML, só precisamos de "re-trigger"
      const fill = entry.target;
      const width = fill.style.width;
      fill.style.width = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.width = width;
        });
      });
      barObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

barFills.forEach(bar => barObserver.observe(bar));

/* ============================================================
   8. PARALLAX suave no Hero (desktop apenas)
============================================================ */
const heroOverlay = document.querySelector('.hero-overlay');

if (heroOverlay && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
}

/* ============================================================
   9. NÚMEROS ANIMADOS (contagem)
============================================================ */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = progress < .5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target || el.textContent.replace('+', '').replace(',', '.'));
      animateCounter(el, target);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  statObserver.observe(el);
});

/* ============================================================
   10. HERO KEYBOARD NAVIGATION
============================================================ */
document.querySelectorAll('.hero-actions .btn').forEach(btn => {
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') btn.click();
  });
});

/* ============================================================
   11. Init ao carregar a página
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se já está scrollado (ex: refresh com posição)
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  toggleBackToTop();
  updateActiveNavLink();

  // Marcar o primeiro tab como ativo por defeito
  const firstTab = document.querySelector('.tab-btn');
  if (firstTab) firstTab.click();
});

/* ============================================================
   12. LIGHTBOX — Galeria de Fotografias
============================================================ */
(function initLightbox() {
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const closebtn     = document.getElementById('lightbox-close');
  const prevBtn      = document.getElementById('lightbox-prev');
  const nextBtn      = document.getElementById('lightbox-next');

  if (!lightbox) return;

  // Recolher todas as imagens da galeria
  const galeriaItems = Array.from(document.querySelectorAll('.galeria-item'));
  let currentIndex   = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item   = galeriaItems[index];
    const img    = item.querySelector('img');
    const cap    = item.dataset.caption || img.alt;

    lightboxImg.src = img.src.replace('w=700', 'w=1200'); // melhor resolução
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = cap;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Atualizar botões nav
    prevBtn.style.display = galeriaItems.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = galeriaItems.length > 1 ? 'flex' : 'none';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Limpar src com ligeiro delay para evitar flash
    setTimeout(() => { lightboxImg.src = ''; }, 350);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galeriaItems.length) % galeriaItems.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galeriaItems.length;
    openLightbox(currentIndex);
  }

  // Click nos items da galeria
  galeriaItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(index);
    });
  });

  // Controlos do lightbox
  closebtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Fechar ao clicar no fundo
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado: Esc, setas
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')    showPrev();
    if (e.key === 'ArrowRight')   showNext();
  });

  // Swipe (touch)
  let touchX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
  });
})();

