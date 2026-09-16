/* =================================================================
   JOINTWELL v5 — behaviour

   The design file's script, wired to Shopify. Written so that each
   block fails alone: a broken carousel must not take the buy button
   down with it, so every module runs inside its own guard.

   It is an asset rather than an inline block for the same reason the
   stylesheet is: large Liquid files have repeatedly failed to sync
   from GitHub on this store.

   Everything store-specific — prices, variant ids, photographs,
   reviews, the support number — arrives on window.JW, printed by
   sections/jointwell-landing.liquid. Nothing is hard-coded here.

   Both forms post natively. Neither the order nor the signup depends
   on this file loading at all; it only makes them nicer.
   ================================================================= */

/* =================================================================
   JOINTWELL — behaviour
   Written so that each block fails alone. A broken carousel must not
   take the buy button down with it, so every module runs inside its
   own guard.
   ================================================================= */
(function(){
'use strict';

/* Everything this file needs from Shopify arrives on window.JW, printed by
   sections/jointwell-landing.liquid. Nothing here reaches into Liquid, and
   nothing here states a price, a variant id or an image path of its own. */
var JW = window.JW || {};
var P  = JW.prices || {};

var docEl = document.documentElement;
var IS_MOCK = JW.env === 'mock';
/* The design file carried data-env on <html>. A section cannot write an
   attribute onto <html>, so the theme setting does it here instead. */
if (IS_MOCK) docEl.setAttribute('data-env', 'mock');

/* -----------------------------------------------------------------
   INTEGRATION POINTS — both are Shopify's own now, and both are real
   <form> posts rather than fetch calls.

     the order    posts to /cart/add with return_to=/checkout, so it
                  survives this file failing to load at all.
     the routine   posts to Shopify's own customer endpoint via
                  {% form 'customer' %}, which owns the redirect and
                  renders the success state back in Liquid.

   There is nothing left to configure here. The launch guard at the foot
   of this file checks what is actually wired rather than what is set.
   ----------------------------------------------------------------- */

/* Analytics. Replace the body with your Pixel or GA bridge; it is called
   at the only two moments on this page worth measuring. Left as a no-op
   so nothing fires until you have consent to fire it. */
function track(event, data){ void event; void data; }

function guard(name, fn){ try { fn(); } catch(err){ console.error('[Jointwell] ' + name + ' failed:', err); } }
function each(sel, fn){ Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
function el(id){ return document.getElementById(id); }

/* ---------- money: formatted once, in one place ---------- */
var fmt0, fmt2;
try {
  fmt0 = new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP', minimumFractionDigits:0, maximumFractionDigits:0});
  fmt2 = new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP', minimumFractionDigits:2, maximumFractionDigits:2});
} catch(e) {}
function money(n){
  if (n % 1 === 0) return fmt0 ? fmt0.format(n) : '\u00A3' + n;
  return fmt2 ? fmt2.format(n) : '\u00A3' + n.toFixed(2);
}

/* ---------- dispatch dates: computed, and computed in UK time ----------
   The cut-off is a fact about a warehouse in England, so it must not
   drift when the customer's laptop is set to another timezone. If Intl
   is unavailable the markup already carries the correct static wording,
   so failing quietly here is the right behaviour. */
guard('dispatch dates', function(){
  var wd = new Intl.DateTimeFormat('en-GB', {weekday:'long'});
  var p  = new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/London', year:'numeric', month:'2-digit',
             day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(new Date());
  var g = {}; p.forEach(function(x){ g[x.type] = x.value; });
  var now = new Date(+g.year, +g.month - 1, +g.day, +g.hour, +g.minute);

  var ship = new Date(now); ship.setDate(ship.getDate() + ((4 - ship.getDay() + 7) % 7 || 7));  /* 4 = Thursday */
  var close = new Date(ship); close.setDate(close.getDate() - 1);

  var cl = el('bb-close');
  if (cl) cl.textContent = wd.format(close) + ' at midnight';
  each('#bb-ship,.d-ship', function(e){ e.textContent = wd.format(ship); });
});

/* ---------- joint panels ---------- */
/* Theme assets, sized by Liquid. Each entry is {s: 1x, s2: 2x}. */
var PHOTOS = JW.photos || {};
function ph(k){ return PHOTOS[k] || {s:'', s2:''}; }
var PANELS={
  knee:{title:'Knee arthritis',img:ph('kettle'),
    fit:'Straight round the knee, over or under trousers. First thing, with the first cup.'},
  shoulder:{title:'Stiff shoulder',img:ph('armchair'),
    fit:'The extension strap in the box loops it over the shoulder and under the arm.'},
  elbow:{title:'Tennis elbow',img:ph('crossword-elbow'),
    fit:'The strap takes it up the forearm to the elbow. Before the garden, not after.'},
  both:{title:'More than one joint',img:ph('floor'),
    fit:'One wrap fits any of them. Two means neither joint waits its turn.'},
};

var JOINT_WORD={both:'more than one joint',shoulder:'a shoulder',elbow:'an elbow'};

/* The quiz's own state lives in its guard; nothing else reads it. */

/* ---------- price: one source of truth ----------
   Every price on the page is painted from these four values. Nothing
   states a price in the markup that repaint() does not own, so the
   quiz cannot upgrade the tier while a CTA elsewhere still says 49. */
var BOX = P.box;                       /* what one box is worth, in full */
var BRACE_VALUE = P.braceValue || {};  /* the same, for one brace and for two */

var base = P.single, qty = 1, sleeve = false, sleeveP = P.braceOne;

/* The two line items the order is made of. Both are Shopify variant ids,
   both are chosen by the controls below, and repaint() is the only thing
   that writes either of them into the form. */
var wrapVariant = P.variants && P.variants.single;
/* How many of that variant the line carries. It is 1 for every tile except
   a four-wrap tile with no four-pack variant behind it, which is the pair
   ordered twice. */
var wrapQty = '1';
function bracePack(){
  var b = document.querySelector('#sqty .size[aria-checked="true"]');
  return b ? (b.getAttribute('data-pack') || '1') : '1';
}
function braceVariant(){
  var size = selectedSize();
  if (!size) return '';
  return (JW.braceVariants || {})[size + '|' + bracePack()] || '';
}

/* A price that snaps has already changed before she notices. A price that
   rolls tells her the total she is looking at is the one she just caused.
   The value lives on the node, so a roll interrupted mid-flight resumes
   from where it actually is rather than from where it started. */
function setMoney(node, value){
  if (!node) return;

  /* Whatever else happens, stop anything already in flight on this node.
     Two loops fighting over the same textContent is how a price ends up
     showing a number that was never real. */
  if (node.__raf) { cancelAnimationFrame(node.__raf); node.__raf = 0; }
  if (node.__t) { clearTimeout(node.__t); node.__t = 0; }

  var from = (typeof node.__v === 'number') ? node.__v : value;
  node.__v = value;

  /* Do not animate what nobody is looking at, and never animate for a
     visitor who has asked us not to. */
  if (from === value || reducedMotion() || document.visibilityState === 'hidden') {
    node.textContent = money(value);
    return;
  }

  var t0 = performance.now(), span = value - from, DUR = 460;

  /* A price is not decoration. If frames stop arriving - a backgrounded
     tab, a throttled device, a long task - this lands the true value
     anyway rather than leaving her looking at a number mid-roll. */
  node.__t = setTimeout(function(){
    if (node.__raf) { cancelAnimationFrame(node.__raf); node.__raf = 0; }
    node.__t = 0;
    node.textContent = money(node.__v);
  }, DUR + 140);

  (function step(now){
    var p = Math.min(1, (now - t0) / DUR);
    var eased = 1 - Math.pow(1 - p, 3);            /* settle, do not bounce */
    node.textContent = money(Math.round(from + span * eased));
    if (p < 1) { node.__raf = requestAnimationFrame(step); }
    else {
      node.__raf = 0;
      if (node.__t) { clearTimeout(node.__t); node.__t = 0; }
      node.textContent = money(value);
    }
  })(t0);
}

/* Coming back to the tab must never reveal a half-rolled price. */
document.addEventListener('visibilitychange', function(){
  if (document.visibilityState !== 'visible') return;
  each('#pay,#cta-p,#s-price,#val,#bump-price,[data-price]', function(n){
    if (typeof n.__v === 'number') {
      if (n.__raf) { cancelAnimationFrame(n.__raf); n.__raf = 0; }
      if (n.__t) { clearTimeout(n.__t); n.__t = 0; }
      n.textContent = money(n.__v);
    }
  });
});
function reducedMotion(){ return window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches; }

/* ---------- swipe ----------
   A carousel with dots promises a gesture, and on a phone that promise is
   the first thing a thumb tries. Every listener here is passive and nothing
   calls preventDefault: the page keeps the vertical axis, and a drag that
   turns out to be a scroll is abandoned rather than fought for. The window
   carries touch-action:pan-y so the browser knows the same thing. */
function swipe(node, onLeft, onRight){
  if (!node) return;
  var x0 = 0, y0 = 0, live = false;
  node.addEventListener('touchstart', function(ev){
    live = ev.touches.length === 1;
    if (!live) return;
    x0 = ev.touches[0].clientX; y0 = ev.touches[0].clientY;
  }, {passive:true});
  node.addEventListener('touchmove', function(ev){
    if (!live) return;
    /* Once it is clearly a scroll it stays a scroll for the rest of the touch. */
    if (Math.abs(ev.touches[0].clientY - y0) > Math.abs(ev.touches[0].clientX - x0)) live = false;
  }, {passive:true});
  node.addEventListener('touchend', function(ev){
    if (!live) return;
    live = false;
    var t = ev.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    (dx < 0 ? onLeft : onRight)();
  }, {passive:true});
  /* An interrupted gesture leaves nothing behind. */
  node.addEventListener('touchcancel', function(){ live = false; }, {passive:true});
}

/* A small, brief acknowledgement that a control registered the tap. */
function confirmTap(node){
  if (!node || reducedMotion() || !node.animate) return;
  node.animate([{transform:'scale(1)'},{transform:'scale(1.014)'},{transform:'scale(1)'}],
    {duration:320, easing:'cubic-bezier(.22,1,.36,1)'});
}

function repaint(){
  var total = base + (sleeve ? sleeveP : 0);
  var valN = el('val-n');

  setMoney(el('pay'), total);
  setMoney(el('cta-p'), total);
  setMoney(el('s-price'), total);
  setMoney(el('val'), BOX * qty + (sleeve ? (BRACE_VALUE[bracePack()] || 0) : 0));
  setMoney(el('bump-price'), sleeveP);
  if (valN) valN.textContent = qty > 1 ? ' (' + qty + ' boxes)' : '';

  /* Secondary CTAs quote the wrap price, not the wrap-plus-brace total. */
  each('[data-price]', function(e){ setMoney(e, base); });

  /* Keep the form in step, so a submit made while this file is still
     loading posts the order the page is actually showing. The brace inputs
     are disabled rather than emptied: /cart/add rejects a line with no id,
     and a disabled input is never sent at all. */
  var fv = el('f-variant'), fq = el('f-qty'), fb = el('f-brace'), fbq = el('f-brace-qty');
  if (fv) fv.value = wrapVariant || '';
  if (fq) fq.value = wrapQty;
  var bv = sleeve ? braceVariant() : '';
  if (fb)  { fb.value = bv; fb.disabled = !bv; }
  if (fbq) { fbq.disabled = !bv; }
}
function selectedSize(){
  var b = document.querySelector('#sizes .size[aria-checked="true"]');
  return b ? (b.getAttribute('data-size') || '') : '';
}

/* ---------- quiz ----------
   Symptom first, joint second, and one button until she asks for it. The
   version this replaced led with "what have you already tried", which is a
   question about her shopping history asked before the page had told her
   anything. What she arrived with is how the joint feels. */
var SYMPTOM = {
  stiff: {
    badge: 'Yes. Stiffness is what warmth is for.',
    head: 'Stiffness, worst first thing',
    line: 'A joint that has not moved for eight hours is a cold joint, and half an hour of held warmth before the stairs is the whole point of this.'
  },
  ache: {
    badge: 'Yes, for as long as you wear it.',
    head: 'A deep ache that stays all day',
    line: 'Warmth eases an ache while it is on and for a while after. It will not end it, and we would rather say so now than after you have paid.'
  },
  both: {
    badge: 'Yes. Morning and evening.',
    head: 'Stiff first thing, aching later',
    line: 'The commonest answer on this page. One session before the stairs, one in the chair at night.'
  },
  flare: {
    badge: 'Yes between flares. No during one.',
    head: 'Flare-ups that come and go',
    line: 'A hot, red, swollen joint wants ice. Warmth is for the settled weeks in between, and for most people there are far more of those.'
  }
};


/* What the CTA at the foot of the result is offering to warm. */
var JOINT_TARGET = {knee:'that knee', shoulder:'that shoulder', elbow:'that elbow', both:'both joints'};

guard('quiz', function(){
  var result = el('result'), status = el('result-status');
  var go = el('quiz-go'), startWrap = el('quiz-start');
  var q1wrap = el('q1wrap'), q2wrap = el('q2wrap');
  if (!result || !go) return;

  var symptom = null;

  function show(node){ if (node) { node.hidden = false; } }

  function render(joint){
    var s = SYMPTOM[symptom] || SYMPTOM.stiff;
    var p = PANELS[joint] || PANELS.knee;
    var pair = (joint === 'both');
    var off = (P.was && P.was > P.single) ? (P.was - P.single) : 0;

    var label = pair ? 'Get two wraps for ' + money(P.pair)
                     : 'Get the wrap for ' + money(P.single);
    var sub   = pair ? 'One for each joint. Free tracked UK delivery.'
                     : (off ? money(off) + ' off today. Free tracked UK delivery.'
                            : 'Free tracked UK delivery.');

    var HTML =
      '<div class="res-grid">' +
        '<img src="' + p.img.s + '" srcset="' + p.img.s + ' 1x, ' + p.img.s2 + ' 2x" alt="" loading="lazy" decoding="async" style="view-transition-name:quiz-photo">' +
        '<div class="res-body" style="view-transition-name:quiz-copy">' +
          '<p class="res-verdict">' + s.badge + '</p>' +
          '<h3>' + s.head + ', in ' + (JOINT_WORD[joint] || 'a knee') + '</h3>' +
          '<p>' + s.line + '</p>' +
          '<p class="res-fit">' + p.fit + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="res-cta">' +
        '<a class="btn btn-auto" href="#offer">' + label + '<small>' + sub + '</small></a>' +
      '</div>';

    function paint(){
      result.innerHTML = HTML;
      result.classList.add('on');
      var body = result.querySelector('.res-body');
      if (body && !reducedMotion()) {
        body.classList.add('stagger');
        Array.prototype.forEach.call(body.children, function(row, i){
          row.style.animationDelay = (90 + i * 55) + 'ms';
        });
      }
      /* startViewTransition defers this, so repaint the freshly injected
         price or the result CTA ships a stale one. */
      repaint();
    }
    if (document.startViewTransition && !reducedMotion()) document.startViewTransition(paint);
    else paint();

    /* A region, not a live region: announcing the whole panel on every tap is
       worse than announcing nothing. One sentence goes to the status line. */
    if (status) status.textContent = 'Your answer is below. ' + s.head + ', in ' + (JOINT_WORD[joint] || 'a knee') + '.';

    /* Auto-select the pair only where more than one joint was named. */
    if (joint === 'both') {
      var t2 = document.querySelector('#tiers .tier[data-n="2"]');
      if (t2 && !t2.classList.contains('sel')) t2.click();
    }
    repaint();
    track('QuizComplete', {symptom: symptom, joint: joint});
  }

  go.addEventListener('click', function(){
    if (startWrap) startWrap.hidden = true;
    show(q1wrap);
    var first = document.querySelector('#q1 .opt');
    if (first) first.focus();
  });

  each('#q1 .opt', function(b){
    b.addEventListener('click', function(){
      each('#q1 .opt', function(x){ x.setAttribute('aria-pressed','false'); });
      b.setAttribute('aria-pressed','true');
      symptom = b.getAttribute('data-s');
      show(q2wrap);
      var first = document.querySelector('#q2 .opt');
      if (first) first.focus();
    });
  });

  each('#q2 .opt', function(b){
    b.addEventListener('click', function(){
      each('#q2 .opt', function(x){ x.setAttribute('aria-pressed','false'); });
      b.setAttribute('aria-pressed','true');
      render(b.getAttribute('data-j'));
    });
  });
});

/* ---------- radio groups: arrow keys and a single tab stop ----------
   role="radio" promises the visitor that arrows move between options
   and that the group is one tab stop. Three groups on this page made
   that promise and none of them kept it. */
function enhanceRadioGroup(sel){
  var group = document.querySelector(sel);
  if (!group) return;
  function items(){ return Array.prototype.slice.call(group.querySelectorAll('[role="radio"]')); }
  function roving(){
    var list = items();
    var checked = list.filter(function(x){ return x.getAttribute('aria-checked') === 'true'; })[0] || list[0];
    list.forEach(function(x){ x.tabIndex = (x === checked) ? 0 : -1; });
  }
  group.addEventListener('keydown', function(ev){
    var list = items(), i = list.indexOf(document.activeElement), n;
    if (i < 0) return;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown')     n = (i + 1) % list.length;
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp')   n = (i - 1 + list.length) % list.length;
    else if (ev.key === 'Home')                                n = 0;
    else if (ev.key === 'End')                                 n = list.length - 1;
    else return;
    ev.preventDefault();
    list[n].focus();
    list[n].click();
  });
  group.addEventListener('click', roving);
  roving();
}

/* ---------- offer controls ---------- */
guard('offer controls', function(){
  each('#tiers .tier', function(t){
    t.addEventListener('click', function(){
      each('#tiers .tier', function(x){ x.classList.remove('sel'); x.setAttribute('aria-checked','false'); });
      t.classList.add('sel'); t.setAttribute('aria-checked','true');
      confirmTap(t);
      /* parseFloat, not parseInt: a tier may land on pence. */
      base = parseFloat(t.getAttribute('data-p'));
      qty  = parseInt(t.getAttribute('data-n'), 10);
      wrapVariant = t.getAttribute('data-variant');
      wrapQty     = t.getAttribute('data-q') || '1';
      repaint();
    });
  });

  var cb = el('bump-cb'), bumpEl = el('bump');
  if (cb) cb.addEventListener('change', function(){
    sleeve = cb.checked;
    bumpEl.classList.toggle('on', sleeve);
    if (sleeve) confirmTap(bumpEl);
    /* Default to the commonest size so ticking the box doesn't create a second
       decision. She can change it, but she doesn't have to. */
    if (sleeve && !document.querySelector('#sizes [aria-checked="true"]')) {
      var first = document.querySelector('#sizes .size');
      if (first) first.click();
    }
    repaint();
  });

  function radioRow(sel, after){
    each(sel + ' .size', function(b){
      b.addEventListener('click', function(){
        each(sel + ' .size', function(x){ x.setAttribute('aria-checked','false'); });
        b.setAttribute('aria-checked','true');
        confirmTap(b);
        if (after) after(b);
        repaint();
      });
    });
  }
  radioRow('#sizes');
  radioRow('#sqty', function(b){ sleeveP = parseFloat(b.getAttribute('data-sp')); });

  enhanceRadioGroup('#tiers');
  enhanceRadioGroup('#sizes');
  enhanceRadioGroup('#sqty');
  repaint();
});

/* ---------- offline ----------
   Both forms post natively now, so there is no fetch left to time out.
   The one thing worth catching before the browser does is a visitor who
   is plainly offline, because the browser's own error page is the worst
   place for her to find that out. */
function isOffline(){ return typeof navigator !== 'undefined' && navigator.onLine === false; }

/* Where to send someone a form could not help. Falls back to the email
   address when no support number is set in the theme editor. */
function helpSuffix(){
  if (JW.phone)  return ', or ring ' + JW.phone + ' and we will take it over the phone';
  if (JW.email)  return ', or email ' + JW.email + ' and we will do it by hand';
  return '';
}

function notice(node, text, kind){
  if (!node) return;
  node.textContent = text || '';
  node.hidden = !text;
  node.className = 'field-msg' + (kind ? ' is-' + kind : '');
}

/* ---------- buy ---------- */
guard('buy form', function(){
  var form = el('buy-form'), btn = el('buy'), note = el('buy-note');
  if (!form || !btn) return;
  var label = btn.querySelector('.buy-label');
  var busy = false;

  form.addEventListener('submit', function(ev){
    if (busy) { ev.preventDefault(); return; }          /* ten rapid clicks, one order */

    /* The brace needs a size. Catch it here rather than at the checkout. */
    if (sleeve && !selectedSize()) {
      ev.preventDefault();
      notice(note, 'Choose a size for the compression brace and we will add it to the order.', 'error');
      var sz = document.querySelector('#sizes .size');
      if (sz) sz.focus();
      return;
    }

    /* No variant behind the selected tier means the product picker in the
       theme editor is pointing at nothing. Posting that to /cart/add gets
       her a Shopify error page; saying so here does not. */
    if (!wrapVariant) {
      ev.preventDefault();
      notice(note, 'We could not open the checkout just then. Refresh the page and try again' + helpSuffix() + '.', 'error');
      return;
    }

    if (isOffline()) {
      ev.preventDefault();
      notice(note, 'You look to be offline. Reconnect and press the button again \u2014 nothing was lost.', 'error');
      return;
    }

    /* From here the browser posts the form to /cart/add itself. There is
       deliberately no preventDefault and no fetch: the native submit IS
       the checkout, so an order does not depend on this file at all. */
    busy = true;
    btn.disabled = true;
    btn.setAttribute('aria-busy','true');
    if (label) label.textContent = 'Taking you to checkout\u2026';
    notice(note, '', null);

    track('InitiateCheckout', {value:base+(sleeve?sleeveP:0), currency:'GBP'});
  });
});

/* ---------- routine signup ---------- */
guard('email form', function(){
  var form = el('email-form'), input = el('email-input'), btn = el('email-btn'), msg = el('email-msg');
  if (!form || !input || !btn) return;
  var busy = false;

  /* The form posts natively, so refusing it means stopping the submit as
     well as saying why. One function does both, or the browser cheerfully
     posts the address we just told her was wrong. */
  function fail(ev, text){
    ev.preventDefault();
    notice(msg, text, 'error');
    input.setAttribute('aria-invalid','true');
    input.focus();
  }

  form.addEventListener('submit', function(ev){
    if (busy) { ev.preventDefault(); return; }

    var v = input.value.trim();
    if (!v) return fail(ev, 'Pop your email address in and we will send the routine straight over.');
    if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
      return fail(ev, 'That does not look like an email address. Check for a missing @, or a typo in the bit after it.');
    if (isOffline()) return fail(ev, 'You look to be offline. Reconnect and press Send it again \u2014 nothing was lost.');

    busy = true;
    btn.disabled = true;
    form.setAttribute('aria-busy','true');
    btn.textContent = 'Sending\u2026';
    notice(msg, '', null);
    input.setAttribute('aria-invalid','false');

    /* Shopify owns the rest. The form posts natively to its customer
       endpoint, comes back to this page with ?customer_posted=true, and
       the section renders the confirmation in Liquid. */
  });

  input.addEventListener('input', function(){
    if (input.getAttribute('aria-invalid') === 'true') {
      input.setAttribute('aria-invalid','false');
      notice(msg, '', null);
    }
  });
});

/* ---------- hero review carousel ---------- */
guard('carousel', function(){
  /* The reviews and their portraits come from the theme editor, so a new
     one is added without touching this file. Each img is {s,s2,s3}. */
  var R = JW.reviews || [];
  var rcar = el('rcar'), win = el('rcar-win'), dots = el('rcar-dots');
  if (!win || !rcar) return;
  var i = 0, timer = null, slides = [], btns = [];

  /* Slide one is already in the markup. Adopt it rather than rebuild it,
     so there is never a frame where the box is empty. */
  var existing = win.querySelector('.rcar-slide');
  if (existing) slides.push(existing);

  R.forEach(function(r, k){
    if (!(k === 0 && existing)) {
      var d = document.createElement('div');
      d.className = 'rcar-slide' + (k === 0 ? ' on' : '');
      /* Same fallback the markup uses: an initial beats a broken picture. */
      var face = r.img && r.img.s
        ? '<img src="' + r.img.s + '" srcset="' + r.img.s + ' 1x, ' + r.img.s2 + ' 2x, ' + r.img.s3 + ' 3x" alt="" loading="lazy" decoding="async" width="62" height="62">'
        : '<span class="rcar-initial" aria-hidden="true">' + (r.n || '?').charAt(0).toUpperCase() + '</span>';
      d.innerHTML = face +
        '<div><p class="rcar-q">' + r.q + '</p><div class="rcar-foot">' +
        '<span class="rcar-who">' + r.n + '</span>' +
        '<span class="rcar-badge" role="img" aria-label="Verified buyer">\u2713</span>' +
        '<span class="stars" role="img" aria-label="Rated ' + r.s + ' out of 5">' +
          '\u2605'.repeat(r.s) + '</span></div></div>';
      win.appendChild(d); slides.push(d);
    }
    var b = document.createElement('button');
    b.type = 'button'; b.className = (k === 0 ? 'on' : '');
    b.setAttribute('aria-label', 'Show review ' + (k + 1) + ' of ' + R.length + ' and stop the slideshow');
    b.addEventListener('click', function(){ go(k); stop(); });
    dots.appendChild(b); btns.push(b);
  });

  function go(k){
    i = k;
    slides.forEach(function(sl, n){ sl.classList.toggle('on', n === k); });
    btns.forEach(function(b, n){ b.classList.toggle('on', n === k); });
  }
  function start(){ if (!timer && !reduced()) timer = setInterval(function(){ go((i + 1) % slides.length); }, 5200); }
  function stop(){ clearInterval(timer); timer = null; }
  function reduced(){ return window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches; }

  swipe(rcar,
    function(){ go((i + 1) % slides.length); stop(); },
    function(){ go((i - 1 + slides.length) % slides.length); stop(); });

  /* Stop for a mouse, for a keyboard, and for a tab nobody is looking at. */
  rcar.addEventListener('mouseenter', stop);
  rcar.addEventListener('mouseleave', start);
  rcar.addEventListener('focusin',  stop);
  rcar.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : start(); });
  start();
});

/* ---------- the product shots in the buy box ----------
   Deliberately manual. See the note on .shots in the stylesheet. */
guard('product shots', function(){
  var wrap = el('shots'), win = el('shots-win'), dots = el('shots-dots');
  if (!wrap || !win || !dots) return;
  var slides = Array.prototype.slice.call(win.querySelectorAll('.shot'));
  var btns = Array.prototype.slice.call(dots.querySelectorAll('button'));
  if (slides.length < 2 || btns.length !== slides.length) return;
  var i = 0;

  function go(k){
    i = (k + slides.length) % slides.length;
    slides.forEach(function(s, n){ s.classList.toggle('on', n === i); });
    btns.forEach(function(b, n){
      b.classList.toggle('on', n === i);
      b.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
  }
  btns.forEach(function(b, k){ b.addEventListener('click', function(){ go(k); }); });
  swipe(wrap, function(){ go(i + 1); }, function(){ go(i - 1); });

  /* Arrow keys once a dot has focus, the same promise the review dots make. */
  dots.addEventListener('keydown', function(ev){
    var n;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') n = i + 1;
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') n = i - 1;
    else return;
    ev.preventDefault();
    go(n);
    btns[i].focus();
  });
  go(0);
});

/* ---------- sticky ---------- */
guard('sticky bar', function(){
  var bar = el('sticky'), hero = document.querySelector('.hero');
  if (!bar || !hero) return;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(e){ bar.classList.toggle('on', !e[0].isIntersecting); }, {threshold:0}).observe(hero);
  } else {
    bar.classList.add('on');
  }
});

/* ---------- launch guard ----------
   Everything the mock could only promise is now either wired or it is not.
   This says which, in the console, once, on the live page only. */
guard('launch guard', function(){
  if (IS_MOCK) return;
  var problems = [];

  var form = el('buy-form');
  if (!form || !form.getAttribute('action')) problems.push('The buy form has no action \u2014 the order has nowhere to post.');
  if (!(P.variants && P.variants.single)) problems.push('No wrap variant resolved \u2014 pick the product in Theme editor \u2192 Jointwell landing \u2192 Product.');
  if (!Object.keys(JW.braceVariants || {}).length) problems.push('No compression brace variants resolved \u2014 the order bump will not add a second line item. Check the product handle in the section.');

  var mock = document.querySelectorAll('[data-mock]').length;
  if (mock) problems.push(mock + ' [data-mock] element(s) still in the markup \u2014 placeholders are hidden, not resolved. Supply the photographs and delete them.');
  if (!JW.phone) problems.push('No support telephone number set \u2014 the header and footer fall back to the email address. Set one in the theme editor.');
  if (!JW.companyNumber) problems.push('Footer: registered company number and address are unset (required by Companies Act 2006 s.82).');
  if (String(track).indexOf('void event') > -1 && document.querySelector('[data-consent]') === null) problems.push('track() is a no-op and there is no consent mechanism. If you wire the Pixel, a UK visitor needs to opt in before it fires (PECR / UK GDPR).');

  if (problems.length) console.error('[Jointwell] Not ready to ship:\n  \u2022 ' + problems.join('\n  \u2022 '));
});

})();
