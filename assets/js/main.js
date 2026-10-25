/* Cuzen General Supply — site behaviour. Vanilla JS, no dependencies. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const WA = '255773652494';
  const MAIL = 'Cuzengeneralsupply@gmail.com';

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  function toast(msg) {
    if (!toastEl) return;
    $('span', toastEl).textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  }

  /* ---------- header, menu, year ---------- */
  $$('[data-year]').forEach(n => (n.textContent = new Date().getFullYear()));
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  const menuBtn = $('.menu-btn');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- scroll reveal ---------- */
  const revealEls = $$('.reveal, .steps');
  const showAll = () => revealEls.forEach(el => el.classList.add('is-in'));
  if ('IntersectionObserver' in window && !reduce && !location.search.includes('reveal-all')) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
    // safety net: if the observer never reports anything, do not leave content hidden
    setTimeout(() => { if (!revealEls.some(el => el.classList.contains('is-in'))) showAll(); }, 2000);
  } else showAll();

  /* ---------- cursor spotlight on glass cards ---------- */
  if (canHover && !reduce) {
    let raf = 0;
    document.addEventListener('pointermove', e => {
      const t = e.target.closest && e.target.closest('.spot');
      if (!t || raf) return;
      raf = requestAnimationFrame(() => {
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', e.clientX - r.left + 'px');
        t.style.setProperty('--my', e.clientY - r.top + 'px');
        raf = 0;
      });
    }, { passive: true });
  }

  /* ---------- hero division switcher ---------- */
  const hero = $('.hero[data-hero]');
  if (hero) {
    const tabs = $$('.htab', hero), slides = $$('.slide', hero);
    const capT = $('[data-cap-title]', hero), capD = $('[data-cap-desc]', hero), capL = $('[data-cap-link]', hero);
    let cur = 0;
    const go = i => {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === cur)); t.tabIndex = n === cur ? 0 : -1; });
      slides.forEach((s, n) => s.classList.toggle('is-active', n === cur));
      const d = tabs[cur].dataset;
      capT.textContent = d.title; capD.textContent = d.desc; capL.setAttribute('href', d.href);
    };
    tabs.forEach((t, n) => {
      t.addEventListener('click', () => go(n));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { go(cur + 1); tabs[cur].focus(); }
        if (e.key === 'ArrowLeft') { go(cur - 1); tabs[cur].focus(); }
      });
    });
    if (!reduce) {
      hero.addEventListener('animationend', e => { if (e.animationName === 'tabfill') go(cur + 1); });
      const pause = on => hero.classList.toggle('is-paused', on);
      ['mouseenter', 'focusin'].forEach(ev => $('.hero-grid', hero).addEventListener(ev, () => pause(true)));
      ['mouseleave', 'focusout'].forEach(ev => $('.hero-grid', hero).addEventListener(ev, () => pause(false)));
    }
    go(0);
    // subtle tilt on the glass viewer
    const v = $('.viewer', hero);
    if (v && canHover && !reduce) {
      let raf = 0;
      v.addEventListener('pointermove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = v.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          v.style.transform = `perspective(1000px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg)`;
          raf = 0;
        });
      });
      v.addEventListener('pointerleave', () => (v.style.transform = ''));
    }
  }

  /* ---------- tabs (who we serve) ---------- */
  $$('[data-tabs]').forEach(root => {
    const tabs = $$('[role="tab"]', root), panels = $$('[role="tabpanel"]', root);
    const show = i => {
      tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
      panels.forEach((p, n) => {
        p.hidden = n !== i;
        p.classList.remove('is-in');
        if (n === i) { void p.offsetWidth; p.classList.add('is-in'); }
      });
    };
    tabs.forEach((t, n) => t.addEventListener('click', () => show(n)));
    show(0);
  });

  /* ---------- accordion ---------- */
  $$('.acc-item').forEach(item => {
    const btn = $('.acc-q', item);
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- product filters ---------- */
  const chips = $$('.chip[data-filter]');
  if (chips.length) {
    const groups = $$('.pgroup[data-cat]');
    const apply = f => {
      chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === f)));
      groups.forEach(g => {
        const show = f === 'all' || g.dataset.cat === f;
        g.classList.toggle('is-out', !show);
        if (show) { g.classList.remove('is-in-anim'); void g.offsetWidth; g.classList.add('is-in-anim'); }
      });
    };
    chips.forEach(c => c.addEventListener('click', () => apply(c.dataset.filter)));
    const h = location.hash.replace('#', '');
    if (h && groups.some(g => g.id === h)) apply('all');
  }

  /* ---------- copy to clipboard ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    e.preventDefault();
    const val = b.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(val) : Promise.reject()).then(
      () => toast('Copied: ' + val), () => toast('Copy not available. Select the text instead.'));
  });

  /* ---------- quote list (saved in the browser) ---------- */
  const KEY = 'cuzen_quote_v1';
  let list = [];
  try { list = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (_) { list = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (_) {} };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const drawer = $('#drawer'), qitems = $('#qitems');
  const listText = () => list.map(i => `- ${i.name} (x${i.qty})`).join('\n');
  const quoteMsg = () => list.length
    ? 'Hello Cuzen General Supply, I would like a quotation for:\n' + listText()
    : 'Hello Cuzen General Supply, I would like a quotation.';

  function render(bump) {
    $$('[data-qcount]').forEach(el => {
      el.textContent = list.length; el.dataset.n = list.length;
      if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    $$('.add').forEach(b => {
      const on = list.some(i => i.id === b.dataset.id);
      b.classList.toggle('is-added', on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + b.dataset.name + (on ? ' from' : ' to') + ' your quote list');
    });
    qitems.innerHTML = list.length
      ? list.map(i => `<div class="qitem"><div><b>${esc(i.name)}</b><small>${esc(i.cat)}</small></div>
          <div class="qty"><button type="button" data-q="dec" data-id="${esc(i.id)}" aria-label="Decrease quantity">&minus;</button><output>${i.qty}</output><button type="button" data-q="inc" data-id="${esc(i.id)}" aria-label="Increase quantity">+</button></div></div>`).join('')
      : `<div class="qempty"><svg class="ic" viewBox="0 0 24 24"><use href="#i-list"/></svg><p>Your list is empty. Open the products page and press + beside anything you need.</p><a class="link" href="/products">Browse products</a></div>`;
    const wa = $('#q-wa'), ml = $('#q-mail'), clr = $('#q-clear');
    if (wa) wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(quoteMsg())}`;
    if (ml) ml.href = `mailto:${MAIL}?subject=${encodeURIComponent('Quotation request')}&body=${encodeURIComponent(quoteMsg())}`;
    if (clr) clr.hidden = !list.length;
    const pv = $('[data-qpreview]');
    if (pv) { pv.hidden = !list.length; const t = $('.pv-list', pv); if (t) t.textContent = list.map(i => `${i.name} (x${i.qty})`).join(', '); }
  }

  let opener = null;
  const openQuote = () => {
    opener = document.activeElement;
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.x', drawer).focus(), 60);
  };
  const closeQuote = () => {
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = document.body.classList.contains('menu-open') ? 'hidden' : '';
    if (opener) opener.focus();
  };
  document.addEventListener('click', e => {
    const add = e.target.closest('.add');
    if (add) {
      const { id, name, cat } = add.dataset;
      const at = list.findIndex(i => i.id === id);
      if (at > -1) { list.splice(at, 1); toast('Removed from your quote list'); }
      else { list.push({ id, name, cat, qty: 1 }); toast('Added to your quote list'); }
      save(); render(at === -1); return;
    }
    const q = e.target.closest('[data-q]');
    if (q) {
      const it = list.find(i => i.id === q.dataset.id);
      if (it) { it.qty += q.dataset.q === 'inc' ? 1 : -1; if (it.qty < 1) list = list.filter(i => i !== it); save(); render(); }
      return;
    }
    if (e.target.closest('[data-open-quote]')) { openQuote(); return; }
    if (e.target.closest('[data-close-quote]')) { closeQuote(); return; }
    if (e.target.closest('#q-clear')) { list = []; save(); render(); toast('Quote list cleared'); }
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (drawer.classList.contains('is-open')) closeQuote(); else setMenu(false); }
  });
  addEventListener('storage', e => { if (e.key === KEY) { try { list = JSON.parse(e.newValue || '[]'); } catch (_) {} render(); } });
  render();

  /* ---------- contact / quote form → WhatsApp or email ---------- */
  const form = $('[data-quote-form]');
  if (form) {
    const val = n => (form.elements[n] && form.elements[n].value || '').trim();
    const checked = n => $$(`input[name="${n}"]:checked`, form).map(i => i.value);
    const compose = () => {
      const parts = ['Hello Cuzen General Supply,'];
      parts.push(`My name is ${val('name')}${val('org') ? ' from ' + val('org') : ''}.`);
      if (checked('type').length) parts.push(`We are a ${checked('type')[0].toLowerCase()}.`);
      if (checked('interest').length) parts.push(`We are interested in: ${checked('interest').join(', ')}.`);
      if (val('message')) parts.push('Details: ' + val('message'));
      if (list.length) parts.push('Items from our quote list:\n' + listText());
      const reach = [val('phone') && 'Phone: ' + val('phone'), val('email') && 'Email: ' + val('email')].filter(Boolean);
      if (reach.length) parts.push(reach.join('  |  '));
      return parts.join('\n');
    };
    $$('[data-send]', form).forEach(btn => btn.addEventListener('click', () => {
      if (!val('name')) { toast('Please add your name'); form.elements.name.focus(); return; }
      if (!val('phone') && !val('email')) { toast('Add a phone number or email so we can reply'); form.elements.phone.focus(); return; }
      const m = compose();
      if (btn.dataset.send === 'wa') window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`, '_blank', 'noopener');
      else location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Quotation request from ' + val('name'))}&body=${encodeURIComponent(m)}`;
      toast('Message ready to send');
    }));
  }
})();
