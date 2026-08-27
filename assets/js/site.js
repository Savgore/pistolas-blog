/* ==========================================================================
   pistolas.co.uk

   Four things, none of them required for the page to work:
     1. the header painting resolves into its own colours as characters,
        inside a disc that drags a trail behind the pointer
     2. a spark on click
     3. index views, most recent, or by topic
     4. keyboard navigation and a filter over the index
     5. the contact form submits without a page change

   Everything here is progressive enhancement. With the script blocked the
   page keeps its painting, both index views, every link, and a contact
   form that posts normally and lands on Formspree's own confirmation.
   ========================================================================== */

(() => {
  'use strict';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ------------------------------------------------------------------------
     1. The header painting, read back as characters
     ------------------------------------------------------------------------ */
  const img = document.getElementById('painting');
  const cv = document.getElementById('painting-canvas');
  const plate = cv && cv.closest('.plate');

  if (img && cv && plate && canHover) {
    const RAMP = ' ·:+01X#';
    const CW = 6, CH = 9, R = 72;
    const TRAIL = 44, LIFE = 1150;
    const ctx = cv.getContext('2d');

    let cols = 0, rows = 0, cells = null, str = null, W = 0, H = 0;
    let px = -1e4, py = -1e4, hover = 0, want = 0, raf = 0;
    let trail = [];

    const clamp255 = v => (v < 0 ? 0 : v > 255 ? 255 : v | 0);
    const smooth = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

    const sample = () => {
      const r = img.getBoundingClientRect();
      if (!r.width || !img.naturalWidth) return false;

      W = Math.round(r.width);
      H = Math.round(r.height);
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(W / CW);
      rows = Math.ceil(H / CH);

      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.drawImage(img, 0, 0, cols, rows);

      let data;
      try {
        data = octx.getImageData(0, 0, cols, rows).data;
      } catch (e) {
        /* cross-origin image, leave the painting alone */
        return false;
      }

      cells = new Array(cols * rows);
      str = new Float32Array(cols * rows);

      for (let i = 0; i < cols * rows; i++) {
        const r8 = data[i * 4], g8 = data[i * 4 + 1], b8 = data[i * 4 + 2];
        const lum = (0.299 * r8 + 0.587 * g8 + 0.114 * b8) / 255;
        const lvl = Math.min(RAMP.length - 1, Math.round((1 - lum) * (RAMP.length - 1)));

        /* keep the hue, take the contrast whichever way the paint allows:
           dark paint gets a lifted glyph, light paint gets a sunk one */
        const bgK = lum > 0.5 ? 1.10 : 0.46;
        const fgK = lum > 0.5 ? 0.34 : 1.90;
        const fgAdd = lum > 0.5 ? 0 : 54;

        cells[i] = {
          bg: 'rgb(' + clamp255(r8 * bgK) + ',' + clamp255(g8 * bgK) + ',' + clamp255(b8 * bgK) + ')',
          fg: 'rgb(' + clamp255(r8 * fgK + fgAdd) + ',' + clamp255(g8 * fgK + fgAdd) + ',' + clamp255(b8 * fgK + fgAdd) + ')',
          lvl: lvl,
          ch: RAMP[lvl]
        };
      }
      return true;
    };

    const render = now => {
      ctx.clearRect(0, 0, W, H);
      if (!cells || hover < 0.002) return;

      /* the live head, plus every position still fading behind it */
      const pts = [];
      for (const p of trail) {
        const a = 1 - (now - p.born) / LIFE;
        if (a > 0) pts.push({ x: p.x, y: p.y, amp: hover * Math.pow(a, 0.75) * 0.92 });
      }
      pts.push({ x: px, y: py, amp: hover });

      let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
      for (const p of pts) {
        bx0 = Math.min(bx0, p.x - R); bx1 = Math.max(bx1, p.x + R);
        by0 = Math.min(by0, p.y - R); by1 = Math.max(by1, p.y + R);
      }
      const x0 = Math.max(0, (bx0 / CW) | 0), x1 = Math.min(cols, (bx1 / CW | 0) + 1);
      const y0 = Math.max(0, (by0 / CH) | 0), y1 = Math.min(rows, (by1 / CH | 0) + 1);

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) str[y * cols + x] = 0;
      }

      for (const p of pts) {
        const ax0 = Math.max(x0, ((p.x - R) / CW) | 0), ax1 = Math.min(x1, ((p.x + R) / CW | 0) + 1);
        const ay0 = Math.max(y0, ((p.y - R) / CH) | 0), ay1 = Math.min(y1, ((p.y + R) / CH | 0) + 1);
        for (let y = ay0; y < ay1; y++) {
          for (let x = ax0; x < ax1; x++) {
            const d = Math.hypot(x * CW + CW / 2 - p.x, y * CH + CH / 2 - p.y);
            if (d > R) continue;
            const s = p.amp * smooth(Math.min(1, (1 - d / R) * 2.2));
            const i = y * cols + x;
            if (s > str[i]) str[i] = s;
          }
        }
      }

      ctx.font = '600 ' + (CH - 1) + 'px ' + cssVar('--code');
      ctx.textBaseline = 'top';

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * cols + x;
          const s = str[i];
          if (s < 0.03) continue;
          const c = cells[i];
          ctx.globalAlpha = s;
          ctx.fillStyle = c.bg;
          ctx.fillRect(x * CW, y * CH, CW + 0.5, CH + 0.5);
          if (c.ch === ' ') continue;
          ctx.globalAlpha = Math.min(1, s * 1.25);
          ctx.fillStyle = c.fg;
          ctx.fillText(c.ch, x * CW, y * CH);
        }
      }
      ctx.globalAlpha = 1;
    };

    /* a share of characters re-roll each frame, the fluctuation */
    const churn = () => {
      for (let k = 0; k < 200; k++) {
        const c = cells[(Math.random() * cells.length) | 0];
        const drift = c.lvl + ((Math.random() * 3 | 0) - 1);
        c.ch = RAMP[Math.max(0, Math.min(RAMP.length - 1, drift))];
      }
    };

    const frame = now => {
      /* fades in briskly, lets go slowly, leaving the band should settle,
         not snap */
      hover += (want - hover) * (want ? 0.18 : 0.045);
      while (trail.length && now - trail[0].born > LIFE) trail.shift();
      if (!reduce && cells) churn();
      render(now);
      if (hover > 0.002 || want > 0 || trail.length) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        hover = 0;
        ctx.clearRect(0, 0, W, H);
      }
    };

    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    plate.addEventListener('pointermove', e => {
      if (!cells) return;
      const r = cv.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (Math.hypot(nx - px, ny - py) > 4) {
        trail.push({ x: px, y: py, born: performance.now() });
        if (trail.length > TRAIL) trail.shift();
      }
      px = nx;
      py = ny;
      want = 1;
      wake();
    });

    plate.addEventListener('pointerleave', () => {
      /* hand the head to the trail so the whole shape drains together */
      if (cells) {
        trail.push({ x: px, y: py, born: performance.now() });
        if (trail.length > TRAIL) trail.shift();
      }
      want = 0;
      wake();
    });

    const startPainting = () => {
      sample();
      want = 0;
      hover = 0;
      trail = [];
      ctx.clearRect(0, 0, W, H);
    };

    img.addEventListener('load', startPainting);
    if (img.complete && img.naturalWidth) startPainting();

    let rt;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(startPainting, 150);
    });
  }

  /* ------------------------------------------------------------------------
     2. A spark on click
     ------------------------------------------------------------------------ */
  const sc = document.getElementById('spark');
  if (sc && !reduce) {
    const ctx = sc.getContext('2d');
    let sparks = [];

    const fit = () => {
      const d = devicePixelRatio || 1;
      sc.width = Math.round(innerWidth * d);
      sc.height = Math.round(innerHeight * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    fit();
    addEventListener('resize', fit);

    const DUR = 380, RAD = 16, LEN = 9;

    const draw = now => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.strokeStyle = cssVar('--ink') || '#000';
      ctx.lineWidth = 1;
      sparks = sparks.filter(s => now - s.t < DUR);
      for (const s of sparks) {
        const e = 1 - Math.pow(1 - (now - s.t) / DUR, 3);
        const d = RAD * e, l = LEN * (1 - e);
        ctx.globalAlpha = 1 - e;
        ctx.beginPath();
        ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d);
        ctx.lineTo(s.x + Math.cos(s.a) * (d + l), s.y + Math.sin(s.a) * (d + l));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (sparks.length) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };

    addEventListener('click', e => {
      const t = performance.now();
      for (let i = 0; i < 8; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, a: (Math.PI * 2 * i) / 8, t });
      }
      if (sparks.length === 8) requestAnimationFrame(draw);
    });
  }

  /* ------------------------------------------------------------------------
     3. Index views
     ------------------------------------------------------------------------ */
  const vRecent = document.getElementById('view-recent');
  const vTopics = document.getElementById('view-topics');
  const vbs = [...document.querySelectorAll('[data-view]')];
  let view = 'recent';

  const setView = (v, topic) => {
    if (!vRecent || !vTopics) return;
    view = v;
    vRecent.hidden = v !== 'recent';
    vTopics.hidden = v !== 'topics';
    vbs.forEach(a => {
      if (a.dataset.view === v) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (v === 'topics' && topic) {
      const box = document.getElementById('topic-' + topic);
      if (box) box.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  if (vRecent && vTopics) {
    /* both views ship in the markup; hide one only once the script is running */
    setView('recent');
    vbs.forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      setView(a.dataset.view);
    }));
    document.querySelectorAll('[data-topic]').forEach(a =>
      a.addEventListener('click', e => {
        e.preventDefault();
        setView('topics', a.dataset.topic);
      }));
  }

  /* ------------------------------------------------------------------------
     4. Keyboard navigation and the index filter
     ------------------------------------------------------------------------ */
  const entries = [...document.querySelectorAll('.entry')];
  const findBar = document.getElementById('find');
  const q = document.getElementById('find-q');
  const qc = document.getElementById('find-count');
  const keys = document.getElementById('keys');
  const toggle = document.getElementById('keys-toggle');

  let sel = -1, gPending = false;

  const visible = () => entries.filter(e => !e.hidden);

  const mark = i => {
    entries.forEach(e => e.classList.remove('sel'));
    const list = visible();
    if (!list.length) { sel = -1; return; }
    sel = Math.max(0, Math.min(list.length - 1, i));
    list[sel].classList.add('sel');
    list[sel].scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  };

  const filter = term => {
    const t = term.trim().toLowerCase();
    let n = 0;
    entries.forEach(e => {
      const hit = !t || e.textContent.toLowerCase().includes(t);
      e.hidden = !hit;
      if (hit) n++;
    });
    if (qc) qc.textContent = t ? n + (n === 1 ? ' post' : ' posts') : '';
    sel = -1;
    entries.forEach(e => e.classList.remove('sel'));
  };

  const closeFind = () => {
    if (!findBar || !q) return;
    findBar.classList.remove('on');
    q.value = '';
    filter('');
    q.blur();
  };

  if (q) {
    q.addEventListener('input', () => {
      if (q.value.trim()) setView('recent');
      filter(q.value);
    });
    q.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); closeFind(); }
    });
  }

  if (toggle && keys) {
    toggle.addEventListener('click', () => {
      const min = keys.classList.toggle('min');
      toggle.setAttribute('aria-expanded', String(!min));
    });
  }

  /* ------------------------------------------------------------------------
     5. Contact form

     Formspree returns JSON to any request that asks for it, so this needs no
     library and the site keeps making zero third-party requests. Without the
     script the form posts normally and Formspree renders its own thank you.
     ------------------------------------------------------------------------ */
  const cform = document.getElementById('contact-form');
  const csent = document.getElementById('contact-sent');

  if (cform && csent && window.fetch) {
    const status = cform.querySelector('.status');
    const submit = cform.querySelector('button[type="submit"]');
    const FALLBACK = 'That did not send. Try again, or write to savva@pistolas.co.uk.';

    const clearErrors = () => {
      cform.querySelectorAll('.err').forEach(el => {
        el.textContent = '';
        const field = cform.elements[el.dataset.err];
        if (field) field.removeAttribute('aria-invalid');
      });
    };

    const showError = (name, message) => {
      const el = name && cform.querySelector('.err[data-err="' + name + '"]');
      if (!el) return false;
      el.textContent = message;
      const field = cform.elements[name];
      if (field) field.setAttribute('aria-invalid', 'true');
      return true;
    };

    cform.addEventListener('submit', async e => {
      e.preventDefault();
      clearErrors();
      status.textContent = 'Sending';
      submit.disabled = true;

      try {
        const res = await fetch(cform.action, {
          method: 'POST',
          body: new FormData(cform),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          cform.hidden = true;
          csent.hidden = false;
          csent.focus();
          return;
        }

        const data = await res.json().catch(() => null);
        const errors = (data && data.errors) || [];
        let placed = 0;

        errors.forEach(err => {
          const name = err.field || (err.source && err.source.field);
          if (showError(name, err.message)) placed++;
        });

        if (placed === errors.length && placed > 0) {
          status.textContent = '';   /* the inline field errors say it */
        } else if (errors.length) {
          status.textContent = errors[0].message;
        } else {
          status.textContent = FALLBACK;
        }
      } catch (err) {
        status.textContent = FALLBACK;
      } finally {
        submit.disabled = false;
      }
    });
  }

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

    if (e.key === '/' && findBar && q) {
      e.preventDefault();
      findBar.classList.add('on');
      q.focus();
      return;
    }
    if (e.key === '?' && toggle) { e.preventDefault(); toggle.click(); return; }
    if (e.key === 'Escape') { closeFind(); return; }
    if (e.key === 't' && vRecent && vTopics) {
      e.preventDefault();
      setView(view === 'recent' ? 'topics' : 'recent');
      return;
    }
    if (e.key === 'j' && entries.length) { e.preventDefault(); setView('recent'); mark(sel + 1); return; }
    if (e.key === 'k' && entries.length) { e.preventDefault(); setView('recent'); mark(sel <= 0 ? 0 : sel - 1); return; }
    if (e.key === 'Enter' && sel >= 0) {
      const row = visible()[sel];
      const a = row && row.querySelector('h2 a');
      if (a) { e.preventDefault(); a.click(); }
      return;
    }
    if (e.key === 'g') { gPending = true; setTimeout(() => { gPending = false; }, 800); return; }
    if (e.key === 'h' && gPending) {
      gPending = false;
      location.href = '/';
    }
  });
})();
