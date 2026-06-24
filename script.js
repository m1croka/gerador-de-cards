const tipos = {
  penalidade: { label: "Penalidade", img: "penalidade.png", placeholder: "Exemplo: Volte 2 casas porque sua cesta rasgou no caminho." },
  desafio: { label: "Desafio", img: "desafio.png", placeholder: "Exemplo: Responda: qual alimento é uma fruta? Se acertar, avance 1 casa." },
  acao: { label: "Ação", img: "acao.png", placeholder: "Exemplo: Avance 2 casas porque você encontrou um atalho." },
  bonus: { label: "Bônus", img: "bonus.png", placeholder: "Exemplo: Ganhe 1 item extra para sua cesta." }
};

let tipoAtual = "penalidade";
let cards = JSON.parse(localStorage.getItem("cardsDigitaisWit") || "[]");

const typeButtons = document.querySelectorAll(".type-btn");
const cardText = document.getElementById("cardText");
const charCount = document.getElementById("charCount");
const previewCard = document.getElementById("previewCard");
const previewBg = document.getElementById("previewBg");
const previewText = document.getElementById("previewText");
const saveCard = document.getElementById("saveCard");
const newCard = document.getElementById("newCard");
const clearAll = document.getElementById("clearAll");
const savedCount = document.getElementById("savedCount");
const cardsSheet = document.getElementById("cardsSheet");
const cardTemplate = document.getElementById("cardTemplate");
const showCards = document.getElementById("showCards");
const printCards = document.getElementById("printCards");

function setTipo(tipo){
  tipoAtual = tipo;
  typeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.type === tipo));
  previewCard.className = "game-card " + tipo;
  previewBg.src = tipos[tipo].img;
  cardText.placeholder = tipos[tipo].placeholder;
  atualizarPreview();
}

function atualizarPreview(){
  const texto = cardText.value.trim();
  previewText.textContent = texto || "Digite o comando do card aqui.";
  const total = cardText.value.length;
  charCount.textContent = total;
  const counter = document.querySelector(".counter");
  counter.classList.remove("warning", "danger");
  if(total >= 120) counter.classList.add("warning");
  if(total >= 140) counter.classList.add("danger");
  ajustarFonte(previewText, texto);
}

function ajustarFonte(elemento, texto){
  const tamanho = texto.length;
  if(tamanho > 120){ elemento.style.fontSize = ".82rem"; }
  else if(tamanho > 95){ elemento.style.fontSize = ".9rem"; }
  else if(tamanho > 65){ elemento.style.fontSize = ".98rem"; }
  else{ elemento.style.fontSize = "1.05rem"; }
}

function salvarCards(){ localStorage.setItem("cardsDigitaisWit", JSON.stringify(cards)); }

function salvarCard(){
  const texto = cardText.value.trim();
  if(!texto){ alert("Digite o comando do card antes de salvar."); return; }
  cards.push({ id: Date.now(), tipo: tipoAtual, texto });
  salvarCards();
  limparEditor();
  renderCards();
  alert("Card salvo com sucesso!");
}

function limparEditor(){
  cardText.value = "";
  atualizarPreview();
  cardText.focus();
}

function renderCards(){
  cardsSheet.innerHTML = "";
  savedCount.textContent = cards.length;
  if(cards.length === 0){
    const empty = document.createElement("p");
    empty.textContent = "Nenhum card salvo ainda.";
    empty.style.fontWeight = "900";
    empty.style.color = "#4d668d";
    cardsSheet.appendChild(empty);
    return;
  }

  cards.forEach(card => {
    const node = cardTemplate.content.cloneNode(true);
    const gameCard = node.querySelector(".game-card");
    const bg = node.querySelector(".card-bg");
    const text = node.querySelector(".card-text");
    const remove = node.querySelector(".remove-card");
    gameCard.classList.add(card.tipo);
    bg.src = tipos[card.tipo].img;
    bg.alt = "Modelo de card " + tipos[card.tipo].label;
    text.textContent = card.texto;
    ajustarFonte(text, card.texto);
    remove.addEventListener("click", () => {
      if(confirm("Deseja remover este card?")){
        cards = cards.filter(item => item.id !== card.id);
        salvarCards();
        renderCards();
      }
    });
    cardsSheet.appendChild(node);
  });
}

function apagarTodos(){
  if(cards.length === 0){ alert("Não há cards para apagar."); return; }
  if(confirm("Tem certeza que deseja apagar todos os cards salvos?")){
    cards = [];
    salvarCards();
    renderCards();
  }
}

function visualizarTodos(){
  renderCards();
  document.querySelector(".list-panel").scrollIntoView({ behavior: "smooth" });
}

function imprimirCards(){
  if(cards.length === 0){ alert("Salve pelo menos um card antes de gerar o PDF."); return; }
  renderCards();
  setTimeout(() => window.print(), 250);
}

typeButtons.forEach(btn => btn.addEventListener("click", () => setTipo(btn.dataset.type)));
cardText.addEventListener("input", atualizarPreview);
saveCard.addEventListener("click", salvarCard);
newCard.addEventListener("click", limparEditor);
clearAll.addEventListener("click", apagarTodos);
showCards.addEventListener("click", visualizarTodos);
printCards.addEventListener("click", imprimirCards);

setTipo(tipoAtual);
renderCards();
