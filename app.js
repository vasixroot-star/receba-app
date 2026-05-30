const transactions = [];
let cents = 0;

function fmt(c) {
  return 'R$ ' + (c / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('current-time').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 1000);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.querySelector('[data-nav="' + id + '"]');
  if (nav) nav.classList.add('active');
}

document.querySelectorAll('.nk[data-n]').forEach(k => {
  k.addEventListener('click', () => {
    if (cents.toString().length >= 7) return;
    cents = cents * 10 + parseInt(k.dataset.n);
    document.getElementById('val-display').textContent =
      (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  });
});

document.getElementById('del-btn').addEventListener('click', () => {
  cents = Math.floor(cents / 10);
  document.getElementById('val-display').textContent =
    (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
});

document.getElementById('gerar-btn').addEventListener('click', () => {
  if (cents === 0) return;
  document.getElementById('qr-val').textContent = fmt(cents);
  showScreen('screen-qr');
});

document.getElementById('simular-btn').addEventListener('click', () => {
  const val = cents;
  transactions.unshift({ val, time: new Date() });
  const total = transactions.reduce((a, t) => a + t.val, 0);
  const avg = Math.round(total / transactions.length);

  document.getElementById('suc-val').textContent = fmt(val);
  document.getElementById('suc-total').textContent = fmt(total);
  document.getElementById('suc-count').textContent =
    transactions.length + (transactions.length === 1 ? ' venda' : ' vendas');
  document.getElementById('suc-ticket').textContent = fmt(avg);

  updateHist();
  showScreen('screen-sucesso');
  cents = 0;
  document.getElementById('val-display').textContent = '0,00';
});

document.getElementById('nova-btn').addEventListener('click', () => {
  showScreen('screen-cobrar');
});

document.querySelectorAll('.back-btn').forEach(b => {
  b.addEventListener('click', () => showScreen(b.dataset.back));
});

document.querySelectorAll('.nav-item').forEach(n => {
  n.addEventListener('click', () => showScreen(n.dataset.nav));
});

function updateHist() {
  const total = transactions.reduce((a, t) => a + t.val, 0);
  document.getElementById('hist-total').textContent = fmt(total);
  document.getElementById('hist-count').textContent = transactions.length;

  const list = document.getElementById('txn-list');
  if (transactions.length === 0) {
    list.innerHTML = '<div class="empty-state">Nenhuma venda ainda.<br>Faça sua primeira cobrança!</div>';
    return;
  }

  list.innerHTML = transactions.map((t, i) => {
    const h = t.time.getHours().toString().padStart(2, '0');
    const m = t.time.getMinutes().toString().padStart(2, '0');
    return `
      <div class="txn-row">
        <div>
          <div class="txn-name">venda #${transactions.length - i}</div>
          <div class="txn-time">${h}:${m}</div>
        </div>
        <div class="txn-val">+ ${fmt(t.val)}</div>
      </div>
    `;
  }).join('');
}

document.getElementById('ai-btn').addEventListener('click', () => {
  if (transactions.length === 0) {
    document.getElementById('ai-text').textContent =
      'Faça pelo menos uma venda para gerar o relatório.';
    return;
  }
  const total = transactions.reduce((a, t) => a + t.val, 0);
  const avg = Math.round(total / transactions.length);
  document.getElementById('ai-text').textContent =
    '✦ Relatório com IA disponível em breve. Funcionalidade sendo ativada...';
});
