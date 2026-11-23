/** UPFOREX Editorial Concept. Vanilla JS, no libraries or trackers. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Navigation: keyboard-accessible full-screen menu on tablets and phones.
  const menuButton = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const setMenu = (isOpen) => {
    if (!menuButton || !mobileMenu) return;
    document.body.classList.toggle('menu-open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    mobileMenu.inert = !isOpen;
    if (!isOpen && mobileMenu.contains(document.activeElement)) menuButton.focus();
  };
  menuButton?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  $$('#mobileMenu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu?.classList.contains('open')) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1030 && mobileMenu?.classList.contains('open')) setMenu(false);
  });

  // One passive scroll handler for the reading indicator and header.
  let scrollScheduled = false;
  const updateScroll = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scroll = window.scrollY || document.documentElement.scrollTop;
    const progress = $('#scrollProgress');
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, (scroll / maxScroll) * 100))}%`;
    $('#header')?.classList.toggle('scrolled', scroll > 35);
    scrollScheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  updateScroll();

  // Progressive reveal; never hide content if IntersectionObserver is unavailable.
  const revealEls = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px 45px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Six-markets interactive editorial selector. These are not live price feeds.
  const marketData = [
    { title: 'Forex CFDs', tag: 'CURRENCIES / GLOBAL EXCHANGE', description: 'Explore currency market movements from one trading space.', mark: 'FX', link: 'https://www.upforex.com/products/forex-cfds' },
    { title: 'Stock CFDs', tag: 'EQUITIES / GLOBAL COMPANIES', description: 'Discover the companies and sectors shaping the markets.', mark: 'ST', link: 'https://www.upforex.com/products/stock-cfds' },
    { title: 'Precious Metals', tag: 'COMMODITIES / HARD ASSETS', description: 'Explore precious metals including gold market movements.', mark: 'AU', link: 'https://www.upforex.com/products/precious-metal' },
    { title: 'Index CFDs', tag: 'INDICES / MARKET BENCHMARKS', description: 'Follow broader market trends through major indices.', mark: 'IX', link: 'https://www.upforex.com/products/index-cfds' },
    { title: 'Energy CFDs', tag: 'ENERGY / COMMODITIES', description: 'Discover energy-related market opportunities and movements.', mark: 'EN', link: 'https://www.upforex.com/products/energy-cfds' },
    { title: 'Crypto CFDs', tag: 'DIGITAL / ASSET MARKETS', description: 'Explore cryptocurrency CFDs with risk in view.', mark: 'CR', link: 'https://www.upforex.com/products/cryptocurrencies-cfd' },
  ];
  const showcase = $('#marketShowcase');
  const marketButtons = $$('.market-option');
  let selectedMarket = 0;
  const chooseMarket = index => {
    if (!Number.isInteger(index) || index < 0 || index >= marketData.length) return;
    if (!showcase) return;
    selectedMarket = index;
    const data = marketData[index];
    showcase.dataset.market = String(index);
    $('#showcaseIndex').textContent = `${String(index + 1).padStart(2, '0')} / 06`;
    $('#showcaseTag').textContent = data.tag;
    $('#showcaseTitle').textContent = data.title;
    $('#showcaseDescription').textContent = data.description;
    $('#showcaseMark').textContent = data.mark;
    $('#showcaseLink').href = data.link;
    marketButtons.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
  };
  marketButtons.forEach((button, index) => {
    button.addEventListener('click', () => chooseMarket(index));
    if (hasFinePointer) button.addEventListener('mouseenter', () => chooseMarket(index));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + marketButtons.length) % marketButtons.length;
        chooseMarket(next);
        marketButtons[next].focus();
      }
    });
  });
  chooseMarket(selectedMarket);

  // Pointer-following depth only for mice, never touch or reduced-motion users.
  if (hasFinePointer && !reduceMotion) {
    const orbitalStage = $('#orbitalStage');
    const heroArt = $('#heroArt');
    if (orbitalStage && heroArt) {
      heroArt.addEventListener('pointermove', event => {
        const rect = heroArt.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 13;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 13;
        orbitalStage.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      }, { passive: true });
      heroArt.addEventListener('pointerleave', () => { orbitalStage.style.transform = ''; });
    }
    const aura = $('#pointerAura');
    if (aura) {
      document.addEventListener('pointermove', event => {
        aura.style.left = `${event.clientX}px`;
        aura.style.top = `${event.clientY}px`;
        aura.style.opacity = '1';
      }, { passive: true });
      document.addEventListener('pointerleave', () => aura.style.opacity = '0');
    }
  }

  // Decorative effects intentionally never shift hit targets under a pointer.
  // Native <details> handles FAQ opening, closing, keyboard, and screen readers.
  const faqs = $$('.faq-items details');
  faqs.forEach(details => details.addEventListener('toggle', () => {
    if (details.open) faqs.forEach(other => { if (other !== details) other.open = false; });
  }));
})();


/* ========== UPFOREX MAX MOTION ANIMATION LAYER ========== */

/**
 * UPFOREX / MAX MOTION
 * Decorative enhancement only. All links, markets, menus and FAQs work
 * without this file. No analytics, dependencies or external API requests.
 */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const supportsObserver = 'IntersectionObserver' in window;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // -------------------------------------------------------------------------
  // 1. Editorial typography: reveal words, without changing their text.
  // -------------------------------------------------------------------------
  function splitHeading(heading) {
    const textNodes = [];
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      if (node.parentElement?.closest('.mini-star,.hero-asterisk,.outro-dot')) continue;
      textNodes.push(node);
    }
    let order = 0;
    textNodes.forEach(textNode => {
      const part = document.createDocumentFragment();
      const tokens = textNode.textContent.match(/\s+|\S+/g) || [];
      tokens.forEach(token => {
        if (/^\s+$/.test(token)) {
          part.appendChild(document.createTextNode(token));
          return;
        }
        const outer = document.createElement('span');
        outer.className = 'fx-word';
        const inner = document.createElement('span');
        inner.className = 'fx-word-inner';
        inner.style.setProperty('--word-delay', `${Math.min(order++, 12) * 65}ms`);
        inner.textContent = token;
        outer.appendChild(inner);
        part.appendChild(outer);
      });
      textNode.replaceWith(part);
    });
  }

  const movingTitles = $$('.editorial-heading, .outro-title, .principles-lead h2');
  if (!reduceMotion && supportsObserver) {
    movingTitles.forEach(splitHeading);
    document.documentElement.classList.add('fx-ready');
    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('fx-text-in');
        textObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 70px 0px', threshold: .12 });
    movingTitles.forEach(title => textObserver.observe(title));
  } else {
    movingTitles.forEach(title => title.classList.add('fx-text-in'));
  }

  // Stagger repeated items without changing their document order.
  $$('.resource-grid, .account-list, .principles-grid, .steps-list, .intro-columns').forEach(group => {
    $$('.reveal', group).forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 85, 350)}ms`);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Ambient particle constellation in the original dark globe panel.
  //     It represents an abstract network, NOT price or market data.
  // -------------------------------------------------------------------------
  const canvas = $('#heroParticles');
  if (canvas && !reduceMotion) {
    const host = $('#heroArt');
    const context = canvas.getContext('2d', { alpha: true });
    if (context && host) {
      let width = 1;
      let height = 1;
      let particles = [];
      let running = false;
      let visible = false;
      let lastTime = 0;
      let pointer = null;

      const buildParticles = () => {
        const count = width < 600 ? 22 : 44;
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - .5) * .34,
          vy: (Math.random() - .5) * .34,
          r: .7 + Math.random() * 1.45,
          alpha: .25 + Math.random() * .55,
        }));
      };
      const resizeCanvas = () => {
        const bounds = host.getBoundingClientRect();
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        const pixelRatio = Math.min(devicePixelRatio || 1, 1.75);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        buildParticles();
      };
      const renderParticles = () => {
        context.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
          if (pointer) {
            const dx = a.x - pointer.x;
            const dy = a.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > 1 && d2 < 110 * 110) {
              a.x += (dx / Math.sqrt(d2)) * .25;
              a.y += (dy / Math.sqrt(d2)) * .25;
            }
          }
          context.beginPath();
          context.arc(a.x, a.y, a.r, 0, Math.PI * 2);
          context.fillStyle = `rgba(125,255,102,${a.alpha})`;
          context.fill();
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance2 = dx * dx + dy * dy;
            if (distance2 > 115 * 115) continue;
            context.strokeStyle = `rgba(88,240,64,${(1 - Math.sqrt(distance2) / 115) * .15})`;
            context.lineWidth = .7;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      };
      const schedule = () => {
        if (running || !visible || document.hidden) return;
        running = true;
        requestAnimationFrame(frame);
      };
      const frame = time => {
        running = false;
        if (!visible || document.hidden) return;
        if (time - lastTime > 33) {  // maximum ~30 fps
          lastTime = time;
          renderParticles();
        }
        schedule();
      };
      resizeCanvas();
      if (supportsObserver) {
        const observer = new IntersectionObserver(entries => {
          visible = entries[0].isIntersecting;
          schedule();
        }, { threshold: .01 });
        observer.observe(host);
      } else {
        visible = true;
        schedule();
      }
      if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(host);
      else window.addEventListener('resize', resizeCanvas, { passive: true });
      host.addEventListener('pointermove', event => {
        const rect = host.getBoundingClientRect();
        pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }, { passive: true });
      host.addEventListener('pointerleave', () => { pointer = null; });
      document.addEventListener('visibilitychange', schedule);
    }
  }

  // -------------------------------------------------------------------------
  // 3. Section art parallax: translate property preserves existing transforms.
  // -------------------------------------------------------------------------
  if (!reduceMotion) {
    const depthItems = [
      ['.intro-icon', 30],
      ['.platform-giant', 45],
      ['.platform-sticker', -22],
      ['.partnership-symbol', 34],
      ['.resource-graphic', 20],
    ].flatMap(([selector, strength]) => $$(selector).map(element => ({ element, strength })));
    depthItems.forEach(({ element }) => element.classList.add('fx-parallax'));
    let ticking = false;
    const moveArt = () => {
      ticking = false;
      const vh = innerHeight;
      depthItems.forEach(({ element, strength }) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = clamp((vh / 2 - (rect.top + rect.height / 2)) / (vh * .8), -1, 1);
        element.style.setProperty('--fx-parallax', `${(progress * strength).toFixed(2)}px`);
      });
    };
    const onArtScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(moveArt);
    };
    window.addEventListener('scroll', onArtScroll, { passive: true });
    window.addEventListener('resize', onArtScroll, { passive: true });
    onArtScroll();
  }

  // -------------------------------------------------------------------------
  // 4. Magnetic CTAs, positional radial highlights and a very slight 3D tilt.
  // -------------------------------------------------------------------------
  if (finePointer && !reduceMotion) {
    $$('.magnetic, .round-arrow, .outro-cta').forEach(target => {
      target.addEventListener('pointermove', event => {
        const box = target.getBoundingClientRect();
        const x = clamp((event.clientX - box.left - box.width / 2) * .16, -12, 12);
        const y = clamp((event.clientY - box.top - box.height / 2) * .16, -12, 12);
        target.style.setProperty('--mag-x', `${x.toFixed(1)}px`);
        target.style.setProperty('--mag-y', `${y.toFixed(1)}px`);
      }, { passive: true });
      target.addEventListener('pointerleave', () => {
        target.style.setProperty('--mag-x', '0px');
        target.style.setProperty('--mag-y', '0px');
      });
    });

    $$('.resource-link, .account-row, .market-showcase').forEach(surface => {
      surface.classList.add('fx-spotlight-host');
      const glow = document.createElement('span');
      glow.className = 'fx-spotlight';
      glow.setAttribute('aria-hidden', 'true');
      surface.appendChild(glow);
      const allowTilt = surface.matches('.resource-link, .market-showcase');
      if (allowTilt) surface.classList.add('fx-tilt');
      let framePending = false;
      let nextPosition = null;
      surface.addEventListener('pointermove', event => {
        const rect = surface.getBoundingClientRect();
        const rx = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const ry = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        nextPosition = { rx, ry };
        if (framePending) return;
        framePending = true;
        requestAnimationFrame(() => {
          framePending = false;
          if (!nextPosition) return;
          surface.style.setProperty('--fx-x', `${(nextPosition.rx * 100).toFixed(1)}%`);
          surface.style.setProperty('--fx-y', `${(nextPosition.ry * 100).toFixed(1)}%`);
          if (allowTilt) {
            const tiltX = ((.5 - nextPosition.ry) * 3.5).toFixed(2);
            const tiltY = ((nextPosition.rx - .5) * 3.5).toFixed(2);
            surface.style.transform = `perspective(1100px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
          }
        });
      }, { passive: true });
      surface.addEventListener('pointerleave', () => {
        nextPosition = null;
        surface.style.removeProperty('--fx-x');
        surface.style.removeProperty('--fx-y');
        if (allowTilt) surface.style.transform = '';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Interactive ripple on real links/buttons, including touch and keyboard.
  // -------------------------------------------------------------------------
  if (!reduceMotion) {
    $$('.nav-cta, .pill-link, .small-outline, .round-arrow, .outro-cta').forEach(target => {
      target.addEventListener('pointerdown', event => {
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'fx-ripple';
        ripple.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
        ripple.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
        ripple.setAttribute('aria-hidden', 'true');
        target.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 6. Market selection content changes get a quick, readable transition.
  // -------------------------------------------------------------------------
  const showcase = $('#marketShowcase');
  if (showcase && !reduceMotion) {
    let swapTimer = null;
    $$('.market-option').forEach(button => {
      button.addEventListener('click', () => {
        showcase.classList.remove('market-swap');
        // Force a new animation on repeat selections.
        void showcase.offsetWidth;
        showcase.classList.add('market-swap');
        clearTimeout(swapTimer);
        swapTimer = setTimeout(() => showcase.classList.remove('market-swap'), 600);
      });
      if (finePointer) button.addEventListener('mouseenter', () => {
        showcase.classList.remove('market-swap');
        void showcase.offsetWidth;
        showcase.classList.add('market-swap');
        clearTimeout(swapTimer);
        swapTimer = setTimeout(() => showcase.classList.remove('market-swap'), 600);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Active navigation, floating back-to-top button and keyboard usability.
  // -------------------------------------------------------------------------
  const backTop = $('#backTop');
  let scrollQueued = false;
  const update = () => {
    scrollQueued = false;
    if (backTop) backTop.classList.toggle('visible', scrollY > 750);
  };
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();

  if (supportsObserver) {
    const navLinks = $$('.desktop-nav a, #mobileMenu a').filter(a => a.hash && a.hash !== '#top');
    const navSections = [...new Set(navLinks.map(a => a.hash))]
      .map(hash => document.getElementById(hash.substring(1))).filter(Boolean);
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -59% 0px', threshold: 0 });
    navSections.forEach(section => navObserver.observe(section));
  }

  // No auto-playing charts, fake live quotes or flashing effects are used.
})();


/* UPFOREX V3: small, independent motion upgrades, no external libraries. */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const $ = (q, root=document) => [...root.querySelectorAll(q)];

  // Ambient section light is decorative and never intercepts clicks.
  $('.intro, .markets, .principles, .accounts, .steps, .resources, .partnership, .faq-section, .outro').forEach(section => {
    const aura = document.createElement('div');
    aura.className = 'v3-ambient';
    aura.setAttribute('aria-hidden', 'true');
    section.prepend(aura);
  });

  // Small content elements enter in sequence after each large heading.
  const targets = $('.market-option, .principle, .step, .platform-side, .intro-right, .account-description, .showcase-text, .faq-items details');
  const groups = new Map();
  targets.forEach((element) => {
    const parent = element.parentElement;
    const count = groups.get(parent) || 0;
    groups.set(parent, count+1);
    element.classList.add('v3-reveal');
    element.style.setProperty('--v3-delay', `${Math.min(count,5)*60}ms`);
  });
  $('.intro-caption, .steps-list, .accounts-head, .platform-headline').forEach(element => element.classList.add('v3-drawline'));
  const lineEls = $('.v3-drawline');
  const allTargets = [...targets, ...lineEls];
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('v3-in');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.03, rootMargin:'0px 0px 70px 0px'});
    allTargets.forEach(element => obs.observe(element));
  } else {
    allTargets.forEach(el => el.classList.add('v3-in'));
  }

  // User input on a market choice immediately reveals its target content.
  $('.market-option').forEach(button => {
    button.addEventListener('pointerdown', () => button.classList.add('v3-in'), {passive:true});
    button.addEventListener('focus', () => button.classList.add('v3-in'));
  });

  // Smoother section background drift on fine-pointer devices only.
  if (!isTouch) {
    $('.hero, .platform-stage, .outro').forEach(section => {
      let raf = 0;
      section.addEventListener('pointermove', event => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const b = section.getBoundingClientRect();
          const x = ((event.clientX-b.left)/Math.max(1,b.width)*100).toFixed(1);
          const y = ((event.clientY-b.top)/Math.max(1,b.height)*100).toFixed(1);
          section.style.setProperty('--v3-glow-x', `${x}%`);
          section.style.setProperty('--v3-glow-y', `${y}%`);
        });
      }, {passive:true});
    });
  }
})();


/* UPFOREX Visual Sections / depth interaction. Keeps all existing interactions. */
(() => {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('[data-visual-scene]').forEach(scene => {
    let frame = 0;
    scene.addEventListener('pointermove', event => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = scene.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - .5;
        const y = (event.clientY - r.top) / r.height - .5;
        scene.style.setProperty('--visual-x', `${(x * 14).toFixed(1)}px`);
        scene.style.setProperty('--visual-y', `${(y * 14).toFixed(1)}px`);
      });
    }, {passive:true});
    scene.addEventListener('pointerleave', () => {
      scene.style.setProperty('--visual-x', '0px');
      scene.style.setProperty('--visual-y', '0px');
    }, {passive:true});
  });
})();
/* ==========================================================
   UPFOREX / CHOOSE YOUR WORLD — ROUNDED IMAGES ADD-ON
   Paste ONCE at the very end of js/main.js.
   Existing HTML and existing JS logic do not need replacement.
   ========================================================== */
(() => {
  'use strict';

  function setupRoundedMarkets() {
    const section = document.querySelector('.markets');
    const showcase = document.getElementById('marketShowcase');
    const art = showcase?.querySelector('.showcase-art');
    const buttons = [...(section?.querySelectorAll('.market-option') ?? [])];
    if (!section || !showcase || !art || buttons.length !== 6) return;
    if (showcase.querySelector('#showcaseImage')) return; // already installed

    const markets = [
      ['forex', 'Currency notes and glowing world markets'],
      ['stocks', 'Stock exchange and market price charts'],
      ['metals', 'Gold and silver bullion bars'],
      ['indices', 'Global market indices and rising chart columns'],
      ['energy', 'Oil pumpjack and offshore energy rig'],
      ['crypto', 'Digital currency coin and glowing circuitry']
    ];

    // Insert a small circular photo in each existing market button.
    buttons.forEach((button, index) => {
      if (button.querySelector('.market-thumb')) return;
      const name = button.querySelector('.market-name');
      if (!name) return;
      const thumb = document.createElement('span');
      thumb.className = 'market-thumb';
      thumb.setAttribute('aria-hidden', 'true');
      const img = document.createElement('img');
      img.src = `assets/market-${markets[index][0]}.png`;
      img.alt = '';
      img.width = 52;
      img.height = 52;
      img.loading = 'lazy';
      img.decoding = 'async';
      thumb.appendChild(img);
      name.before(thumb);
    });

    // The original #showcaseMark stays hidden so existing market JS keeps working.
    art.classList.add('spotlight-art');
    art.innerHTML = `
      <span id="showcaseMark" style="display:none" aria-hidden="true">FX</span>
      <span class="spotlight-orbit spotlight-orbit-a" aria-hidden="true"></span>
      <span class="spotlight-orbit spotlight-orbit-b" aria-hidden="true"></span>
      <div class="spotlight-photo-frame">
        <img id="showcaseImage" class="spotlight-photo"
             src="assets/market-forex.png" alt="Currency notes and glowing world markets"
             width="512" height="512" decoding="async">
        <span class="spotlight-photo-glint" aria-hidden="true"></span>
      </div>
      <span class="spotlight-photo-index" aria-hidden="true">UP <b>✳</b></span>`;

    const photo = document.getElementById('showcaseImage');
    const syncPhoto = () => {
      const selected = Number(showcase.dataset.market ?? 0);
      const data = markets[selected] ?? markets[0];
      const nextSrc = `assets/market-${data[0]}.png`;
      if (photo.getAttribute('src') !== nextSrc) {
        photo.src = nextSrc;
        photo.alt = data[1];
      }
    };
    // Original buttons already handle click, hover and keyboard changes.
    // Listen for their selected-market value instead of replacing their handlers.
    new MutationObserver(syncPhoto).observe(showcase, {
      attributes: true,
      attributeFilter: ['data-market']
    });
    syncPhoto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRoundedMarkets, { once: true });
  } else {
    setupRoundedMarkets();
  }
})();

/* UPFOREX - MT5 MOUSE PARALLAX */

(() => {
  const visual = document.querySelector(
    '.mt5-redesign__visual'
  );

  if (
    !visual ||
    !window.matchMedia(
      '(hover:hover) and (pointer:fine)'
    ).matches ||
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {
    return;
  }

  let raf = 0;

  visual.addEventListener(
    'pointermove',
    e => {
      const r = visual.getBoundingClientRect();

      const x =
        ((e.clientX - r.left) / r.width - .5) * 10;

      const y =
        ((e.clientY - r.top) / r.height - .5) * 7;

      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        visual.style.setProperty(
          '--mt5-px',
          `${x.toFixed(1)}px`
        );

        visual.style.setProperty(
          '--mt5-py',
          `${y.toFixed(1)}px`
        );
      });
    },
    { passive: true }
  );

  visual.addEventListener(
    'pointerleave',
    () => {
      cancelAnimationFrame(raf);

      visual.style.setProperty('--mt5-px', '0px');
      visual.style.setProperty('--mt5-py', '0px');
    }
  );
})();

