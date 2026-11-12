
const formTarefa = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("campo-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const estadoVazio = document.getElementById("estado-vazio");
const totalTarefas = document.getElementById("total-tarefas");
const textoResumo = document.getElementById("texto-resumo");
const botoesFiltro = document.querySelectorAll(".filtro");
const limparConcluidas = document.getElementById("limpar-concluidas");

const dialogEdicao = document.getElementById("dialog-edicao");
const formEdicao = document.getElementById("form-edicao");
const campoEdicao = document.getElementById("campo-edicao");
const cancelarEdicao = document.getElementById("cancelar-edicao");

let tarefas = carregarTarefas();
let filtroAtual = "todas";
let idEmEdicao = null;


// CARREGAR TAREFAS SALVAS

function carregarTarefas() {
    try {
        const dados = JSON.parse(localStorage.getItem("minhasTarefas"));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}


// SALVAR TAREFAS

function salvarTarefas() {
    localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
}


// ADICIONAR TAREFA

function adicionarTarefa(descricao) {
    const texto = descricao.trim();

    if (!texto) return;

    tarefas.unshift({
        id: Date.now() + Math.random(),
        descricao: texto,
        concluida: false
    });

    salvarTarefas();
    renderizarTarefas();
}


// CONCLUIR TAREFA

function alternarConclusao(id) {
    tarefas = tarefas.map(tarefa =>
        tarefa.id === id
            ? { ...tarefa, concluida: !tarefa.concluida }
            : tarefa
    );

    salvarTarefas();
    renderizarTarefas();
}


// EXCLUIR TAREFA

function excluirTarefa(id) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    salvarTarefas();
    renderizarTarefas();
}


// EDITAR TAREFA

function abrirEdicao(id) {
    const tarefa = tarefas.find(item => item.id === id);

    if (!tarefa) return;

    idEmEdicao = id;
    campoEdicao.value = tarefa.descricao;

    dialogEdicao.showModal();
    campoEdicao.focus();
}

function salvarEdicao() {
    const novaDescricao = campoEdicao.value.trim();

    if (!novaDescricao || idEmEdicao === null) return;

    tarefas = tarefas.map(tarefa =>
        tarefa.id === idEmEdicao
            ? { ...tarefa, descricao: novaDescricao }
            : tarefa
    );

    salvarTarefas();
    renderizarTarefas();
    fecharEdicao();
}

function fecharEdicao() {
    dialogEdicao.close();
    idEmEdicao = null;
    formEdicao.reset();
}


// FILTRAR TAREFAS

function obterTarefasFiltradas() {
    if (filtroAtual === "pendentes") {
        return tarefas.filter(tarefa => !tarefa.concluida);
    }

    if (filtroAtual === "concluidas") {
        return tarefas.filter(tarefa => tarefa.concluida);
    }

    return tarefas;
}


// CRIAR ELEMENTO HTML DA TAREFA

function criarElementoTarefa(tarefa) {
    const item = document.createElement("li");

    item.className = tarefa.concluida
        ? "tarefa concluida"
        : "tarefa";

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;

    checkbox.addEventListener("change", () => {
        alternarConclusao(tarefa.id);
    });

    const descricao = document.createElement("span");

    descricao.className = "descricao-tarefa";
    descricao.textContent = tarefa.descricao;

    const acoes = document.createElement("div");
    acoes.className = "acoes-tarefa";

    const editar = document.createElement("button");

    editar.type = "button";
    editar.className = "btn-acao";
    editar.textContent = "Editar";

    editar.addEventListener("click", () => {
        abrirEdicao(tarefa.id);
    });

    const excluir = document.createElement("button");

    excluir.type = "button";
    excluir.className = "btn-acao btn-excluir";
    excluir.textContent = "Excluir";

    excluir.addEventListener("click", () => {
        excluirTarefa(tarefa.id);
    });

    acoes.append(editar, excluir);
    item.append(checkbox, descricao, acoes);

    return item;
}


// ATUALIZAR A TELA

function renderizarTarefas() {
    listaTarefas.replaceChildren();

    const tarefasVisiveis = obterTarefasFiltradas();

    tarefasVisiveis.forEach(tarefa => {
        listaTarefas.appendChild(criarElementoTarefa(tarefa));
    });

    const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
    const pendentes = tarefas.length - concluidas;

    totalTarefas.textContent = tarefas.length;

    textoResumo.textContent =
        `${pendentes} pendente(s) • ${concluidas} concluída(s)`;

    estadoVazio.hidden = tarefasVisiveis.length > 0;

    if (tarefas.length === 0) {
        estadoVazio.querySelector("h2").textContent =
            "Tudo organizado por aqui?";

        estadoVazio.querySelector("p").textContent =
            "Adicione uma tarefa acima para começar.";

    } else if (tarefasVisiveis.length === 0) {
        estadoVazio.querySelector("h2").textContent =
            "Nenhuma tarefa encontrada";

        estadoVazio.querySelector("p").textContent =
            "Experimente selecionar outro filtro.";
    }
}


// EVENTO DE ADICIONAR

formTarefa.addEventListener("submit", evento => {
    evento.preventDefault();

    adicionarTarefa(campoTarefa.value);

    formTarefa.reset();
    campoTarefa.focus();
});


// EVENTOS DOS FILTROS

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(item => {
            item.classList.toggle("ativo", item === botao);
        });

        renderizarTarefas();
    });
});


// LIMPAR TAREFAS CONCLUÍDAS

limparConcluidas.addEventListener("click", () => {
    tarefas = tarefas.filter(tarefa => !tarefa.concluida);

    salvarTarefas();
    renderizarTarefas();
});


// SALVAR E CANCELAR EDIÇÃO

formEdicao.addEventListener("submit", evento => {
    evento.preventDefault();
    salvarEdicao();
});

cancelarEdicao.addEventListener("click", fecharEdicao);


// FECHAR JANELA AO CLICAR FORA

dialogEdicao.addEventListener("click", evento => {
    if (evento.target === dialogEdicao) {
        fecharEdicao();
    }
});


// INICIAR SISTEMA

renderizarTarefas();
