const products = [
  { id: 1, name: "Chá gelado", description: "Bebida pronta para levar", emoji: "🥤", price: 7.5 },
  { id: 2, name: "Barra de chocolate", description: "Um intervalo mais doce", emoji: "🍫", price: 6 },
  { id: 3, name: "Snack salgado", description: "Lanche rápido e crocante", emoji: "🥨", price: 5.5 },
  { id: 4, name: "Água mineral", description: "Hidratação em movimento", emoji: "💧", price: 4 },
];
const STORAGE_KEY = "vendingflow-demo-v1";
const initialState = () => ({ online: true, stock: [5, 5, 5, 5], sales: 0, queue: [], events: [{ at: Date.now(), text: "Máquina VF-001 pronta para operar." }] });
let state;
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  state = saved && Array.isArray(saved.stock) && saved.stock.length === 4 && Array.isArray(saved.queue) && Array.isArray(saved.events) ? saved : initialState();
} catch { state = initialState(); }
let busy = false;
let toastTimer;
const $ = (id) => document.getElementById(id);
const currency = (amount) => amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const event = (text) => { state.events.unshift({ at: Date.now(), text }); state.events = state.events.slice(0, 30); save(); render(); };
const toast = (text) => { const el = $("toast"); el.textContent = text; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3600); };

function render() {
  $("machine-status").textContent = state.online ? "Online" : "Offline";
  $("total-stock").textContent = state.stock.reduce((a, b) => a + b, 0);
  $("sales-count").textContent = state.sales;
  $("pending-count").textContent = state.queue.length;
  $("connection-badge").textContent = state.online ? "ONLINE" : "OFFLINE";
  $("connection-badge").className = `badge ${state.online ? "online" : "offline"}`;
  $("toggle-machine").textContent = state.online ? "Simular desconexão" : "Reconectar máquina";
  $("products").innerHTML = products.map((p, i) => {
    const available = state.stock[i] - state.queue.filter(q => q.productId === p.id).length;
    return `<article class="product-card"><div class="product-art"><small>COMPARTIMENTO ${String(p.id).padStart(2, "0")}</small><span aria-hidden="true">${p.emoji}</span></div><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><strong>${currency(p.price)}</strong><span>${available > 0 ? `${available} DISPONÍVEIS` : "ESGOTADO"}</span></div><button type="button" data-buy="${p.id}" ${available < 1 ? "disabled" : ""}>${available > 0 ? "Comprar na demo" : "Indisponível"}</button></article>`;
  }).join("");
  $("stock-list").innerHTML = products.map((p, i) => `<div class="stock-item"><span>${p.name}</span><div class="stock-track"><div class="stock-fill ${state.stock[i] <= 2 ? "low" : ""}" style="width:${Math.max(0,Math.min(100,state.stock[i] * 20))}%"></div></div><strong>${state.stock[i]}</strong></div>`).join("");
  $("event-list").innerHTML = state.events.slice(0, 9).map(e => `<li><time>${new Date(e.at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time><span>${escapeHtml(e.text)}</span></li>`).join("");
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }

function processQueue() {
  if (busy || !state.online || state.queue.length === 0) return;
  busy = true;
  const command = state.queue[0];
  const product = products.find(p => p.id === command.productId);
  event(`Comando ${command.id}: motor ${product.id} acionado.`);
  setTimeout(() => {
    if (!state.online) { busy = false; event(`Comando ${command.id} pausado: máquina offline.`); return; }
    const position = state.queue.findIndex(q => q.id === command.id);
    if (position === -1) { busy = false; return; }
    state.queue.splice(position, 1);
    state.stock[product.id - 1] -= 1;
    state.sales += 1;
    busy = false;
    event(`ACK do motor ${product.id}: ${product.name} liberado. Estoque atualizado.`);
    toast(`${product.name} liberado! Venda simulada concluída.`);
    processQueue();
  }, 1450);
}

$("products").addEventListener("click", (e) => {
  const button = e.target.closest("[data-buy]");
  if (!button) return;
  const product = products.find(p => p.id === Number(button.dataset.buy));
  $("dialog-content").innerHTML = `<div class="dialog-art" aria-hidden="true">${product.emoji}</div><h2 id="dialog-title">${product.name}</h2><p class="dialog-price">${currency(product.price)}</p><p class="dialog-note">Esta é uma simulação. Ao confirmar, a demo registrará aprovação fictícia do pagamento e enfileirará um comando para o compartimento ${product.id}. Nenhum valor será cobrado.</p><div class="dialog-actions"><button class="cancel" type="button" id="cancel-buy">Cancelar</button><button class="confirm" type="button" id="confirm-buy">Confirmar compra simulada</button></div>`;
  $("checkout-dialog").showModal();
  $("cancel-buy").addEventListener("click", () => $("checkout-dialog").close());
  $("confirm-buy").addEventListener("click", () => {
    const available = state.stock[product.id - 1] - state.queue.filter(q => q.productId === product.id).length;
    if (available < 1) { $("checkout-dialog").close(); toast("Produto indisponível."); return; }
    const id = `VF-${Date.now().toString(36).toUpperCase()}`;
    state.queue.push({ id, productId: product.id });
    $("checkout-dialog").close();
    event(`Pedido ${id}: pagamento simulado aprovado; comando na fila.`);
    toast(state.online ? "Comando enviado à máquina." : "Máquina offline: comando aguardando reconexão.");
    processQueue();
  });
});
$("toggle-machine").addEventListener("click", () => { state.online = !state.online; event(state.online ? "Máquina reconectada; fila retomada." : "Máquina desconectada; novos comandos ficam na fila."); if (state.online) processQueue(); });
$("restock-all").addEventListener("click", () => { state.stock = [5, 5, 5, 5]; event("Reposição simulada: quatro compartimentos com cinco unidades."); toast("Estoque reposto na demo."); });
$("reset-demo").addEventListener("click", () => { state = initialState(); busy = false; save(); render(); toast("Demo reiniciada."); });
render();
processQueue();
