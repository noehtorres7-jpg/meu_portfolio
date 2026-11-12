
const resultado = document.getElementById("resultado");
const operacao = document.getElementById("operacao");

let valorAtual = "0";
let valorAnterior = null;
let operador = null;
let iniciarNovoNumero = false;

function atualizarVisor() {
    resultado.textContent = valorAtual;
}

function adicionarNumero(numero) {

    if (iniciarNovoNumero) {
        valorAtual = numero === "." ? "0." : numero;
        iniciarNovoNumero = false;
        atualizarVisor();
        return;
    }

    if (numero === "." && valorAtual.includes(".")) {
        return;
    }

    if (valorAtual === "0" && numero !== ".") {
        valorAtual = numero;
    } else {
        valorAtual += numero;
    }

    atualizarVisor();
}

function escolherOperador(novoOperador) {

    if (valorAnterior !== null && operador && !iniciarNovoNumero) {
        calcular();
    }

    valorAnterior = Number(valorAtual);
    operador = novoOperador;

    operacao.textContent = `${valorAnterior} ${mostrarOperador(operador)}`;

    iniciarNovoNumero = true;
}

function mostrarOperador(op) {
    const simbolos = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return simbolos[op];
}

function calcular() {

    if (operador === null || valorAnterior === null) {
        return;
    }

    const segundoValor = Number(valorAtual);
    let resultadoFinal;

    switch (operador) {

        case "+":
            resultadoFinal = valorAnterior + segundoValor;
            break;

        case "-":
            resultadoFinal = valorAnterior - segundoValor;
            break;

        case "*":
            resultadoFinal = valorAnterior * segundoValor;
            break;

        case "/":
            if (segundoValor === 0) {
                valorAtual = "Erro";
                operacao.textContent = "Não é possível dividir por zero";
                atualizarVisor();
                valorAnterior = null;
                operador = null;
                iniciarNovoNumero = true;
                return;
            }

            resultadoFinal = valorAnterior / segundoValor;
            break;
    }

    operacao.textContent =
        `${valorAnterior} ${mostrarOperador(operador)} ${segundoValor} =`;

    valorAtual = String(Number(resultadoFinal.toPrecision(12)));

    valorAnterior = null;
    operador = null;
    iniciarNovoNumero = true;

    atualizarVisor();
}

function limpar() {
    valorAtual = "0";
    valorAnterior = null;
    operador = null;
    iniciarNovoNumero = false;

    operacao.textContent = "";

    atualizarVisor();
}

function apagarUltimo() {

    if (iniciarNovoNumero || valorAtual === "Erro") {
        valorAtual = "0";
        iniciarNovoNumero = false;
    } else {
        valorAtual = valorAtual.slice(0, -1) || "0";
    }

    atualizarVisor();
}

function porcentagem() {

    if (valorAtual === "Erro") return;

    valorAtual = String(Number(valorAtual) / 100);

    atualizarVisor();
}


// CLIQUES NOS BOTÕES

document.querySelectorAll("[data-number]").forEach(botao => {

    botao.addEventListener("click", () => {
        adicionarNumero(botao.dataset.number);
    });

});

document.querySelectorAll("[data-operator]").forEach(botao => {

    botao.addEventListener("click", () => {
        escolherOperador(botao.dataset.operator);
    });

});

document.querySelectorAll("[data-action]").forEach(botao => {

    botao.addEventListener("click", () => {

        const acao = botao.dataset.action;

        if (acao === "clear") limpar();
        if (acao === "delete") apagarUltimo();
        if (acao === "percent") porcentagem();
        if (acao === "calculate") calcular();

    });

});


// TECLADO DO COMPUTADOR

document.addEventListener("keydown", evento => {

    const tecla = evento.key;

    if (/^[0-9]$/.test(tecla)) {
        adicionarNumero(tecla);
    }

    if (tecla === ".") {
        adicionarNumero(".");
    }

    if (["+", "-", "*", "/"].includes(tecla)) {
        escolherOperador(tecla);
    }

    if (tecla === "Enter" || tecla === "=") {
        calcular();
    }

    if (tecla === "Backspace") {
        apagarUltimo();
    }

    if (tecla === "Escape") {
        limpar();
    }

    if (tecla === "%") {
        porcentagem();
    }

});
