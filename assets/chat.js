(function () {
  'use strict';

  var ENDPOINT = 'https://dv6wbk9e.function2.insforge.app/ai-chat';
  var STORAGE_KEY = 'md_chat_history';
  var MAX_HISTORY = 30;

  // ── i18n strings ──────────────────────────────────────────────
  var T = {
    en: {
      greeting: "Hi! I'm Mohammed's AI assistant. What are you working on — or thinking about building?",
      placeholder: 'Ask me anything…',
      send: 'Send',
      thinking: 'Thinking…',
      error: 'Something went wrong. Please try again.',
      clear: 'Clear chat',
      close: 'Close',
      toggle: "Let's talk",
    },
    fr: {
      greeting: "Bonjour ! Je suis l'assistant IA de Mohammed. Sur quoi travaillez-vous ?",
      placeholder: 'Posez-moi une question…',
      send: 'Envoyer',
      thinking: 'Réflexion…',
      error: 'Une erreur est survenue. Réessayez.',
      clear: 'Effacer',
      close: 'Fermer',
      toggle: 'Parlons-en',
    },
    zh: {
      greeting: '您好！我是 Mohammed 的 AI 助手。您在做什么，或想打造什么？',
      placeholder: '有什么想问的？',
      send: '发送',
      thinking: '思考中…',
      error: '出错了，请重试。',
      clear: '清除',
      close: '关闭',
      toggle: '聊聊吧',
    },
  };

  function getLang() {
    try {
      var stored = localStorage.getItem('site-lang');
      if (stored === 'fr' || stored === 'zh') return stored;
    } catch (_) {}
    var nav = (navigator.languages || [navigator.language || 'en'])[0].toLowerCase();
    if (nav.startsWith('fr')) return 'fr';
    if (nav.startsWith('zh')) return 'zh';
    return 'en';
  }

  function t(key) {
    var lang = getLang();
    return (T[lang] && T[lang][key]) || T.en[key] || key;
  }

  // ── Styles ────────────────────────────────────────────────────
  var css = [
    '#md-chat-btn{position:fixed;bottom:28px;right:24px;z-index:9000;display:flex;align-items:center;gap:8px;background:#6750a4;color:#fff;border:none;border-radius:100px;padding:13px 20px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(103,80,164,.45);transition:transform .15s,box-shadow .15s;}',
    '#md-chat-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(103,80,164,.5);}',
    '#md-chat-btn .cb-icon{width:20px;height:20px;flex-shrink:0;}',
    '#md-chat-btn.open .cb-label{display:none;}',
    '#md-chat-panel{position:fixed;bottom:90px;right:24px;z-index:8999;width:360px;max-width:calc(100vw - 32px);background:#fffbfe;border:1px solid #cac4d0;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.14);display:flex;flex-direction:column;overflow:hidden;transition:opacity .2s,transform .2s;opacity:0;transform:translateY(12px) scale(.97);pointer-events:none;max-height:min(540px,calc(100dvh - 120px));}',
    '#md-chat-panel.visible{opacity:1;transform:none;pointer-events:auto;}',
    '#md-chat-header{display:flex;align-items:center;gap:10px;padding:14px 16px;background:#6750a4;color:#fff;flex-shrink:0;}',
    '#md-chat-header .ch-avatar{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}',
    '#md-chat-header .ch-info{flex:1;min-width:0;}',
    '#md-chat-header .ch-name{font-weight:700;font-size:14px;line-height:1.2;}',
    '#md-chat-header .ch-sub{font-size:11px;opacity:.8;}',
    '#md-chat-header .ch-actions{display:flex;gap:4px;}',
    '#md-chat-header button{background:none;border:none;color:#fff;cursor:pointer;padding:4px 6px;border-radius:6px;font-size:11px;opacity:.8;transition:opacity .1s;}',
    '#md-chat-header button:hover{opacity:1;background:rgba(255,255,255,.15);}',
    '#md-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}',
    '.md-msg{max-width:86%;padding:10px 13px;border-radius:16px;font-size:13.5px;line-height:1.55;word-break:break-word;}',
    '.md-msg.bot{background:#f3edf7;color:#1c1b1f;border-bottom-left-radius:4px;align-self:flex-start;}',
    '.md-msg.user{background:#6750a4;color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}',
    '.md-msg.typing{opacity:.65;}',
    '.md-msg a{color:inherit;text-decoration:underline;}',
    '.md-msg strong{font-weight:700;}',
    '.md-msg em{font-style:italic;}',
    '#md-chat-input-row{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #e8e0f0;flex-shrink:0;background:#fffbfe;}',
    '#md-chat-input{flex:1;border:1px solid #cac4d0;border-radius:12px;padding:9px 12px;font-family:inherit;font-size:13.5px;outline:none;background:#f3edf7;color:#1c1b1f;resize:none;max-height:80px;transition:border-color .15s;}',
    '#md-chat-input:focus{border-color:#6750a4;}',
    '#md-chat-send{background:#6750a4;color:#fff;border:none;border-radius:12px;padding:9px 14px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;transition:background .15s;flex-shrink:0;}',
    '#md-chat-send:hover{background:#4f378b;}',
    '#md-chat-send:disabled{opacity:.5;cursor:not-allowed;}',
    '@media(max-width:400px){#md-chat-panel{right:8px;bottom:80px;}#md-chat-btn{right:12px;bottom:20px;}}',
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── State ─────────────────────────────────────────────────────
  var history = [];
  var isOpen = false;
  var isStreaming = false;

  function loadHistory() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) history = JSON.parse(raw).slice(-MAX_HISTORY);
    } catch (_) {}
  }

  function saveHistory() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY))); } catch (_) {}
  }

  // ── Markdown renderer (minimal) ───────────────────────────────
  function renderMd(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  // ── DOM builders ──────────────────────────────────────────────
  var btn, panel, messagesEl, inputEl, sendBtn;

  function buildDOM() {
    // Toggle button
    btn = document.createElement('button');
    btn.id = 'md-chat-btn';
    btn.setAttribute('aria-label', t('toggle'));
    btn.innerHTML = '<svg class="cb-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg><span class="cb-label">' + t('toggle') + '</span>';
    btn.addEventListener('click', togglePanel);
    document.body.appendChild(btn);

    // Panel
    panel = document.createElement('div');
    panel.id = 'md-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Mohammed\'s assistant');
    panel.innerHTML = [
      '<div id="md-chat-header">',
        '<div class="ch-avatar">🤖</div>',
        '<div class="ch-info"><div class="ch-name">Mohammed\'s Assistant</div><div class="ch-sub">Replies instantly</div></div>',
        '<div class="ch-actions">',
          '<button id="md-chat-clear" title="' + t('clear') + '">✕ Clear</button>',
          '<button id="md-chat-close" title="' + t('close') + '">✕</button>',
        '</div>',
      '</div>',
      '<div id="md-chat-messages"></div>',
      '<div id="md-chat-input-row">',
        '<textarea id="md-chat-input" rows="1" placeholder="' + t('placeholder') + '" maxlength="800"></textarea>',
        '<button id="md-chat-send">' + t('send') + '</button>',
      '</div>',
    ].join('');
    document.body.appendChild(panel);

    messagesEl = panel.querySelector('#md-chat-messages');
    inputEl    = panel.querySelector('#md-chat-input');
    sendBtn    = panel.querySelector('#md-chat-send');

    panel.querySelector('#md-chat-close').addEventListener('click', function () { togglePanel(false); });
    panel.querySelector('#md-chat-clear').addEventListener('click', clearChat);
    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    inputEl.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });

    // Render persisted messages
    history.forEach(function (m) { appendMessage(m.role === 'user' ? 'user' : 'bot', m.content, false); });

    // Greeting if fresh session
    if (history.length === 0) {
      appendMessage('bot', t('greeting'), false);
    }
  }

  function appendMessage(role, text, isTyping) {
    var div = document.createElement('div');
    div.className = 'md-msg ' + role + (isTyping ? ' typing' : '');
    div.innerHTML = '<p>' + renderMd(text) + '</p>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function togglePanel(forceState) {
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
    panel.classList.toggle('visible', isOpen);
    btn.classList.toggle('open', isOpen);
    if (isOpen) {
      setTimeout(function () { inputEl.focus(); }, 220);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function clearChat() {
    history = [];
    saveHistory();
    messagesEl.innerHTML = '';
    appendMessage('bot', t('greeting'), false);
  }

  // ── Streaming send ────────────────────────────────────────────
  function sendMessage() {
    if (isStreaming) return;
    var text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    appendMessage('user', text, false);
    history.push({ role: 'user', content: text });
    saveHistory();

    isStreaming = true;
    sendBtn.disabled = true;
    sendBtn.textContent = t('thinking');

    var botDiv = appendMessage('bot', '', true);
    var pEl = botDiv.querySelector('p');
    var accumulated = '';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-20) }),
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';

      function pump() {
        return reader.read().then(function (result) {
          if (result.done) {
            finishStream(botDiv, pEl, accumulated);
            return;
          }
          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop();
          lines.forEach(function (line) {
            if (!line.startsWith('data: ')) return;
            var json = line.slice(6).trim();
            if (json === '[DONE]') return;
            try {
              var chunk = JSON.parse(json);
              var delta = chunk.choices && chunk.choices[0] && chunk.choices[0].delta && chunk.choices[0].delta.content;
              if (delta) {
                accumulated += delta;
                pEl.innerHTML = renderMd(accumulated) || '…';
                messagesEl.scrollTop = messagesEl.scrollHeight;
              }
            } catch (_) {}
          });
          return pump();
        });
      }
      return pump();
    }).catch(function (err) {
      console.error('Chat error:', err);
      pEl.innerHTML = renderMd(t('error'));
      botDiv.classList.remove('typing');
      isStreaming = false;
      sendBtn.disabled = false;
      sendBtn.textContent = t('send');
    });
  }

  function finishStream(botDiv, pEl, text) {
    botDiv.classList.remove('typing');
    if (text) {
      history.push({ role: 'assistant', content: text });
      saveHistory();
    } else {
      pEl.innerHTML = renderMd(t('error'));
    }
    isStreaming = false;
    sendBtn.disabled = false;
    sendBtn.textContent = t('send');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ── Boot ──────────────────────────────────────────────────────
  loadHistory();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDOM);
  } else {
    buildDOM();
  }
})();
