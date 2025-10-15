// src/widget.js
(function (window, document) {
  'use strict';
  const NS = 'CivicChat';
  if (window[NS]) return; // mehrfaches Laden verhindern

  function qs(sel, root=document){ return root.querySelector(sel); }
  function readData(el, key, fallback){ return el?.dataset?.[key] ?? fallback; }

  async function loadJSON(url){
    try {
      const r = await fetch(url, { credentials: 'same-origin' });
      if (!r.ok) throw new Error('config load failed');
      return await r.json();
    } catch(e) { return {}; }
  }

  function createUI(root){
    root.classList.add('civic-chat');
    root.innerHTML = `
      <div class="civic-chat__header">Chat</div>
      <div class="civic-chat__body">
        <div class="civic-chat__messages" aria-live="polite"></div>
        <form class="civic-chat__form">
          <input class="civic-chat__input" name="q" type="text" autocomplete="off" />
          <button class="civic-chat__send" type="submit">Senden</button>
        </form>
      </div>`;
    return root;
  }

  async function init(opts){
    opts = opts || {};
    const el = opts.el || qs('#civic-chat');
    if (!el) { console.warn('[civic-chat] mount element not found'); return; }

    const apiUrl = opts.apiUrl || readData(el, 'apiUrl', '/chat');
    const cfgUrl = opts.configUrl || readData(el, 'configUrl', '/config.json');

    // load optional config
    const cfg = await loadJSON(cfgUrl);

    createUI(el);
    const form = el.querySelector('.civic-chat__form');
    const input = el.querySelector('.civic-chat__input');
    const messages = el.querySelector('.civic-chat__messages');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      const m = document.createElement('div'); m.textContent = '…';
      messages.appendChild(m);
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ q })
        });
        if (!res.ok) throw new Error('api error');
        const js = await res.json();
        m.textContent = js.answer ?? '[keine Antwort]';
      } catch(err) {
        m.textContent = '[Fehler]';
        console.error(err);
      } finally {
        input.value = '';
      }
    });
  }

  window[NS] = { init };
})(window, document);
