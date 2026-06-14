/* =============================================================
   CashFree — app.js
   Cobre todas as funcionalidades interativas do site.
   ============================================================= */

/* ──────────────────────────────────────────────
   UTILITÁRIO: Toast de notificação
   ────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.cf-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cf-toast';

  const colors = {
    success: { bg: '#10B981', icon: '✔' },
    error: { bg: '#EF4444', icon: '✖' },
    info: { bg: '#3B82F6', icon: 'ℹ' },
    warning: { bg: '#F97316', icon: '⚠' },
  };
  const c = colors[type] || colors.success;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    background: c.bg,
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: '9999',
    opacity: '0',
    transform: 'translateY(12px)',
    transition: 'opacity .25s, transform .25s',
    maxWidth: '340px',
    fontFamily: 'Inter, sans-serif',
  });
  toast.innerHTML = `<span style="font-size:16px">${c.icon}</span> ${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 280);
  }, 3200);
}

/* ──────────────────────────────────────────────
   UTILITÁRIO: Modal simples
   ────────────────────────────────────────────── */
/* ──────────────────────────────────────────────
   UTILITÁRIO: Modal simples (Corrigido: Renderização Condicional)
   ────────────────────────────────────────────── */
function showModal({ title, body, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, type = 'default' }) {
  const overlay = document.createElement('div');
  overlay.className = 'cf-modal-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0',
    background: 'rgba(15,23,42,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: '10000', padding: '20px',
  });

  const confirmBg = type === 'danger'
    ? 'linear-gradient(135deg,#EF4444,#DC2626)'
    : 'linear-gradient(135deg,#10B981,#059669)';

  // REGRA DE RENDERIZAÇÃO: Só cria o HTML do botão de cancelamento se a label não for vazia
  const cancelBtnHTML = cancelLabel
    ? `<button class="cf-modal-cancel" style="background:none;border:1px solid #E2E8F0;border-radius:8px;
      padding:9px 18px;font-size:14px;font-weight:500;cursor:pointer;color:#0F172A;
      transition:border-color .15s">${cancelLabel}</button>`
    : ''; // Retorna vazio se não houver texto

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:28px;max-width:420px;width:100%;
                box-shadow:0 20px 60px rgba(15,23,42,0.22);font-family:Inter,sans-serif;">
      <h3 style="font-size:17px;font-weight:700;color:#0F172A;margin-bottom:10px">${title}</h3>
      <p style="font-size:14px;color:#64748B;line-height:1.6;margin-bottom:22px">${body}</p>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        ${cancelBtnHTML}
        <button class="cf-modal-confirm" style="background:${confirmBg};color:#fff;border:none;
          border-radius:8px;padding:9px 18px;font-size:14px;font-weight:600;cursor:pointer;
          box-shadow:0 2px 8px rgba(16,185,129,0.28);transition:filter .15s">${confirmLabel}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Adiciona o evento de fechar apenas se o botão de cancelar realmente existir no DOM
  const cancelBtnElement = overlay.querySelector('.cf-modal-cancel');
  if (cancelBtnElement) {
    cancelBtnElement.onclick = () => overlay.remove();
  }

  overlay.querySelector('.cf-modal-confirm').onclick = () => {
    overlay.remove();
    if (typeof onConfirm === 'function') onConfirm();
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

/* ──────────────────────────────────────────────
   1. NAVEGAÇÃO LATERAL
   ────────────────────────────────────────────── */
(function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pages = document.querySelectorAll('.page');
  const topbarTitle = document.getElementById('topbarTitle');

  const titles = {
    'visao-geral': 'Visão Geral',
    'cashbacks': 'Cashbacks',
    'pontos': 'Pontos',
    'extrato': 'Extrato',
    'resgates': 'Resgates',
    'alertas': 'Alertas',
    'contas': 'Contas Conectadas',
    'preferencias': 'Preferências',
    'perfil': 'Perfil',
    'ajuda': 'Ajuda',
  };

  function navigateTo(target) {
    navItems.forEach(n => n.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById('page-' + target);
    if (!targetPage) return;

    const activeNav = document.querySelector(`.nav-item[data-page="${target}"]`);
    if (activeNav) activeNav.classList.add('active');
    targetPage.classList.add('active');
    if (topbarTitle) topbarTitle.textContent = titles[target] || target;
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  /* Links internos das cards ("Ver extrato completo →", "Ver todos os alertas →") */
  document.querySelectorAll('.link-small').forEach(link => {
    const text = link.textContent.toLowerCase();
    if (text.includes('extrato')) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', () => navigateTo('extrato'));
    } else if (text.includes('alertas')) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', () => navigateTo('alertas'));
    }
  });

  /* "Alertas importantes" na visão geral: seta → navega para alertas */
  document.querySelectorAll('.alerta-item span').forEach(arrow => {
    arrow.style.cursor = 'pointer';
    arrow.addEventListener('click', () => navigateTo('alertas'));
  });

  /* Botão "Conectar nova conta" da topbar → página contas */
  const btnConnect = document.querySelector('.btn-connect');
  if (btnConnect) {
    btnConnect.addEventListener('click', () => navigateTo('contas'));
  }

  /* Logout */
  const navLogout = document.querySelector('.nav-logout');
  if (navLogout) {
    navLogout.addEventListener('click', () => {
      showModal({
        title: 'Sair da conta',
        body: 'Tem certeza que deseja encerrar a sessão?',
        confirmLabel: 'Sair',
        cancelLabel: 'Cancelar',
        type: 'danger',
        onConfirm: () => showToast('Sessão encerrada. Até logo!', 'info'),
      });
    });
  }

  /* Expor para uso global */
  window.navigateTo = navigateTo;
})();

/* ──────────────────────────────────────────────
   2. TABS (Visão Geral + Cashbacks/Pontos)
   ────────────────────────────────────────────── */
(function initTabs() {
  /* Tabs da Visão Geral: filtram a tabela por tipo */
  const overviewTabGroup = document.querySelector('#page-visao-geral .tabs');
  if (overviewTabGroup) {
    const rows = document.querySelectorAll('#page-visao-geral tbody tr');

    overviewTabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        overviewTabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.textContent.trim().toLowerCase();
        rows.forEach(row => {
          const badgeEl = row.querySelector('.badge');
          const badge = badgeEl ? badgeEl.textContent.trim().toLowerCase() : '';
          const expiraEl = row.querySelectorAll('td')[3];
          const expira = expiraEl ? expiraEl.textContent.trim() : '';

          let show = false;
          if (filter === 'todos') {
            show = true;
          } else if (filter === 'cashbacks') {
            show = badge.includes('cashback');
          } else if (filter === 'pontos') {
            show = badge.includes('pontos');
          } else if (filter === 'em breve para expirar') {
            show = expira !== '—' && expira !== '';
          } else if (filter === 'expirados') {
            show = false; // nenhum expirado nos dados de exemplo
          }
          row.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* Tabs genéricas em outras páginas (sem filtro de tabela) */
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    if (tabGroup === document.querySelector('#page-visao-geral .tabs')) return;
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });
})();

/* ──────────────────────────────────────────────
   3. BUSCA / FILTRO NAS TABELAS
   ────────────────────────────────────────────── */
(function initSearch() {
  document.querySelectorAll('.search-box input').forEach(input => {
    const card = input.closest('.card') || input.closest('.page');
    if (!card) return;
    const tbody = card.querySelector('tbody');
    if (!tbody) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      tbody.querySelectorAll('tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  });
})();

/* ──────────────────────────────────────────────
   4. PAGINAÇÃO (Extrato)
   ────────────────────────────────────────────── */
(function initPagination() {
  document.querySelectorAll('.pagination').forEach(pagination => {
    const pageBtns = pagination.querySelectorAll('.page-btn');

    pageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        /* Botões numéricos */
        if (!isNaN(parseInt(btn.textContent))) {
          pageBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const pageNum = parseInt(btn.textContent);
          const info = pagination.querySelector('span');
          if (info && info.textContent.includes('movimentações')) {
            const perPage = 7;
            const total = 48;
            const from = (pageNum - 1) * perPage + 1;
            const to = Math.min(pageNum * perPage, total);
            info.textContent = `Mostrando ${from} a ${to} de ${total} movimentações`;
          }
          if (info && info.textContent.includes('programas')) {
            const perPage = 8;
            const total = 12;
            const from = (pageNum - 1) * perPage + 1;
            const to = Math.min(pageNum * perPage, total);
            info.textContent = `Mostrando ${from} a ${to} de ${total} programas`;
          }
        }

        /* Navegação ‹ › */
        if (btn.textContent === '‹') {
          const active = pagination.querySelector('.page-btn.active');
          if (active && active.previousElementSibling && !isNaN(parseInt(active.previousElementSibling.textContent))) {
            active.previousElementSibling.click();
          }
        }
        if (btn.textContent === '›') {
          const active = pagination.querySelector('.page-btn.active');
          if (active && active.nextElementSibling && !isNaN(parseInt(active.nextElementSibling.textContent))) {
            active.nextElementSibling.click();
          }
        }
      });
    });
  });
})();

/* ──────────────────────────────────────────────
   5. ARQUITETURA DE ESTADO CENTRALIZADA (SSOT)
   ────────────────────────────────────────────── */
const defaultResgatesState = {
  disponivel: 142.60,
  totalResgatado: 387.20,
  historico: [
    { data: 'Ontem, 18:30', origem: 'Méliuz', valor: 50.00, destino: 'Pix', status: 'concluido' },
    { data: '12/05/2026', origem: 'Amazon', valor: 80.00, destino: 'Conta bancária', status: 'concluido' },
    { data: '03/05/2026', origem: 'Shopee', valor: 30.00, destino: 'Pix', status: 'pendente' }
  ]
};

const defaultPontosState = {
  totalPontos: 12450,
  expirando: 5440,
  ativos: 4,
  programas: {
    'livelo': { nomeOriginal: 'Livelo', pontos: 5200, valor: 52.00, dataExp: '18/06/2026', status: 'ativo', resgatado: false },
    'itaú': { nomeOriginal: 'Itaú', pontos: 3100, valor: 31.00, dataExp: '18/06/2026', status: 'ativo', resgatado: false },
    'esfera': { nomeOriginal: 'Esfera', pontos: 4150, valor: 41.50, dataExp: '10/05/2026', status: 'expirado', resgatado: false },
    'nubank rewards': { nomeOriginal: 'Nubank Rewards', pontos: 0, valor: 0.00, dataExp: '12/05/2026', status: 'ativo', resgatado: false }
  }
};

// MODO DESENVOLVIMENTO: Centralizado para evitar limpezas duplicadas e conflitos sequenciais
localStorage.removeItem('cf_resgates_state');
localStorage.removeItem('cf_pontos_state');

// Inicialização segura no LocalStorage
if (!localStorage.getItem('cf_resgates_state')) localStorage.setItem('cf_resgates_state', JSON.stringify(defaultResgatesState));
if (!localStorage.getItem('cf_pontos_state')) localStorage.setItem('cf_pontos_state', JSON.stringify(defaultPontosState));

/* ──────────────────────────────────────────────
   MOTOR DE ANIMAÇÃO E SINCRONIZAÇÃO GLOBAL
   ────────────────────────────────────────────── */
const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatPoints = (val) => val.toLocaleString('pt-BR') + ' pts';

const animateValue = (element, end, type = 'points', duration = 800) => {
  if (!element) return;

  const parseCurrency = (str) => parseFloat(str.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  const parsePoints = (str) => parseInt(str.replace(/[^\d]/g, ''), 10) || 0;

  const start = type === 'currency' ? parseCurrency(element.textContent) : parsePoints(element.textContent);
  if (start === end) {
    if (type === 'currency') element.textContent = formatCurrency(end);
    else if (type === 'points') element.textContent = formatPoints(end);
    else element.textContent = end;
    return;
  }

  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    const current = start + ease * (end - start);

    if (type === 'currency') element.textContent = formatCurrency(current);
    else if (type === 'points') element.textContent = formatPoints(Math.floor(current));
    else element.textContent = Math.floor(current);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      if (type === 'currency') element.textContent = formatCurrency(end);
      if (type === 'points') element.textContent = formatPoints(end);
      if (type === 'integer') element.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
};

// Varre a interface atualizando todos os indicadores simultaneamente a partir da única fonte de dados
window.refreshAllVisualBalances = function (animate = true) {
  const resgates = JSON.parse(localStorage.getItem('cf_resgates_state'));
  const pontos = JSON.parse(localStorage.getItem('cf_pontos_state'));

  // Aba Resgates
  const pageResgates = document.getElementById('page-resgates');
  if (pageResgates) {
    const cards = pageResgates.querySelectorAll('.mini-card .big');
    if (animate) {
      animateValue(cards[0], resgates.disponivel, 'currency');
      animateValue(cards[1], resgates.totalResgatado, 'currency');
    } else {
      if (cards[0]) cards[0].textContent = formatCurrency(resgates.disponivel);
      if (cards[1]) cards[1].textContent = formatCurrency(resgates.totalResgatado);
    }
  }

  // Aba Pontos
  const pagePontos = document.getElementById('page-pontos');
  if (pagePontos) {
    const cards = pagePontos.querySelectorAll('.mini-card .big');
    if (animate) {
      animateValue(cards[0], pontos.totalPoints || pontos.totalPontos, 'points');
      animateValue(cards[1], pontos.expirando, 'points');
      animateValue(cards[2], pontos.ativos, 'integer');
    } else {
      if (cards[0]) cards[0].textContent = formatPoints(pontos.totalPoints || pontos.totalPontos);
      if (cards[1]) cards[1].textContent = formatPoints(pontos.expirando);
      if (cards[2]) cards[2].textContent = pontos.ativos;
    }
  }

  // Aba Visão Geral
  const pageVisao = document.getElementById('page-visao-geral');
  if (pageVisao) {
    const stats = pageVisao.querySelectorAll('.stat-value');
    const totalCashbackGlobal = resgates.disponivel + resgates.totalResgatado;
    if (animate) {
      animateValue(stats[0], totalCashbackGlobal, 'currency');
      animateValue(stats[1], pontos.totalPoints || pontos.totalPontos, 'points');
      animateValue(stats[2], pontos.expirando, 'points');
    } else {
      if (stats[0]) stats[0].textContent = formatCurrency(totalCashbackGlobal);
      if (stats[1]) stats[1].textContent = formatPoints(pontos.totalPoints || pontos.totalPontos);
      if (stats[2]) stats[2].textContent = formatPoints(pontos.expirando);
    }
  }
};

/* ──────────────────────────────────────────────
   MODULO: GERENCIAMENTO DE RESGATES COMPLETO
   ────────────────────────────────────────────── */
(function initResgatesModulo() {
  const page = document.getElementById('page-resgates');
  if (!page) return;

  const form = page.querySelector('.card[style*="max-width"]');
  const selectOrigem = form.querySelector('select');
  const inputValor = form.querySelector('input[type="number"]');
  const selectDestino = form.querySelectorAll('select')[1];
  const btnSolicitar = form.querySelector('.btn-primary');
  const tbodyHistorico = page.querySelector('table tbody');

  const getFormattedDate = () => {
    const now = new Date();
    return `Hoje, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const renderHistorico = () => {
    const resgates = JSON.parse(localStorage.getItem('cf_resgates_state'));
    tbodyHistorico.innerHTML = '';
    resgates.historico.forEach(item => {
      const tr = document.createElement('tr');
      const isConcluido = item.status === 'concluido' || item.status === 'convertido';
      const statusBadge = isConcluido
        ? `<span class="badge" style="background:#dcfce7;color:#16a34a">✔ Concluído</span>`
        : `<span class="badge" style="background:#fef9c3;color:#ca8a04"><span class="material-symbols-rounded">hourglass_top</span> Pendente</span>`;

      tr.innerHTML = `
        <td>${item.data}</td>
        <td>${item.origem}</td>
        <td>${formatCurrency(item.valor)}</td>
        <td>${item.destino}</td>
        <td>${statusBadge}</td>
      `;
      tbodyHistorico.appendChild(tr);
    });
  };

  let errorElement = document.createElement('div');
  Object.assign(errorElement.style, {
    color: '#EF4444', fontSize: '12px', fontWeight: '500', marginTop: '6px',
    opacity: '0', height: '0', overflow: 'hidden',
    transition: 'opacity 0.2s ease, transform 0.2s ease', transform: 'translateY(-4px)'
  });
  inputValor.parentNode.appendChild(errorElement);

  const showError = (message) => {
    errorElement.textContent = `* ${message}`;
    errorElement.style.height = 'auto';
    inputValor.style.borderColor = '#EF4444';
    requestAnimationFrame(() => {
      errorElement.style.opacity = '1';
      errorElement.style.transform = 'translateY(0)';
    });
  };

  const hideError = () => {
    errorElement.style.opacity = '0';
    errorElement.style.transform = 'translateY(-4px)';
    inputValor.style.borderColor = '';
    setTimeout(() => { errorElement.style.height = '0'; }, 200);
  };

  // VALIDAÇÃO EM TEMPO REAL CONECTADA À FONTE ÚNICA DE VERDADE
  const validateInput = () => {
    const resgates = JSON.parse(localStorage.getItem('cf_resgates_state'));
    const val = parseFloat(inputValor.value);

    if (isNaN(val) || val <= 0) {
      hideError();
      return false;
    }
    if (val > resgates.disponivel) {
      showError('Excede o limite disponível para resgate');
      return false;
    }
    if (val < 20) {
      showError('O valor mínimo para resgate é R$ 20,00');
      return false;
    }
    hideError();
    return true;
  };

  inputValor.addEventListener('input', validateInput);

  btnSolicitar.addEventListener('click', (e) => {
    e.preventDefault();
    const resgates = JSON.parse(localStorage.getItem('cf_resgates_state'));
    const valStr = inputValor.value;

    if (!valStr || !validateInput()) {
      inputValor.focus();
      if (!valStr) showError('Informe um valor para resgate');
      return;
    }

    const valorResgate = parseFloat(valStr);
    const origemTexto = selectOrigem.options[selectOrigem.selectedIndex].text.split('—')[0].trim();
    const destinoTexto = selectDestino.options[selectDestino.selectedIndex].text.split(':')[0].trim();

    // Mutação segura da estrutura central
    resgates.disponivel -= valorResgate;
    resgates.totalResgatado += valorResgate;
    resgates.historico.unshift({
      data: getFormattedDate(),
      origem: origemTexto,
      valor: valorResgate,
      destino: destinoTexto,
      status: 'pendente'
    });

    localStorage.setItem('cf_resgates_state', JSON.stringify(resgates));

    window.refreshAllVisualBalances(true);
    renderHistorico();
    inputValor.value = '';

    if (typeof showToast === 'function') {
      showToast('Resgate solicitado com sucesso! 💸', 'success');
    }
  });

  renderHistorico();
})();

/* ──────────────────────────────────────────────
   MODULO CENTRAL DE PONTOS (SSOT INTERCONNECTED)
   ────────────────────────────────────────────── */
(function initCentralDePontos() {
  const pagePontos = document.getElementById('page-pontos');
  const pageVisaoGeral = document.getElementById('page-visao-geral');
  if (!pagePontos || !pageVisaoGeral) return;

  const tabelaPontos = pagePontos.querySelector('table tbody');
  const tabelaVisaoGeral = pageVisaoGeral.querySelector('table tbody');

  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === '—') return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatPoints = (val) => val.toLocaleString('pt-BR') + ' pts';

  const recalculateMetrics = () => {
    const pontos = JSON.parse(localStorage.getItem('cf_pontos_state'));
    let novoTotal = 0, novoExpirando = 0, novosAtivos = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dataLimite = new Date(today);
    dataLimite.setDate(today.getDate() + 30);

    for (const key in pontos.programas) {
      const prog = pontos.programas[key];
      if (prog.resgatado) { prog.status = 'resgatado'; continue; }

      const expDate = parseDate(prog.dataExp);
      if (expDate && expDate < today) { prog.status = 'expirado'; continue; }

      prog.status = 'ativo';
      novoTotal += prog.pontos;
      if (prog.pontos > 0) novosAtivos++;
      if (expDate && expDate <= dataLimite) novoExpirando += prog.pontos;
    }

    pontos.totalPontos = novoTotal;
    pontos.expirando = novoExpirando;
    pontos.ativos = novosAtivos;
    localStorage.setItem('cf_pontos_state', JSON.stringify(pontos));
  };

  const syncTablesUI = () => {
    const pontos = JSON.parse(localStorage.getItem('cf_pontos_state'));

    // Atualiza a linha independente de qual tabela seja (estruturas idênticas no HTML)
    const updateRow = (row, pData) => {
      const tds = row.querySelectorAll('td');
      const btn = row.querySelector('.btn-detail');

      const idxSaldo = 1;
      const idxValor = 2;
      const idxExpira = 3;

      if (!tds[idxExpira] || !tds[idxSaldo] || !tds[idxValor]) return;

      tds[idxExpira].innerHTML = `<span style="color:var(--text-muted);font-weight:600">${pData.dataExp}</span>`;

      if (pData.status === 'expirado') {
        tds[idxSaldo].innerHTML = `<span style="text-decoration:line-through;color:#EF4444">${formatPoints(pData.pontos)}</span>`;
        tds[idxValor].textContent = formatCurrency(pData.valor);
        btn.textContent = 'Expirado';
        btn.style.cssText = 'background:rgba(239, 68, 68, 0.1);color:#EF4444;border-color:#EF4444;pointer-events:none;font-weight:600';
      } else if (pData.status === 'resgatado') {
        tds[idxSaldo].textContent = formatPoints(0);
        tds[idxValor].textContent = formatCurrency(0);
        btn.textContent = '✔ Resgatado';
        btn.style.cssText = 'background:#10B981;color:#ffffff;border-color:#10B981;pointer-events:none;box-shadow:0 2px 6px rgba(16, 185, 129, 0.2)';
      } else if (pData.pontos === 0) {
        tds[idxSaldo].textContent = formatPoints(0);
        tds[idxValor].textContent = formatCurrency(0);
        btn.textContent = 'Sem saldo';
        btn.style.cssText = 'opacity:0.5;pointer-events:none';
      } else {
        tds[idxSaldo].textContent = formatPoints(pData.pontos);
        tds[idxValor].textContent = formatCurrency(pData.valor);
        btn.textContent = 'Resgatar';
        btn.style.cssText = '';
      }
    };

    // Varre e atualiza AMBAS as tabelas simultaneamente
    [tabelaPontos, tabelaVisaoGeral].forEach(tabela => {
      if (!tabela) return;
      tabela.querySelectorAll('tr').forEach(row => {
        const el = row.querySelector('.prog-name');
        if (el && pontos.programas[el.textContent.trim().toLowerCase()]) {
          updateRow(row, pontos.programas[el.textContent.trim().toLowerCase()]);
        }
      });
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (!btn || btn.textContent.trim() !== 'Resgatar') return;

    const row = btn.closest('tr');
    const progNameEl = row ? row.querySelector('.prog-name') : null;
    if (!progNameEl) return;

    const nome = progNameEl.textContent.trim().toLowerCase();
    const pontos = JSON.parse(localStorage.getItem('cf_pontos_state'));
    const pData = pontos.programas[nome];

    if (!pData || pData.status !== 'ativo' || pData.pontos <= 0) return;

    const resgates = JSON.parse(localStorage.getItem('cf_resgates_state'));
    const valorConvertido = pData.valor;
    const pontosConvertidos = pData.pontos;

    // Mutação sincronizada das tabelas e estados internos
    pData.resgatado = true;
    pData.pontos = 0;
    pData.valor = 0;

    resgates.disponivel += valorConvertido;
    resgates.historico.unshift({
      data: `Hoje, ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      origem: `${pData.nomeOriginal} (Pontos)`,
      valor: valorConvertido,
      destino: 'Saldo CashFree',
      status: 'convertido'
    });

    localStorage.setItem('cf_pontos_state', JSON.stringify(pontos));
    localStorage.setItem('cf_resgates_state', JSON.stringify(resgates));

    recalculateMetrics();
    syncTablesUI();

    if (typeof window.refreshAllVisualBalances === 'function') {
      window.refreshAllVisualBalances(true);
    }

    if (typeof showToast === 'function') {
      showToast(`Conversão de ${pontosConvertidos.toLocaleString('pt-BR')} pontos realizada!`, 'success');
    }
  });

  recalculateMetrics();
  syncTablesUI();
})();

/* ──────────────────────────────────────────────
   MODULO: SAQUES DE CASHBACK (Aba Visão Geral)
   ────────────────────────────────────────────── */
(function initSaquesCashback() {
  const pageVisaoGeral = document.getElementById('page-visao-geral');
  if (!pageVisaoGeral) return;

  const tabelaVisaoGeral = pageVisaoGeral.querySelector('table tbody');
  let stateCashback = JSON.parse(localStorage.getItem('cf_cashback_state')) || {};

  const syncCashbackUI = () => {
    tabelaVisaoGeral.querySelectorAll('tr').forEach(row => {
      const badge = row.querySelector('.badge');
      if (!badge || !badge.textContent.includes('Cashback')) return;

      const nomeEl = row.querySelector('.prog-name');
      if (!nomeEl) return;

      const nome = nomeEl.textContent.trim().toLowerCase();
      const btn = row.querySelector('.btn-detail');
      if (!btn) return;

      if (stateCashback[nome]) {
        row.querySelectorAll('td')[2].textContent = formatCurrency(0);
        btn.textContent = '✔ Resgatado';
        btn.style.cssText = 'background:#10B981;color:#ffffff;border-color:#10B981;pointer-events:none;box-shadow:0 2px 6px rgba(16, 185, 129, 0.2)';
      } else if (btn.textContent.trim() !== '✔ Resgatado') {
        btn.textContent = 'Sacar';
      }
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (!btn || btn.textContent.trim() !== 'Sacar') return;

    const row = btn.closest('tr');
    const badge = row ? row.querySelector('.badge') : null;
    if (!badge || !badge.textContent.includes('Cashback')) return;

    const nomeOriginal = row.querySelector('.prog-name').textContent.trim();
    const nome = nomeOriginal.toLowerCase();
    if (stateCashback[nome]) return;

    const tds = row.querySelectorAll('td');
    const valorSaque = parseFloat(tds[2].textContent.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
    if (valorSaque <= 0) return;

    stateCashback[nome] = true;
    localStorage.setItem('cf_cashback_state', JSON.stringify(stateCashback));

    const resgates = JSON.parse(localStorage.getItem('cf_resgates_state'));
    resgates.disponivel += valorSaque;
    resgates.historico.unshift({
      data: `Hoje, ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      origem: `${nomeOriginal} (Cashback)`,
      valor: valorSaque,
      destino: 'Saldo CashFree',
      status: 'concluido'
    });

    localStorage.setItem('cf_resgates_state', JSON.stringify(resgates));

    syncCashbackUI();
    window.refreshAllVisualBalances(true);

    if (typeof showToast === 'function') {
      showToast(`Saque de ${formatCurrency(valorSaque)} processado com sucesso!`, 'success');
    }
  });

  syncCashbackUI();
})();

// Inicialização de renderização visual sutil pós carregamento dos módulos
setTimeout(() => { window.refreshAllVisualBalances(false); }, 50);

/* ──────────────────────────────────────────────
   6. BOTÕES DE AÇÃO NAS TABELAS
   ────────────────────────────────────────────── */
(function initTableActions() {
  /* "Ver detalhes" / "Ver mais" → Visão Geral e Pontos */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-detail');
    if (!btn) return;

    const row = btn.closest('tr');
    if (!row) return;
    const progName = row.querySelector('.prog-name');
    const name = progName ? progName.textContent : 'programa';
    const badge = row.querySelector('.badge');
    const tipo = badge ? badge.textContent.trim() : '';
    const tds = row.querySelectorAll('td');

    const label = btn.textContent.trim();

    if (label === 'Sacar') {
      const saldo = tds[2] ? tds[2].textContent.trim() : '';
      showModal({
        title: `Sacar — ${name}`,
        body: `Valor disponível para saque: <strong>${saldo}</strong>.<br>O valor será enviado via Pix em até 1 dia útil.`,
        confirmLabel: 'Confirmar saque',
        onConfirm: () => showToast(`Saque de ${name} solicitado! 💸`, 'success'),
      });

    } else if (label === 'Resgatar') {
      const pts = tds[1] ? tds[1].textContent.trim() : '';
      showModal({
        title: `Resgatar pontos — ${name}`,
        body: `Você tem <strong>${pts}</strong> disponíveis em ${name}.<br>Deseja resgatar agora?`,
        confirmLabel: 'Resgatar pontos',
        onConfirm: () => showToast(`Resgate de ${pts} de ${name} solicitado!`, 'success'),
      });

    } else {
      /* Ver detalhes / Ver mais */
      const saldo = tds[2] ? tds[2].textContent.trim() : '';
      const atualiz = tds[4] ? tds[4].textContent.trim() : '';
      showModal({
        title: `${name} — ${tipo}`,
        body: `<strong>Saldo:</strong> ${saldo}<br><strong>Última atualização:</strong> ${atualiz || 'N/D'}<br><br>Para mais detalhes, acesse o aplicativo da plataforma.`,
        confirmLabel: 'Fechar',
        cancelLabel: '',
        onConfirm: () => { },
      });
    }
  });
})();

/* ──────────────────────────────────────────────
   7. BOTÕES DE DESCONECTAR (Contas Conectadas)
   ────────────────────────────────────────────── */
(function initContas() {
  /* Botões "Desconectar" */
  document.querySelectorAll('#page-contas .btn-outline').forEach(btn => {
    if (btn.textContent.trim() !== 'Desconectar') return;
    btn.addEventListener('click', () => {
      const connItem = btn.closest('.conn-item');
      const name = connItem ? connItem.querySelector('h5')?.textContent : 'plataforma';
      showModal({
        title: `Desconectar ${name}`,
        body: `Tem certeza que deseja desconectar <strong>${name}</strong>? Seus dados históricos serão mantidos.`,
        confirmLabel: 'Desconectar',
        type: 'danger',
        onConfirm: () => {
          if (connItem) {
            connItem.style.opacity = '0.4';
            connItem.style.pointerEvents = 'none';
            const dot = connItem.querySelector('.status-dot');
            if (dot) { dot.classList.add('off'); }
            const p = connItem.querySelector('p');
            if (p) p.innerHTML = '<span class="status-dot off"></span>Desconectada';
            btn.textContent = 'Reconectar';
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            connItem.style.opacity = '1';
          }
          showToast(`${name} desconectada com sucesso.`, 'info');
        },
      });
    });
  });

  /* Botão "Reconectar" (criado dinamicamente acima) — usando delegação */
  document.addEventListener('click', e => {
    const btn = e.target.closest('#page-contas .btn-outline');
    if (!btn || btn.textContent.trim() !== 'Reconectar') return;
    const connItem = btn.closest('.conn-item');
    const name = connItem ? connItem.querySelector('h5')?.textContent : 'plataforma';
    showModal({
      title: `Reconectar ${name}`,
      body: `Deseja reconectar <strong>${name}</strong> e retomar a sincronização?`,
      confirmLabel: 'Reconectar',
      onConfirm: () => {
        if (connItem) {
          const dot = connItem.querySelector('.status-dot');
          if (dot) { dot.classList.remove('off'); }
          const p = connItem.querySelector('p');
          if (p) p.innerHTML = '<span class="status-dot"></span>Ativa';
          btn.textContent = 'Desconectar';
        }
        showToast(`${name} reconectada com sucesso!`, 'success');
      },
    });
  });

  /* Botão "+ Conectar nova plataforma" */
  const btnNova = document.querySelector('#page-contas .btn-primary');
  if (btnNova) {
    btnNova.addEventListener('click', () => {
      showModal({
        title: 'Conectar nova plataforma',
        body: 'Em breve você poderá conectar novas plataformas diretamente pelo painel. Por enquanto, acesse o aplicativo CashFree para adicionar uma nova conta.',
        confirmLabel: 'Entendi',
        cancelLabel: '',
        onConfirm: () => { },
      });
    });
  }
})();

/* ──────────────────────────────────────────────
   8. PREFERÊNCIAS — salvar
   ────────────────────────────────────────────── */
(function initPreferencias() {
  const page = document.getElementById('page-preferencias');
  if (!page) return;

  const btnSalvar = page.querySelector('.btn-primary');
  if (btnSalvar) {
    btnSalvar.addEventListener('click', () => {
      showToast('Preferências salvas com sucesso!', 'success');
    });
  }
})();

/* ──────────────────────────────────────────────
   9. PERFIL — salvar alterações / alterar senha / alterar foto
   ────────────────────────────────────────────── */
(function initPerfil() {
  const page = document.getElementById('page-perfil');
  if (!page) return;

  const btns = page.querySelectorAll('.btn-row button, .card button');

  btns.forEach(btn => {
    const label = btn.textContent.trim();

    if (label === 'Salvar alterações') {
      btn.addEventListener('click', () => {
        showToast('Dados pessoais atualizados com sucesso!', 'success');
      });
    }

    if (label === 'Alterar senha') {
      btn.addEventListener('click', () => {
        showModal({
          title: 'Alterar senha',
          body: 'Um e-mail de redefinição de senha será enviado para <strong>bárbara@email.com</strong>. Deseja continuar?',
          confirmLabel: 'Enviar e-mail',
          cancelLabel: '',
          onConfirm: () => showToast('E-mail de redefinição enviado! Verifique sua caixa de entrada.', 'info'),
        });
      });
    }

    if (label === 'Alterar foto') {
      btn.addEventListener('click', () => {
        showToast('Funcionalidade de upload de foto em breve!', 'info');
      });
    }
  });
})();

/* ──────────────────────────────────────────────
   10. AJUDA — chat ao vivo e e-mail
   ────────────────────────────────────────────── */
(function initAjuda() {
  const page = document.getElementById('page-ajuda');
  if (!page) return;

  const btns = page.querySelectorAll('button');
  btns.forEach(btn => {
    const label = btn.textContent.trim();

    if (label === 'Iniciar conversa') {
      btn.addEventListener('click', () => {
        showModal({
          title: 'Chat ao vivo',
          body: 'Nosso chat está disponível de seg–sex, 8h–20h.<br>Tempo médio de espera: <strong>3 minutos</strong>.<br>Deseja iniciar a conversa agora?',
          confirmLabel: 'Iniciar agora',
          onConfirm: () => showToast('Conectando ao suporte... Aguarde!', 'info'),
        });
      });
    }

    if (label === 'Enviar e-mail') {
      btn.addEventListener('click', () => {
        showModal({
          title: 'Enviar e-mail para o suporte',
          body: 'Você será redirecionado para o formulário de contato. Respondemos em até <strong>24 horas úteis</strong>.',
          confirmLabel: 'Abrir formulário',
          onConfirm: () => showToast('Formulário de contato aberto!', 'info'),
        });
      });
    }
  });
})();

/* ──────────────────────────────────────────────
   11. NOTIFICAÇÕES (sino na topbar)
   ────────────────────────────────────────────── */
(function initNotifications() {
  const notifEl = document.querySelector('.notif');
  if (!notifEl) return;

  const dot = notifEl.querySelector('.notif-dot');

  notifEl.addEventListener('click', () => {
    window.navigateTo('alertas');
    if (dot) dot.style.display = 'none';
  });
})();

/* ──────────────────────────────────────────────
   12. "INDIQUE E GANHE" (sidebar footer)
   ────────────────────────────────────────────── */
(function initInvite() {
  const inviteBtn = document.querySelector('.invite-btn');
  if (!inviteBtn) return;

  inviteBtn.addEventListener('click', () => {
    showModal({
      title: 'Indique e ganhe R$ 10,00',
      body: 'Seu link de indicação:<br><code style="background:#f1f5f9;padding:6px 10px;border-radius:6px;font-size:13px;display:block;margin-top:8px">cashfree.com.br/indique?ref=barbara2024</code><br><br>A cada amigo que se cadastrar, você ganha <strong>R$ 10,00</strong> de cashback!',
      confirmLabel: 'Copiar link',
      cancelLabel: 'Fechar',
      onConfirm: () => {
        navigator.clipboard?.writeText('https://cashfree.com.br/indique?ref=barbara2024')
          .then(() => showToast('Link copiado para a área de transferência!', 'success'))
          .catch(() => showToast('Link: cashfree.com.br/indique?ref=barbara2024', 'info'));
      },
    });
  });
})();

/* ──────────────────────────────────────────────
   13. AVATAR / USUÁRIO — menu rápido
   ────────────────────────────────────────────── */
(function initAvatar() {
  const avatar = document.querySelector('.avatar');
  const userLabel = document.querySelector('.user-label');

  [avatar, userLabel].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => window.navigateTo('perfil'));
    el.style.cursor = 'pointer';
  });
})();

/* ──────────────────────────────────────────────
   14. BOTÃO "EXPORTAR" no Extrato
   ────────────────────────────────────────────── */
(function initExtrato() {
  const page = document.getElementById('page-extrato');
  if (!page) return;

  page.querySelectorAll('.btn-ghost').forEach(btn => {
    if (btn.textContent.includes('Exportar')) {
      btn.addEventListener('click', () => {
        showModal({
          title: 'Exportar extrato',
          body: 'Escolha o formato de exportação. O arquivo será gerado com todas as movimentações do período selecionado.',
          confirmLabel: 'Exportar CSV',
          cancelLabel: 'Cancelar',
          onConfirm: () => showToast('Extrato exportado com sucesso!', 'success'),
        });
      });
    }

    if (btn.textContent.includes('Período')) {
      btn.addEventListener('click', () => {
        showToast('Filtro por período em breve!', 'info');
      });
    }
  });
})();

/* ──────────────────────────────────────────────
   15. FILTROS GHOST BUTTONS (Cashbacks, Visão Geral)
   ────────────────────────────────────────────── */
(function initFilterBtns() {
  document.querySelectorAll('.btn-ghost').forEach(btn => {
    if (btn.textContent.includes('Filtrar') || btn.textContent.includes('Ordenar')) {
      btn.addEventListener('click', () => {
        showToast('Filtros avançados em breve!', 'info');
      });
    }
  });
})();

/* ──────────────────────────────────────────────
   MÓDULO: PONTOS E INTEGRAÇÃO (Com Verificação de Expiração)
   ────────────────────────────────────────────── */
(function initPontosEIntegracaoAvançado() {
  localStorage.removeItem('cf_resgates_state');
  localStorage.removeItem('cf_pontos_state');
  const pagePontos = document.getElementById('page-pontos');
  const pageResgates = document.getElementById('page-resgates');

  if (!pagePontos) return;

  // 1. Elementos do DOM
  const cardsPontos = pagePontos.querySelectorAll('.mini-card .big');
  const cardTotalPontos = cardsPontos[0];
  const cardExpirando = cardsPontos[1];
  const cardAtivos = cardsPontos[2];
  const tabelaPontos = pagePontos.querySelector('table tbody');

  const cardDisponivelResgates = pageResgates ? pageResgates.querySelectorAll('.mini-card .big')[0] : null;
  const tbodyHistoricoResgates = pageResgates ? pageResgates.querySelectorAll('table tbody')[0] : null;

  // 2. Estado Inicial
  const defaultPontosState = {
    totalPontos: 12450,
    // Atualizamos o total expirando (2340 da Livelo + 3100 do Itaú = 5440)
    expirando: 5440,
    ativos: 4,
    programas: {
      'livelo': { pontos: 5200, valor: 52.00, expiraAcesso: 2340, resgatado: false },
      // Agora o Itaú tem 3100 pontos configurados como expirando
      'itaú': { pontos: 3100, valor: 31.00, expiraAcesso: 3100, resgatado: false },
      'esfera': { pontos: 4150, valor: 41.50, expiraAcesso: 0, resgatado: false },
      'nubank rewards': { pontos: 0, valor: 0.00, expiraAcesso: 0, resgatado: false }
    }
  };

  let statePontos = JSON.parse(localStorage.getItem('cf_pontos_state')) || defaultPontosState;
  let stateResgates = JSON.parse(localStorage.getItem('cf_resgates_state')) || {
    disponivel: 142.60, totalResgatado: 387.20, historico: []
  };

  // 3. Utilitários de Formatação
  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatPoints = (val) => val.toLocaleString('pt-BR') + ' pts';
  const getFormattedDate = () => {
    const now = new Date();
    return `Hoje, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Verificador de data passada dinâmica
  const checkIsExpired = (dateStr) => {
    if (!dateStr || dateStr === '—') return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date(2026, 5, 12); // Data atual do sistema
    return expiryDate < today;
  };

  const saveStates = () => {
    localStorage.setItem('cf_pontos_state', JSON.stringify(statePontos));
    localStorage.setItem('cf_resgates_state', JSON.stringify(stateResgates));
  };

  // 4. Animação de Valores (Count-up / Count-down)
  const animateValue = (element, start, end, type = 'points', duration = 800) => {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = start + ease * (end - start);

      if (type === 'currency') element.textContent = formatCurrency(current);
      else if (type === 'points') element.textContent = formatPoints(Math.floor(current));
      else element.textContent = Math.floor(current);

      if (progress < 1) window.requestAnimationFrame(step);
      else {
        if (type === 'currency') element.textContent = formatCurrency(end);
        if (type === 'points') element.textContent = formatPoints(end);
        if (type === 'integer') element.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  };

  // 5. Sincronização e Renderização da Interface
  const syncUI = () => {
    cardTotalPontos.textContent = formatPoints(statePontos.totalPontos);
    cardExpirando.textContent = formatPoints(statePontos.expirando);
    cardAtivos.textContent = statePontos.ativos;

    const rows = tabelaPontos.querySelectorAll('tr');
    rows.forEach(row => {
      const progNameEl = row.querySelector('.prog-name');
      if (!progNameEl) return;

      const progName = progNameEl.textContent.trim().toLowerCase();
      const pData = statePontos.programas[progName];
      const tds = row.querySelectorAll('td');
      const btn = row.querySelector('.btn-detail');
      const dateText = tds[3].textContent.trim();

      // REGRA 1: Verificar se a data está expirada
      if (checkIsExpired(dateText)) {
        btn.textContent = 'Expirado';
        btn.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        btn.style.color = '#EF4444';
        btn.style.borderColor = '#EF4444';
        btn.style.pointerEvents = 'none';
        btn.style.fontWeight = '600';
        return;
      }

      // REGRA 2: Verificar se já foi resgatado anteriormente
      if (pData && pData.resgatado) {
        tds[1].textContent = formatPoints(0);
        tds[2].textContent = formatCurrency(0);
        btn.textContent = '✔ Resgatado';
        btn.style.backgroundColor = '#10B981';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#10B981';
        btn.style.pointerEvents = 'none';
      }
    });
  };

  syncUI();

  // 6. Lógica do Clique de Resgate
  tabelaPontos.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (!btn || btn.textContent.trim() !== 'Resgatar') return;

    const row = btn.closest('tr');
    const progNameEl = row.querySelector('.prog-name');
    const progName = progNameEl.textContent.trim().toLowerCase();
    const nomeOriginal = progNameEl.textContent.trim();
    const pData = statePontos.programas[progName];

    if (!pData || pData.resgatado || pData.pontos <= 0) return;

    const pontosConvertidos = pData.pontos;
    const valorConvertido = pData.valor;
    const pontosExpirando = pData.expiraAcesso;

    const oldTotalPontos = statePontos.totalPontos;
    const oldExpirando = statePontos.expirando;
    const oldAtivos = statePontos.ativos;

    // Atualiza Estado Pontos
    statePontos.totalPontos -= pontosConvertidos;
    statePontos.expirando -= pontosExpirando;
    statePontos.ativos = Math.max(0, statePontos.ativos - 1);

    pData.pontos = 0;
    pData.valor = 0;
    pData.expiraAcesso = 0;
    pData.resgatado = true;

    const oldDisponivelResgates = stateResgates.disponivel;
    stateResgates.disponivel += valorConvertido;

    stateResgates.historico.unshift({
      data: getFormattedDate(),
      origem: `${nomeOriginal} (Pontos)`,
      valor: valorConvertido,
      destino: 'Saldo CashFree',
      status: 'convertido'
    });

    saveStates();

    // Executa Animações de Transição
    animateValue(cardTotalPontos, oldTotalPontos, statePontos.totalPontos, 'points');
    animateValue(cardExpirando, oldExpirando, statePontos.expirando, 'points');
    animateValue(cardAtivos, oldAtivos, statePontos.ativos, 'integer');

    const tds = row.querySelectorAll('td');
    tds[1].style.transition = 'opacity 0.3s';
    tds[2].style.transition = 'opacity 0.3s';
    tds[1].style.opacity = '0';
    tds[2].style.opacity = '0';

    setTimeout(() => {
      tds[1].textContent = formatPoints(0);
      tds[2].textContent = formatCurrency(0);
      tds[1].style.opacity = '1';
      tds[2].style.opacity = '1';
    }, 300);

    btn.textContent = '✔ Resgatado';
    btn.style.backgroundColor = '#10B981';
    btn.style.color = '#ffffff';
    btn.style.borderColor = '#10B981';
    btn.style.pointerEvents = 'none';

    if (cardDisponivelResgates) {
      animateValue(cardDisponivelResgates, oldDisponivelResgates, stateResgates.disponivel, 'currency');
    }

    if (tbodyHistoricoResgates) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${getFormattedDate()}</td>
        <td>${nomeOriginal} (Pontos)</td>
        <td><span style="color:#10B981;font-weight:600">+ ${formatCurrency(valorConvertido)}</span></td>
        <td>Saldo CashFree</td>
        <td><span class="badge" style="background:#dbeafe;color:#2563eb">✔ Convertido</span></td>
      `;
      tbodyHistoricoResgates.prepend(tr);
    }

    if (typeof showToast === 'function') {
      showToast(`Conversão de ${pontosConvertidos.toLocaleString('pt-BR')} pontos realizada com sucesso!`, 'success');
    }
  });
})();

/* ──────────────────────────────────────────────
   MÓDULO: PERFIL E SINCRONIZAÇÃO DE USUÁRIO (Com Modo DEV e Logout Dinâmico)
   ────────────────────────────────────────────── */
// Flag de controle de persistência para ambiente de testes
const DEV_MODE_PROFILE = true;

(function initUserSync() {
  const pagePerfil = document.getElementById('page-perfil');
  if (!pagePerfil) return;

  // 1. Elementos Globais
  const topbarLabel = document.querySelector('.user-label');
  const topbarAvatar = document.querySelector('.avatar');
  const navLogout = document.querySelector('.nav-logout');

  // 2. Elementos Locais (Card Resumo)
  const profileCard = pagePerfil.querySelector('.card');
  const bigAvatar = profileCard ? profileCard.querySelector('.profile-avatar-big') : null;
  const cardName = profileCard ? profileCard.querySelector('div[style*="font-weight:700"]') : null;
  const cardEmail = profileCard ? profileCard.querySelector('div[style*="margin-top:3px"]') : null;

  // 3. Elementos Locais (Formulário)
  const formInputs = pagePerfil.querySelectorAll('.form-input');
  const inputName = formInputs.length > 0 ? formInputs[0] : null;
  const inputEmail = formInputs.length > 1 ? formInputs[1] : null;

  const btnsPrimary = pagePerfil.querySelectorAll('.btn-primary');
  const btnSave = Array.from(btnsPrimary).find(btn => btn.textContent.includes('Salvar alterações'));

  // 4. Configuração de Valores Padrão do Sistema
  const defaultProfile = {
    fullName: 'Bárbara',
    email: 'barbara@email.com'
  };

  let userState = {};

  // 5. Utilitários de Extração Visual
  const getFirstName = (fullName) => fullName ? fullName.trim().split(' ')[0] : '';
  const getInitial = (name) => name ? name.trim().charAt(0).toUpperCase() : '';

  // 6. Camada de Controle de Dados (Persistência condicional ao modo DEV)
  const loadProfileData = () => {
    if (DEV_MODE_PROFILE) {
      localStorage.removeItem('cf_user_profile'); // Limpa resquícios de testes anteriores
      userState = { ...defaultProfile };
    } else {
      const saved = localStorage.getItem('cf_user_profile');
      userState = saved ? JSON.parse(saved) : { ...defaultProfile };
    }
  };

  const saveProfileData = (newName, newEmail) => {
    userState.fullName = newName.trim();
    userState.email = newEmail.trim().toLowerCase();

    // Só grava no disco rígido do navegador se o modo desenvolvimento estiver desligado
    if (!DEV_MODE_PROFILE) {
      localStorage.setItem('cf_user_profile', JSON.stringify(userState));
    }
  };

  // 7. Sincronização e Renderização Unificada da Interface
  const updateProfileUI = () => {
    const firstName = getFirstName(userState.fullName);
    const initial = getInitial(userState.fullName);

    if (topbarLabel) topbarLabel.textContent = `Olá, ${firstName}`;
    if (topbarAvatar) topbarAvatar.textContent = initial;

    if (cardName) cardName.textContent = userState.fullName;
    if (cardEmail) cardEmail.textContent = userState.email;
    if (bigAvatar) bigAvatar.textContent = initial;

    if (inputName && inputName.value !== userState.fullName) inputName.value = userState.fullName;
    if (inputEmail && inputEmail.value !== userState.email) inputEmail.value = userState.email;
  };

  // 8. Lógica de Validação do Campo de E-mail
  let emailErrorElement = null;
  if (inputEmail) {
    emailErrorElement = document.createElement('div');
    Object.assign(emailErrorElement.style, {
      color: '#EF4444', fontSize: '12px', fontWeight: '500', marginTop: '6px',
      opacity: '0', height: '0', overflow: 'hidden',
      transition: 'opacity 0.2s ease, transform 0.2s ease', transform: 'translateY(-4px)'
    });
    inputEmail.parentNode.appendChild(emailErrorElement);
  }

  const showEmailError = (message) => {
    if (!emailErrorElement) return;
    emailErrorElement.textContent = `* ${message}`;
    emailErrorElement.style.height = 'auto';
    inputEmail.style.borderColor = '#EF4444';
    requestAnimationFrame(() => {
      emailErrorElement.style.opacity = '1';
      emailErrorElement.style.transform = 'translateY(0)';
    });
  };

  const hideEmailError = () => {
    if (!emailErrorElement) return;
    emailErrorElement.style.opacity = '0';
    emailErrorElement.style.transform = 'translateY(-4px)';
    inputEmail.style.borderColor = '';
    setTimeout(() => { emailErrorElement.style.height = '0'; }, 200);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (inputEmail) {
    inputEmail.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val === '' || isValidEmail(val)) {
        hideEmailError();
      } else {
        showEmailError('Este e-mail não é válido');
      }
    });
  }

  // 9. Processamento de Salvamento das Alterações
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();

    const newName = inputName ? inputName.value.trim() : '';
    const newEmail = inputEmail ? inputEmail.value.trim() : '';

    if (!newName || !newEmail) {
      if (typeof showToast === 'function') showToast('Por favor, preencha nome e e-mail.', 'warning');
      return;
    }

    if (!isValidEmail(newEmail)) {
      showEmailError('Este e-mail não é válido');
      inputEmail.focus();
      return;
    }

    saveProfileData(newName, newEmail);
    updateProfileUI();

    if (typeof showToast === 'function') showToast('Perfil updated com sucesso!', 'success');

    const originalText = btnSave.textContent;
    btnSave.textContent = '✔ Salvo!';
    btnSave.style.pointerEvents = 'none';
    setTimeout(() => {
      btnSave.textContent = originalText;
      btnSave.style.pointerEvents = 'auto';
    }, 1500);
  };

  // 10. Interceptação Dinâmica do Botão "Sair" (Remove ouvintes antigos hardcoded)
  const setupDynamicLogout = () => {
    if (!navLogout) return;

    // Clonagem de nó para expurgar a função estática com strings fixas vinculada anteriormente
    const cleanLogoutBtn = navLogout.cloneNode(true);
    navLogout.parentNode.replaceChild(cleanLogoutBtn, navLogout);

    cleanLogoutBtn.addEventListener('click', () => {
      // Coleta os valores do estado mais recente computado na sessão atual
      const currentEmail = userState.email;
      const currentFirstName = getFirstName(userState.fullName);

      showModal({
        title: 'Sair da conta',
        body: `Tem certeza que deseja encerrar a sessão para o e-mail <strong>${currentEmail}</strong>?`,
        confirmLabel: 'Sair',
        cancelLabel: 'Cancelar',
        type: 'danger',
        onConfirm: () => showToast(`Sessão encerrada. Até logo, ${currentFirstName}!`, 'info'),
      });
    });
  };

  // 11. Inicialização do Ciclo de Vida do Módulo
  const initializeProfile = () => {
    loadProfileData();
    updateProfileUI();
    setupDynamicLogout();

    if (btnSave) {
      const newBtn = btnSave.cloneNode(true);
      btnSave.parentNode.replaceChild(newBtn, btnSave);
      newBtn.addEventListener('click', handleSaveProfile);
    }
  };

  initializeProfile();
})();


/* ──────────────────────────────────────────────
   MÓDULO: VISÃO GERAL (DASHBOARD SINCRONIZADO)
   ────────────────────────────────────────────── */
(function initDashboardSync() {
  const pageVisaoGeral = document.getElementById('page-visao-geral');
  if (!pageVisaoGeral) return;

  // 1. Elementos do DOM (Cards da Visão Geral)
  const statValues = pageVisaoGeral.querySelectorAll('.stat-value');
  const cardCashback = statValues[0];
  const cardPontos = statValues[1];
  const cardExpirando = statValues[2];
  const cardContas = statValues[3];

  // 2. Extratores de texto para número (Lê os valores estáticos do seu HTML)
  const parseCurrency = (str) => parseFloat(str.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  const parsePoints = (str) => parseInt(str.replace(/[^\d]/g, ''), 10) || 0;

  // Inicializa o estado lendo exatamente o que você digitou no HTML estático
  let prevStates = {
    cashback: parseCurrency(cardCashback.textContent),
    pontos: parsePoints(cardPontos.textContent),
    expirando: parsePoints(cardExpirando.textContent),
    contas: parseInt(cardContas.textContent) || 0
  };

  // 3. Utilitários de Formatação e Animação
  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatPoints = (val) => val.toLocaleString('pt-BR') + ' pts';

  const animateValue = (element, start, end, type = 'integer', duration = 800) => {
    if (!element || start === end) {
      if (type === 'currency') element.textContent = formatCurrency(end);
      else if (type === 'points') element.textContent = formatPoints(end);
      else element.textContent = end;
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = start + ease * (end - start);

      if (type === 'currency') element.textContent = formatCurrency(current);
      else if (type === 'points') element.textContent = formatPoints(Math.floor(current));
      else element.textContent = Math.floor(current);

      if (progress < 1) window.requestAnimationFrame(step);
      else {
        if (type === 'currency') element.textContent = formatCurrency(end);
        if (type === 'points') element.textContent = formatPoints(end);
        if (type === 'integer') element.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  };

  // 4. Calculadoras (Se o LocalStorage estiver vazio, usa os valores originais do HTML)
  const calculateTotalPoints = () => {
    const saved = localStorage.getItem('cf_pontos_state');
    if (!saved) return prevStates.pontos; // Mantém estático

    const statePontos = JSON.parse(saved);
    let totalAcumulado = 0;
    for (const key in statePontos.programas) {
      if (!statePontos.programas[key].resgatado) {
        totalAcumulado += statePontos.programas[key].pontos;
      }
    }
    return totalAcumulado;
  };

  const calculateExpiringPoints = () => {
    const saved = localStorage.getItem('cf_pontos_state');
    if (!saved) return prevStates.expirando; // Mantém estático
    return JSON.parse(saved).expirando;
  };

  const calculateCashbackBalance = () => {
    const saved = localStorage.getItem('cf_resgates_state');
    if (!saved) return prevStates.cashback; // Mantém estático
    const stateResgates = JSON.parse(saved);
    return stateResgates.disponivel + stateResgates.totalResgatado;
  };

  const calculateConnectedAccounts = () => {
    const contasAtivas = document.querySelectorAll('#page-contas .status-dot:not(.off)');
    return contasAtivas.length > 0 ? contasAtivas.length : prevStates.contas;
  };

  // 5. Motor de Sincronização
  const syncDashboardData = (animate = true) => {
    const currentCashback = calculateCashbackBalance();
    const currentPontos = calculateTotalPoints();
    const currentExpirando = calculateExpiringPoints();
    const currentContas = calculateConnectedAccounts();

    if (animate) {
      animateValue(cardCashback, prevStates.cashback, currentCashback, 'currency');
      animateValue(cardPontos, prevStates.pontos, currentPontos, 'points');
      animateValue(cardExpirando, prevStates.expirando, currentExpirando, 'points');
      animateValue(cardContas, prevStates.contas, currentContas, 'integer');
    } else {
      cardCashback.textContent = formatCurrency(currentCashback);
      cardPontos.textContent = formatPoints(currentPontos);
      cardExpirando.textContent = formatPoints(currentExpirando);
      cardContas.textContent = currentContas;
    }

    prevStates = {
      cashback: currentCashback,
      pontos: currentPontos,
      expirando: currentExpirando,
      contas: currentContas
    };
  };

  // 6. Observadores de Alteração (Reatividade)
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'cf_resgates_state' || key === 'cf_pontos_state') {
      syncDashboardData(true);
    }
  };

  const pageContas = document.getElementById('page-contas');
  if (pageContas) {
    const observer = new MutationObserver(() => syncDashboardData(true));
    observer.observe(pageContas, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

  // 7. Inicialização suave
  setTimeout(() => {
    syncDashboardData(false); // Como os valores fallback são os do próprio HTML, nada piscará ou zerará
  }, 50);

})();
/* ──────────────────────────────────────────────
   MÓDULO: PONTOS E INTEGRAÇÃO (Cálculo Dinâmico e SSOT)
   ────────────────────────────────────────────── */
(function initPontosDinamicos() {
  const pagePontos = document.getElementById('page-pontos');
  const pageResgates = document.getElementById('page-resgates');
  if (!pagePontos) return;

  // 1. Elementos do DOM
  const cardsPontos = pagePontos.querySelectorAll('.mini-card .big');
  const cardTotalPontos = cardsPontos[0];
  const cardExpirando = cardsPontos[1];
  const cardAtivos = cardsPontos[2];
  const tabelaPontos = pagePontos.querySelector('table tbody');

  const cardDisponivelResgates = pageResgates ? pageResgates.querySelectorAll('.mini-card .big')[0] : null;
  const tbodyHistoricoResgates = pageResgates ? pageResgates.querySelectorAll('table tbody')[0] : null;

  // 🔴 MODO DESENVOLVIMENTO: Limpa o cache para testes
  // localStorage.removeItem('cf_pontos_state');
  // localStorage.removeItem('cf_resgates_state');

  // 2. Extratores de Dados (Lê a tabela HTML como fonte primária)
  const extractProgramsFromDOM = () => {
    const programas = {};
    tabelaPontos.querySelectorAll('tr').forEach(row => {
      const nome = row.querySelector('.prog-name').textContent.trim().toLowerCase();
      const nomeOriginal = row.querySelector('.prog-name').textContent.trim();
      const tds = row.querySelectorAll('td');

      const pontos = parseInt(tds[1].textContent.replace(/[^\d]/g, ''), 10) || 0;
      const valor = parseFloat(tds[2].textContent.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      const dataExp = tds[3].textContent.trim();

      programas[nome] = { nomeOriginal, pontos, valor, dataExp, resgatado: false, status: 'ativo' };
    });
    return programas;
  };

  // 3. Estado da Aplicação
  let statePontos = JSON.parse(localStorage.getItem('cf_pontos_state'));
  if (!statePontos) {
    statePontos = {
      totalPontos: 0,
      expirando: 0,
      ativos: 0,
      programas: extractProgramsFromDOM()
    };
  }

  let stateResgates = JSON.parse(localStorage.getItem('cf_resgates_state')) || {
    disponivel: 142.60, totalResgatado: 387.20, historico: []
  };

  // 4. Utilitários de Data e Formatação
  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatPoints = (val) => val.toLocaleString('pt-BR') + ' pts';
  const getFormattedDate = () => {
    const now = new Date();
    return `Hoje, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === '—') return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // 5. Motor de Cálculo Dinâmico (Fonte Única de Verdade)
  const recalculateMetrics = () => {
    let novoTotal = 0;
    let novoExpirando = 0;
    let novosAtivos = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dataLimite = new Date(today);
    dataLimite.setDate(today.getDate() + 30); // Limite configurado: 30 dias

    for (const key in statePontos.programas) {
      const prog = statePontos.programas[key];

      if (prog.resgatado) {
        prog.status = 'resgatado';
        continue;
      }

      const expDate = parseDate(prog.dataExp);

      // REGRA 1: Ignora e remove do cálculo pontos expirados
      if (expDate && expDate < today) {
        prog.status = 'expirado';
        continue;
      }

      // REGRA 3: Programa válido e não expirado
      prog.status = 'ativo';
      novoTotal += prog.pontos;
      if (prog.pontos > 0) novosAtivos++;

      // REGRA 2: Soma apenas se estiver próximo da expiração (<= 30 dias)
      if (expDate && expDate <= dataLimite) {
        novoExpirando += prog.pontos;
      }
    }

    statePontos.totalPontos = novoTotal;
    statePontos.expirando = novoExpirando;
    statePontos.ativos = novosAtivos;
  };

  // 6. Animação de Valores
  const animateValue = (element, start, end, type = 'points', duration = 800) => {
    if (!element || start === end) {
      if (type === 'currency') element.textContent = formatCurrency(end);
      else if (type === 'points') element.textContent = formatPoints(end);
      else element.textContent = end;
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = start + ease * (end - start);

      if (type === 'currency') element.textContent = formatCurrency(current);
      else if (type === 'points') element.textContent = formatPoints(Math.floor(current));
      else element.textContent = Math.floor(current);

      if (progress < 1) window.requestAnimationFrame(step);
      else {
        if (type === 'currency') element.textContent = formatCurrency(end);
        if (type === 'points') element.textContent = formatPoints(end);
        if (type === 'integer') element.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  };

  // 7. Renderização da Interface
  const syncUI = (animate = false, oldStates = {}) => {
    if (animate) {
      animateValue(cardTotalPontos, oldStates.total, statePontos.totalPontos, 'points');
      animateValue(cardExpirando, oldStates.expirando, statePontos.expirando, 'points');
      animateValue(cardAtivos, oldStates.ativos, statePontos.ativos, 'integer');
    } else {
      cardTotalPontos.textContent = formatPoints(statePontos.totalPontos);
      cardExpirando.textContent = formatPoints(statePontos.expirando);
      cardAtivos.textContent = statePontos.ativos;
    }

    tabelaPontos.querySelectorAll('tr').forEach(row => {
      const progNameEl = row.querySelector('.prog-name');
      if (!progNameEl) return;

      const nome = progNameEl.textContent.trim().toLowerCase();
      const pData = statePontos.programas[nome];
      const tds = row.querySelectorAll('td');
      const btn = row.querySelector('.btn-detail');

      if (!pData) return;

      if (pData.status === 'expirado') {
        tds[1].innerHTML = `<span style="text-decoration:line-through;color:#EF4444">${formatPoints(pData.pontos)}</span>`;
        btn.textContent = 'Expirado';
        btn.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        btn.style.color = '#EF4444';
        btn.style.borderColor = '#EF4444';
        btn.style.pointerEvents = 'none';
        btn.style.fontWeight = '600';
      } else if (pData.status === 'resgatado') {
        tds[1].textContent = formatPoints(0);
        tds[2].textContent = formatCurrency(0);
        btn.textContent = '✔ Resgatado';
        btn.style.backgroundColor = '#10B981';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#10B981';
        btn.style.pointerEvents = 'none';
      }
    });
  };

  // Execução inicial
  recalculateMetrics();
  localStorage.setItem('cf_pontos_state', JSON.stringify(statePontos));
  syncUI();

  // 8. Evento de Resgate
  tabelaPontos.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (!btn || btn.textContent.trim() !== 'Resgatar') return;

    const row = btn.closest('tr');
    const nome = row.querySelector('.prog-name').textContent.trim().toLowerCase();
    const pData = statePontos.programas[nome];

    if (!pData || pData.status !== 'ativo' || pData.pontos <= 0) return;

    const oldStates = {
      total: statePontos.totalPontos,
      expirando: statePontos.expirando,
      ativos: statePontos.ativos
    };
    const oldDisponivelResgates = stateResgates.disponivel;

    // Converte valores e atualiza o estado
    const valorConvertido = pData.valor;
    const pontosConvertidos = pData.pontos;

    pData.resgatado = true;
    pData.pontos = 0;
    pData.valor = 0;

    stateResgates.disponivel += valorConvertido;
    stateResgates.historico.unshift({
      data: getFormattedDate(),
      origem: `${pData.nomeOriginal} (Pontos)`,
      valor: valorConvertido,
      destino: 'Saldo CashFree',
      status: 'convertido'
    });

    // Recalcula e Sincroniza
    recalculateMetrics();
    localStorage.setItem('cf_pontos_state', JSON.stringify(statePontos));
    localStorage.setItem('cf_resgates_state', JSON.stringify(stateResgates));

    syncUI(true, oldStates);

    if (cardDisponivelResgates) {
      animateValue(cardDisponivelResgates, oldDisponivelResgates, stateResgates.disponivel, 'currency');
    }

    if (tbodyHistoricoResgates) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${getFormattedDate()}</td>
        <td>${pData.nomeOriginal} (Pontos)</td>
        <td><span style="color:#10B981;font-weight:600">+ ${formatCurrency(valorConvertido)}</span></td>
        <td>Saldo CashFree</td>
        <td><span class="badge" style="background:#dbeafe;color:#2563eb">✔ Convertido</span></td>
      `;
      tbodyHistoricoResgates.prepend(tr);
    }

    if (typeof showToast === 'function') {
      showToast(`Conversão de ${pontosConvertidos.toLocaleString('pt-BR')} pontos realizada!`, 'success');
    }
  });

})();