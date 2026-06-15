(function () {
  'use strict';

  var D = CASHFREE_DATA;

  // ---------- Helpers ----------
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var el = function (html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  };
  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var pts = function (v) { return v.toLocaleString('pt-BR') + ' pts'; };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  // ============ NAVBAR ============
  function initNav() {
    var header = $('#header');
    var toggle = $('#navToggle');
    var mobile = $('#navMobile');

    function onScroll() {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    toggle.addEventListener('click', function () {
      var open = mobile.hasAttribute('hidden') === false;
      if (open) { mobile.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); }
      else { mobile.removeAttribute('hidden'); toggle.setAttribute('aria-expanded', 'true'); }
    });
    // Fecha o menu ao clicar num link
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobile.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  // ============ BENEFÍCIOS / PROBLEMA / STEPS ============
  function initStatic() {
    $('#benefitsGrid').append.apply($('#benefitsGrid'), D.benefits.map(function (b) {
      return el('<div class="card benefit"><span class="benefit__icon">' + b.icon + '</span>' +
        '<h3>' + esc(b.title) + '</h3><p>' + esc(b.text) + '</p></div>');
    }));

    $('#painList').append.apply($('#painList'), D.painPoints.map(function (p) {
      return el('<li><span class="x">!</span><span>' + esc(p) + '</span></li>');
    }));

    var stats = $('#lostStats');
    D.lostStats.forEach(function (s) {
      stats.appendChild(el('<div class="card stat-card"><p class="v">' + esc(s.value) + '</p><p class="l">' + esc(s.label) + '</p></div>'));
    });
    stats.appendChild(el('<div class="goodnews"><p class="k">A boa notícia</p>' +
      '<p class="t">A CashFree reúne tudo isso em um único painel e avisa antes de você perder.</p></div>'));

    $('#stepsGrid').append.apply($('#stepsGrid'), D.steps.map(function (s) {
      return el('<li class="card"><span class="ghostnum">' + s.n + '</span>' +
        '<span class="num">' + s.n + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>');
    }));
  }

  // ============ DASHBOARD ============
  var resolvedAlerts = [];
  var sortProgByCashback = false;
  var onlyExpiring = false;

  function initDashboard() {
    var totalCash = D.programs.reduce(function (s, p) { return s + p.cashback; }, 0);
    var totalPts = D.programs.reduce(function (s, p) { return s + p.points; }, 0);
    var summary = [
      { ico: '👛', cls: 'chip--green', l: 'Cashback disponível', v: brl(totalCash) },
      { ico: '📈', cls: 'chip--blue', l: 'Pontos acumulados', v: pts(totalPts) },
      { ico: '🎟️', cls: 'chip--violet', l: 'Cupons ativos', v: String(D.totals.activeCoupons) },
      { ico: '📊', cls: 'chip--amber', l: 'Economia no mês', v: brl(D.totals.estimatedMonthlySavings) },
    ];
    $('#summaryGrid').append.apply($('#summaryGrid'), summary.map(function (s) {
      return el('<div class="card summary__card"><span class="summary__icon ' + s.cls + '">' + s.ico + '</span>' +
        '<div><p class="l">' + s.l + '</p><p class="v">' + s.v + '</p></div></div>');
    }));

    var tabs = $('#tabs');
    tabs.querySelectorAll('.tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        ['visao', 'alertas', 'recomendacoes', 'programas'].forEach(function (id) {
          var p = $('#panel-' + id);
          if (id === btn.dataset.tab) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
        });
      });
    });

    renderVisao();
    renderAlertas();
    renderRecomendacoes();
    renderProgramas();
  }

  function renderVisao() {
    var cashItems = D.programs.filter(function (p) { return p.cashback > 0; })
      .sort(function (a, b) { return b.cashback - a.cashback; });
    var max = Math.max.apply(null, D.programs.map(function (p) { return p.cashback; }).concat([1]));
    var bars = cashItems.map(function (p) {
      return '<div class="bar-row"><div class="top"><span class="name">' + esc(p.name) + '</span>' +
        '<span class="val">' + brl(p.cashback) + '</span></div>' +
        '<div class="bar"><span style="width:' + (p.cashback / max * 100) + '%;background:' + p.color + '"></span></div></div>';
    }).join('');

    var ptItems = D.programs.filter(function (p) { return p.points > 0; }).map(function (p) {
      var exp = (p.expiresInDays !== null && p.expiresInDays <= 21)
        ? '<span class="chip chip--amber" style="margin-top:8px">⏱ ' + p.expiresInDays + 'd</span>' : '';
      return '<div class="point-card" style="border-top-color:' + p.color + '">' +
        '<p class="v">' + pts(p.points) + '</p><p class="l">' + esc(p.name) + '</p>' + exp + '</div>';
    }).join('');

    $('#panel-visao').innerHTML =
      '<div class="grid grid--2">' +
      '<div class="card"><h3 style="color:var(--ink-900);font-size:1.1rem">Cashback por programa</h3>' +
      '<p class="muted">Distribuição do seu dinheiro de volta.</p><div style="margin-top:20px">' + bars + '</div></div>' +
      '<div class="card"><h3 style="color:var(--ink-900);font-size:1.1rem">Pontos e milhas</h3>' +
      '<p class="muted">Saldos acumulados em programas de fidelidade.</p>' +
      '<div class="points-grid">' + ptItems + '</div></div>' +
      '</div>';
  }

  function renderAlertas() {
    var panel = $('#panel-alertas');
    var visible = D.alerts.filter(function (a) { return resolvedAlerts.indexOf(a.id) === -1; });
    $('#alertCount').textContent = visible.length;
    $('#alertCount').style.display = visible.length ? '' : 'none';

    if (!visible.length) {
      panel.innerHTML = '<div class="card empty"><span class="summary__icon chip--green" style="margin:0 auto;font-size:1.6rem">✓</span>' +
        '<p class="big">Tudo em dia!</p><p class="muted">Nenhum alerta pendente no momento.</p></div>';
    } else {
      var sevCls = { alta: 'chip--red', 'média': 'chip--amber', baixa: 'chip--green' };
      panel.innerHTML = visible.map(function (a) {
        return '<div class="card alert"><div class="alert__main"><span class="alert__icon">🔔</span>' +
          '<div><div class="alert__head"><h4>' + esc(a.title) + '</h4>' +
          '<span class="chip ' + sevCls[a.severity] + '">' + a.severity + '</span></div>' +
          '<p class="desc">' + esc(a.description) + '</p></div></div>' +
          '<button class="btn btn--secondary" data-resolve="' + a.id + '">✓ Marcar como resolvido</button></div>';
      }).join('');
    }
    if (resolvedAlerts.length) {
      panel.appendChild(el('<button class="btn btn--ghost" style="margin:0 auto;display:flex" data-restore="1">Restaurar alertas resolvidos</button>'));
    }
    panel.querySelectorAll('[data-resolve]').forEach(function (b) {
      b.addEventListener('click', function () { resolvedAlerts.push(b.dataset.resolve); renderAlertas(); });
    });
    var restore = panel.querySelector('[data-restore]');
    if (restore) restore.addEventListener('click', function () { resolvedAlerts = []; renderAlertas(); });
  }

  function renderRecomendacoes() {
    $('#panel-recomendacoes').innerHTML = '<div class="grid grid--2">' + D.recommendations.map(function (r) {
      return '<div class="card rec"><div class="rec__main"><span class="rec__icon">✨</span>' +
        '<div><h4>' + esc(r.title) + '</h4><p>' + esc(r.reason) + '</p></div></div>' +
        '<div class="rec__foot"><span class="pot">Potencial: <strong class="accent">' + brl(r.potential) + '</strong></span>' +
        '<button class="btn btn--primary" style="padding:8px 16px;font-size:0.78rem">Ver melhor oportunidade</button></div></div>';
    }).join('') + '</div>';
  }

  function renderProgramas() {
    var panel = $('#panel-programas');
    var list = D.programs.slice();
    if (onlyExpiring) list = list.filter(function (p) { return p.expiresInDays !== null && p.expiresInDays <= 21; });
    if (sortProgByCashback) list.sort(function (a, b) { return b.cashback - a.cashback; });

    var cards = list.map(function (p) {
      var expCls = p.expiresInDays === null ? '' : (p.expiresInDays <= 7 ? 'exp--red' : p.expiresInDays <= 21 ? 'exp--amber' : 'exp--gray');
      var exp = p.expiresInDays === null ? '' : '<p class="exp ' + expCls + '">⏱ Vence em ' + p.expiresInDays + ' dias</p>';
      var statusCls = p.status === 'conectado' ? 'chip--green' : '';
      var statusStyle = p.status === 'conectado' ? '' : 'background:var(--ink-100);color:var(--ink-500)';
      return '<div class="card prog-card"><div class="top">' +
        '<span class="prog-logo" style="background:' + p.color + '">' + p.logo + '</span>' +
        '<span class="chip ' + statusCls + '" style="' + statusStyle + '">' + p.status + '</span></div>' +
        '<h4>' + esc(p.name) + '</h4><p class="v">' + (p.cashback > 0 ? brl(p.cashback) : pts(p.points)) + '</p>' + exp + '</div>';
    }).join('');

    panel.innerHTML =
      '<div class="dash-controls">' +
      '<button class="btn ' + (sortProgByCashback ? 'btn--primary' : 'btn--secondary') + '" data-sort="1">Ordenar por maior cashback</button>' +
      '<button class="btn ' + (onlyExpiring ? 'btn--primary' : 'btn--secondary') + '" data-exp="1">Filtrar por vencimento próximo</button>' +
      '</div>' +
      (list.length ? '<div class="grid grid--3">' + cards + '</div>'
        : '<p class="card" style="text-align:center;color:var(--ink-500)">Nenhum programa corresponde aos filtros selecionados.</p>');

    panel.querySelector('[data-sort]').addEventListener('click', function () { sortProgByCashback = !sortProgByCashback; renderProgramas(); });
    panel.querySelector('[data-exp]').addEventListener('click', function () { onlyExpiring = !onlyExpiring; renderProgramas(); });
  }

  // ============ LOJAS PARCEIRAS ============
  var storeCategory = 'Todas';
  var storeSort = false;
  var activatedStores = [];

  function initStores() {
    var filters = $('#storeFilters');
    var cats = ['Todas'].concat(D.storeCategories);
    cats.forEach(function (c) {
      var b = el('<button class="filter" data-cat="' + esc(c) + '">' + esc(c) + '</button>');
      filters.appendChild(b);
    });
    var sortBtn = el('<button class="filter" data-sort="1">📈 Maior cashback</button>');
    filters.appendChild(sortBtn);

    filters.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.cat !== undefined) storeCategory = t.dataset.cat;
      if (t.dataset.sort) storeSort = !storeSort;
      renderStores();
    });
    renderStores();
  }

  function renderStores() {
    $('#storeFilters').querySelectorAll('.filter').forEach(function (b) {
      b.classList.remove('is-active', 'is-active--soft');
      if (b.dataset.cat !== undefined && b.dataset.cat === storeCategory) b.classList.add('is-active');
      if (b.dataset.sort && storeSort) b.classList.add('is-active--soft');
    });

    var list = storeCategory === 'Todas' ? D.stores.slice() : D.stores.filter(function (s) { return s.category === storeCategory; });
    if (storeSort) list.sort(function (a, b) { return b.cashback - a.cashback; });

    var hlCls = { 'Melhor oportunidade': 'hl-best', 'Cashback alto': 'chip--blue', 'Cupom expirando': 'chip--amber' };
    var grid = $('#storesGrid');
    grid.innerHTML = list.map(function (s) {
      var active = activatedStores.indexOf(s.id) !== -1;
      var hl = s.highlight
        ? (s.highlight === 'Melhor oportunidade'
          ? '<span class="chip" style="background:var(--brand-600);color:#fff">' + s.highlight + '</span>'
          : '<span class="chip ' + hlCls[s.highlight] + '">' + s.highlight + '</span>')
        : '';
      var coupon = s.coupon ? '<div class="store__coupon">🎟️ ' + esc(s.coupon) + '</div>' : '';
      var btn = active
        ? '<button class="btn btn--activated" disabled>✓ Benefício ativado</button>'
        : '<button class="btn btn--primary" data-activate="' + s.id + '">Ativar benefício</button>';
      return '<div class="card store"><div class="store__top"><span class="store__logo">' + s.logo + '</span>' + hl + '</div>' +
        '<h3>' + esc(s.name) + '</h3><p class="cat">' + esc(s.category) + '</p>' +
        '<div class="store__cash"><span class="pct">' + s.cashback + '%</span><span class="lbl">de cashback</span></div>' +
        coupon + btn + '</div>';
    }).join('');

    grid.querySelectorAll('[data-activate]').forEach(function (b) {
      b.addEventListener('click', function () { activatedStores.push(b.dataset.activate); renderStores(); });
    });
  }

  // ============ EXTENSÃO ============
  function initExtension() {
    var body = $('#extBody');
    var icon = $('#extIcon');
    var opportunities = [
      'TechHouse: 8% de cashback detectado',
      'Cupom MODA15 disponível na ModaMais',
      'EducaOnline: 12% de cashback (melhor da categoria)',
    ];
    var timers = [];

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function inactive() {
      clearTimers(); icon.classList.remove('on');
      body.innerHTML = '<div class="ext-center"><span class="ico">🧩</span>' +
        '<p class="t">Extensão CashFree inativa</p>' +
        '<p class="s">Ative para começar a capturar benefícios nesta página.</p>' +
        '<button class="btn btn--primary" data-activate="1" style="margin-top:20px">Ativar extensão</button></div>';
      body.querySelector('[data-activate]').addEventListener('click', installing);
    }
    function installing() {
      body.innerHTML = '<div style="text-align:center;padding:32px 0"><div class="spinner"></div>' +
        '<p class="muted" style="margin-top:8px">Ativando extensão…</p></div>';
      timers.push(setTimeout(active, 1200));
    }
    function active() {
      icon.classList.add('on');
      body.innerHTML = '<div><div style="display:flex;gap:8px;align-items:center">' +
        '<span class="chip chip--green"><span class="dot"></span>Extensão ativa</span>' +
        '<span class="muted">Capturando oportunidades…</span></div><ul id="extList" style="margin-top:16px;display:flex;flex-direction:column;gap:8px"></ul>' +
        '<button class="btn btn--ghost btn--block" data-reset="1" style="margin-top:16px">Reiniciar simulação</button></div>';
      var ul = $('#extList', body);
      opportunities.forEach(function (op, i) {
        timers.push(setTimeout(function () {
          ul.appendChild(el('<li class="ext-found fade-up">🎟️ ' + esc(op) + '</li>'));
          if (i === opportunities.length - 1) {
            ul.appendChild(el('<li style="text-align:center;font-weight:700;color:var(--brand-700);font-size:0.9rem;padding-top:4px">✓ ' +
              opportunities.length + ' oportunidades enviadas ao seu dashboard</li>'));
          }
        }, (i + 1) * 700));
      });
      body.querySelector('[data-reset]').addEventListener('click', inactive);
    }
    inactive();
  }

  // ============ COMPARATIVO ============
  function initComparison() {
    var cols = [
      { k: 'cashfree', label: 'CashFree', hl: true },
      { k: 'meliuz', label: 'Méliuz', hl: false },
      { k: 'ame', label: 'Ame Digital', hl: false },
      { k: 'cuponomia', label: 'Cuponomia', hl: false },
    ];
    var head = '<tr><th>Recurso</th>' + cols.map(function (c) {
      return '<th class="' + (c.hl ? 'hl' : '') + '">' + c.label + '</th>';
    }).join('') + '</tr>';
    var rows = D.comparison.map(function (r) {
      return '<tr><td><span class="name">' + esc(r.feature) + '</span></td>' + cols.map(function (c) {
        var on = r[c.k];
        return '<td class="' + (c.hl ? 'hl' : '') + '"><span class="mark ' + (on ? 'mark--yes' : 'mark--no') + '">' + (on ? '✓' : '✕') + '</span></td>';
      }).join('') + '</tr>';
    }).join('');
    $('#comparisonWrap').innerHTML = '<table><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>';
  }

  // ============ SIMULADOR ============
  function initSimulator() {
    var spend = $('#spend'), programs = $('#programs'), forgets = $('#forgets'), freq = $('#freq');
    var factor = 0.7;

    function compute() {
      var s = Number(spend.value), p = Number(programs.value), f = forgets.checked;
      var rate = 0.035 * Math.min(p / 3, 2) * factor;
      var forgetBonus = f ? 1.35 : 1;
      var monthly = s * rate * forgetBonus;
      var yearly = monthly * 12;
      var pointsSaved = Math.round(p * (f ? 1100 : 500) * factor);

      $('#spendVal').textContent = brl(s);
      $('#progVal').textContent = p;
      $('#resMonthly').textContent = brl(monthly);
      $('#resYearly').textContent = brl(yearly);
      $('#resPoints').textContent = pointsSaved.toLocaleString('pt-BR');
      $('#resText').innerHTML = 'Com a CashFree, você poderia recuperar aproximadamente <strong>' + brl(monthly) +
        '</strong> por mês e evitar a perda de <strong>' + pointsSaved.toLocaleString('pt-BR') + '</strong> pontos por ano.';
    }

    spend.addEventListener('input', compute);
    programs.addEventListener('input', compute);
    forgets.addEventListener('change', compute);
    freq.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      freq.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      factor = Number(b.dataset.factor);
      compute();
    });
    compute();
  }

  // ============ ARQUITETURA ============
  function initArchitecture() {
    var layers = $('#layers');
    D.layers.forEach(function (layer, i) {
      var blocks = layer.blocks.map(function (b) { return '<div class="layer__block">' + esc(b) + '</div>'; }).join('');
      layers.appendChild(el('<div class="layer ' + layer.cls + '"><p class="layer__name">' + esc(layer.name) + '</p>' +
        '<div class="layer__blocks">' + blocks + '</div></div>'));
      if (i < D.layers.length - 1) layers.appendChild(el('<div class="layer__arrow">↓</div>'));
    });

    $('#flow').innerHTML = D.flow.map(function (step, i) {
      return '<li><span class="n">' + (i + 1) + '</span><span class="t">' + esc(step) + '</span></li>';
    }).join('');

    $('#components').innerHTML = D.components.map(function (c) {
      return '<span class="comp-chip">' + esc(c) + '</span>';
    }).join('');

    $('#entities').innerHTML = D.entities.map(function (e) {
      return '<div class="entity"><div class="entity__head">' + esc(e.name) + '</div><ul>' +
        e.fields.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>';
    }).join('');

    $('#nfr').innerHTML = D.nfr.map(function (n) {
      return '<div class="nfr-card"><span class="ico">' + n.icon + '</span><p class="t">' + esc(n.title) + '</p>' +
        '<p class="d">' + esc(n.text) + '</p></div>';
    }).join('');

    var acc = $('#tradeoffs');
    acc.innerHTML = D.tradeoffs.map(function (t, i) {
      return '<div class="acc-item' + (i === 0 ? ' open' : '') + '">' +
        '<button class="acc-q">' + esc(t.q) + '<span class="caret">▾</span></button>' +
        '<div class="acc-a"' + (i === 0 ? '' : ' hidden') + '>' + esc(t.a) + '</div></div>';
    }).join('');
    acc.querySelectorAll('.acc-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.parentElement;
        var ans = item.querySelector('.acc-a');
        var open = item.classList.toggle('open');
        if (open) ans.removeAttribute('hidden'); else ans.setAttribute('hidden', '');
      });
    });
  }

  // ============ PLANOS DE ASSINATURA ============
  function initPlans() {
    var grid = $('#plansGrid');
    var cardCls = { free: '', economiza: 'plan-card--popular', 'economiza-plus': 'plan-card--premium' };

    grid.innerHTML = D.plans.tiers.map(function (tier) {
      var badge = tier.badge ? '<span class="plan-card__badge">' + esc(tier.badge) + '</span>' : '';
      var price = tier.price === 0
        ? 'R$ 0,00<span> /mês</span>'
        : brl(tier.price) + '<span> /mês</span>';
      var features = tier.highlights.map(function (h) {
        return '<li class="plan-card__feature"><span class="ico">✓</span><span>' + esc(h) + '</span></li>';
      }).join('');
      var btnCls = tier.id === 'free' ? 'btn--secondary' : 'btn--primary';

      return '<div class="card plan-card ' + (cardCls[tier.id] || '') + '">' +
        badge +
        '<p class="plan-card__name">' + esc(tier.name) + '</p>' +
        '<p class="plan-card__desc">' + esc(tier.desc) + '</p>' +
        '<p class="plan-card__price">' + price + '</p>' +
        '<ul class="plan-card__features">' + features + '</ul>' +
        '<button class="btn ' + btnCls + ' btn--block" data-plan="' + tier.id + '">' + esc(tier.cta) + '</button>' +
        '</div>';
    }).join('');

    grid.querySelectorAll('[data-plan]').forEach(function (b) {
      b.addEventListener('click', function () { openModal('registerOverlay'); });
    });

    // Tabela comparativa completa
    var head = '<tr><th>Benefício</th>' + D.plans.tiers.map(function (tier, i) {
      var hlCls = i === 1 ? 'hl-popular' : (i === 2 ? 'hl-premium' : '');
      var badge = tier.badge ? '<span class="th-badge">' + esc(tier.badge) + '</span>' : '';
      return '<th class="' + hlCls + '">' + esc(tier.name) + badge + '</th>';
    }).join('') + '</tr>';

    var rows = D.plans.benefits.map(function (b) {
      var cells = b.values.map(function (v, i) {
        var hlCls = i === 1 ? 'hl-popular' : (i === 2 ? 'hl-premium' : '');
        var content;
        if (v === true) content = '<span class="mark mark--yes">✓</span>';
        else if (v === false) content = '<span class="mark mark--no">✕</span>';
        else content = '<span class="cell-text">' + esc(v) + '</span>';
        return '<td class="' + hlCls + '">' + content + '</td>';
      }).join('');
      return '<tr><td><span class="name">' + esc(b.label) + '</span></td>' + cells + '</tr>';
    }).join('');

    $('#plansTableWrap').innerHTML = '<table><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>';
  }

  // ============ MODAIS: LOGIN / CADASTRO ============
  var activeModal = null;
  var lastFocused = null;

  function openModal(id) {
    var overlay = $('#' + id);
    if (!overlay) return;
    if (activeModal && activeModal !== overlay) closeModal(activeModal.id, true);
    lastFocused = document.activeElement;
    overlay.removeAttribute('hidden');
    requestAnimationFrame(function () { overlay.classList.add('is-open'); });
    activeModal = overlay;
    document.body.style.overflow = 'hidden';
    var firstInput = overlay.querySelector('input');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 250);
  }

  function closeModal(id, skipFocusRestore) {
    var overlay = $('#' + id);
    if (!overlay) return;
    overlay.classList.remove('is-open');
    setTimeout(function () { overlay.setAttribute('hidden', ''); }, 250);
    if (activeModal === overlay) activeModal = null;
    document.body.style.overflow = '';
    if (!skipFocusRestore && lastFocused) lastFocused.focus();
  }

  function clearErrors(form) {
    form.querySelectorAll('.field__error').forEach(function (e) { e.textContent = ''; });
    form.querySelectorAll('input').forEach(function (i) { i.classList.remove('is-invalid'); });
  }

  function setError(input, errorEl, message) {
    input.classList.add('is-invalid');
    errorEl.textContent = message;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function showSuccess(form, title, text) {
    var wrap = form.closest('.modal');
    var success = el(
      '<div class="modal__success">' +
      '<span class="ico">✓</span>' +
      '<h3>' + esc(title) + '</h3>' +
      '<p>' + text + '</p>' +
      '<button class="btn btn--primary btn--block" data-success-close="1">Fechar</button>' +
      '</div>'
    );
    form.replaceWith(success);
    success.querySelector('[data-success-close]').addEventListener('click', function () {
      var overlay = wrap.closest('.modal-overlay');
      closeModal(overlay.id);
    });
  }

  function initAuthModals() {
    var overlays = ['loginOverlay', 'registerOverlay'];

    // Abrir modais (desktop + mobile)
    [['#openLogin', 'loginOverlay'], ['#openLoginMobile', 'loginOverlay'],
    ['#openRegister', 'registerOverlay'], ['#openRegisterMobile', 'registerOverlay']]
      .forEach(function (pair) {
        var trigger = $(pair[0]);
        if (trigger) trigger.addEventListener('click', function () {
          var mobile = $('#navMobile');
          if (!mobile.hasAttribute('hidden')) { mobile.setAttribute('hidden', ''); $('#navToggle').setAttribute('aria-expanded', 'false'); }
          openModal(pair[1]);
        });
      });

    // Fechar modais: botão de fechar, clique no overlay, tecla ESC
    overlays.forEach(function (id) {
      var overlay = $('#' + id);
      $('#' + id.replace('Overlay', 'Close')).addEventListener('click', function () { closeModal(id); });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal(id);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activeModal) closeModal(activeModal.id);
    });

    $('#goToRegister').addEventListener('click', function (e) { e.preventDefault(); closeModal('loginOverlay'); openModal('registerOverlay'); });
    $('#goToLogin').addEventListener('click', function (e) { e.preventDefault(); closeModal('registerOverlay'); openModal('loginOverlay'); });

    $('#forgotPasswordLink').addEventListener('click', function (e) {
      e.preventDefault();
      $('#forgotPasswordHint').removeAttribute('hidden');
    });

    // ---- Formulário de login ----
    var loginForm = $('#loginForm');
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(loginForm);
      var email = $('#loginEmail'), password = $('#loginPassword');
      var ok = true;

      if (!email.value.trim()) { setError(email, $('#loginEmailError'), 'Informe seu e-mail.'); ok = false; }
      else if (!isValidEmail(email.value.trim())) { setError(email, $('#loginEmailError'), 'Informe um e-mail válido.'); ok = false; }

      if (!password.value) { setError(password, $('#loginPasswordError'), 'Informe sua senha.'); ok = false; }

      if (!ok) return;

      // 1. Salvar sessão no localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email.value.trim());
      if (!localStorage.getItem("userName")) {
        localStorage.setItem("userName", "Usuário");
      }
      showSuccess(loginForm, 'Login realizado! 🎉', 'Redirecionando para o seu dashboard...');
      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 1500); // Aguarda 1.5 segundos para o usuário ler a mensagem
    });

    // ---- Formulário de cadastro ----
    var registerForm = $('#registerForm');
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(registerForm);
      var name = $('#regName'), email = $('#regEmail'), password = $('#regPassword'), confirm = $('#regConfirm');
      var ok = true;

      if (!name.value.trim()) { setError(name, $('#regNameError'), 'Informe seu nome completo.'); ok = false; }

      if (!email.value.trim()) { setError(email, $('#regEmailError'), 'Informe seu e-mail.'); ok = false; }
      else if (!isValidEmail(email.value.trim())) { setError(email, $('#regEmailError'), 'Informe um e-mail válido.'); ok = false; }

      if (!password.value) { setError(password, $('#regPasswordError'), 'Crie uma senha.'); ok = false; }
      else if (password.value.length < 8) { setError(password, $('#regPasswordError'), 'A senha deve ter no mínimo 8 caracteres.'); ok = false; }

      if (!confirm.value) { setError(confirm, $('#regConfirmError'), 'Confirme sua senha.'); ok = false; }
      else if (confirm.value !== password.value) { setError(confirm, $('#regConfirmError'), 'As senhas não coincidem.'); ok = false; }

      if (!ok) return;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", name.value.trim());
      localStorage.setItem("userEmail", email.value.trim());

      showSuccess(registerForm, 'Conta criada com sucesso! 🎉', 'Preparando o seu ambiente CashFree...');
      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 1500); // Aguarda 1.5 segundos para o usuário ler a mensagem
    });
  }

  // ============ LISTA DE ESPERA ============
  function initWaitlist() {
    var form = $('#waitlistForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#wlName').value || 'pessoa';
      var email = $('#wlEmail').value;
      $('#waitlist').innerHTML =
        '<div class="card waitlist__success"><span class="ico">✓</span>' +
        '<h3>Você está na lista! 🎉</h3>' +
        '<p>Obrigado, <strong>' + esc(name) + '</strong>. Avisaremos em <strong>' + esc(email) +
        '</strong> assim que a CashFree estiver disponível.</p>' +
        '<button class="btn btn--secondary" id="wlReset" style="margin-top:20px">Cadastrar outro e-mail</button></div>';
      $('#wlReset').addEventListener('click', function () { location.hash = '#cta'; location.reload(); });
    });
  }

  // ============ INIT ============
  document.addEventListener('DOMContentLoaded', function () {
    $('#year').textContent = new Date().getFullYear();
    initNav();
    initStatic();
    initDashboard();
    initStores();
    initExtension();
    initComparison();
    initPlans();
    initAuthModals();
    initSimulator();
    initArchitecture();
    initWaitlist();
  });
})();