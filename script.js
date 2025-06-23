const form = document.getElementById("form");
const produtoInput = document.getElementById("produto");
const precoInput = document.getElementById("preco");
const quantidadeInput = document.getElementById("quantidade");
const lista = document.getElementById("lista-compras");
const totalSpan = document.getElementById("total");
const botaoSubmit = document.getElementById("botao-submit");
let compras = [];
let editandoIndex = -1;

const comprasSalvas = localStorage.getItem("compras");
if (comprasSalvas) {
  compras = JSON.parse(comprasSalvas);
  atualizarLista();
  atualizarTotal();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = produtoInput.value.trim();
  const preco = parseFloat(precoInput.value);
  const quantidade = parseInt(quantidadeInput.value);

  if (!nome || isNaN(preco) || isNaN(quantidade)) return; // Validação dos dados fornecidos pelo usuário

  const item = { nome, preco, quantidade, concluido: false };

  if (editandoIndex !== -1) {
    item.concluido = compras[editandoIndex].concluido;
    compras[editandoIndex] = item;
    editandoIndex = -1;
    botaoSubmit.textContent = "Adicionar";
  } else {
    compras.push(item);
  }

  salvarCompras();
  atualizarLista();
  atualizarTotal();

  produtoInput.value = "";
  precoInput.value = "";
  quantidadeInput.value = "";
});

function atualizarLista() {
  lista.innerHTML = "";
  compras.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
        ${item.quantidade}x - ${item.nome} - R$ ${(
      item.preco * item.quantidade
    ).toFixed(2)}
      <div class="box_button">
        <button class="botao botao_editar" onclick="editarItem(${index})">Editar</button>
        <button class="botao botao_remover" onclick="removerItem(${index})">Remover</button>
      </div>
        
        `;

    li.setAttribute("data-index", index);

    if (item.concluido) {
      li.classList.add("concluido");
    }

    lista.appendChild(li);
  });
}

function atualizarTotal() {
  const total = compras.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

function removerItem(index) {
  compras.splice(index, 1);
  salvarCompras();
  atualizarLista();
  atualizarTotal();
}

function salvarCompras() {
  localStorage.setItem("compras", JSON.stringify(compras));
}

function editarItem(index) {
  const item = compras[index];

  produtoInput.value = item.nome;
  precoInput.value = item.preco;
  quantidadeInput.value = item.quantidade;

  editandoIndex = index;

  botaoSubmit.textContent = "Salvar Alteração";
}

// ITEM CONCLUÍDO
lista.addEventListener("click", function (event) {
  const elementoClicado = event.target;

  if (elementoClicado.tagName === "LI") {
    const index = elementoClicado.getAttribute("data-index");
    compras[index].concluido = !compras[index].concluido;
    salvarCompras();
    atualizarLista();
  }
});
