// ========================================
// SISTEMA DE AGENDAMENTO PETVIDA
// ========================================

// Capturando elementos HTML
const formulario = document.getElementById("form-agendamento");
const resumoAgendamento = document.getElementById("resumo-agendamento");
const resumoDados = document.getElementById("resumo-dados");

const campoData = document.getElementById("data");
const campoHorario = document.getElementById("horario");
const campoTelefone = document.getElementById("telefone");

// ========================================
// MÁSCARA DE TELEFONE
// ========================================

campoTelefone.addEventListener("input", function () {

    let numero = campoTelefone.value.replace(/\D/g, "");

    numero = numero.slice(0, 11);

    if (numero.length <= 2) {

        campoTelefone.value = numero.length
            ? `(${numero}`
            : "";

    } else if (numero.length <= 6) {

        campoTelefone.value =
            `(${numero.slice(0, 2)}) ${numero.slice(2)}`;

    } else if (numero.length <= 10) {

        campoTelefone.value =
            `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;

    } else {

        campoTelefone.value =
            `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;

    }

});
// ========================================
// HORÁRIOS DISPONÍVEIS
// ========================================

const horariosSemana = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"
];

const horariosSabado = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00"
];

// ========================================
// FUNÇÃO PARA COMPARAR DATAS
// ========================================

function obterDataNumerica(data) {

    const partes = data.split("-");

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    return Number(
        `${ano}${String(mes).padStart(2, "0")}${String(dia).padStart(2, "0")}`
    );

}

// ========================================
// OBTENDO DATA ATUAL NUMÉRICA
// ========================================

function obterHojeNumerico() {

    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const dia = hoje.getDate();

    return Number(
        `${ano}${String(mes).padStart(2, "0")}${String(dia).padStart(2, "0")}`
    );

}

// ========================================
// FUNÇÃO PARA CRIAR HORÁRIOS
// ========================================

function adicionarHorarios(listaHorarios) {

    campoHorario.innerHTML = "";

    const opcaoInicial = document.createElement("option");

    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione um horário";

    campoHorario.appendChild(opcaoInicial);

    listaHorarios.forEach(function (horario) {

        const opcao = document.createElement("option");

        opcao.value = horario;
        opcao.textContent = horario;

        campoHorario.appendChild(opcao);

    });

}

// ========================================
// ATUALIZANDO HORÁRIOS AUTOMATICAMENTE
// ========================================

campoData.addEventListener("change", function () {

    campoHorario.innerHTML = "";

    if (!campoData.value) {

        campoHorario.innerHTML = `
            <option value="">Selecione primeiro uma data</option>
        `;

        return;

    }

    // Validando data
    const dataNumerica = obterDataNumerica(campoData.value);
    const hojeNumerico = obterHojeNumerico();

    if (dataNumerica < hojeNumerico) {

        campoHorario.innerHTML = `
            <option value="">Data inválida</option>
        `;

        alert("Não é possível selecionar uma data passada!");

        campoData.value = "";

        return;

    }

    // Identificando dia da semana
    const partesData = campoData.value.split("-");

    const ano = Number(partesData[0]);
    const mes = Number(partesData[1]);
    const dia = Number(partesData[2]);

    const dataSelecionada = new Date(ano, mes - 1, dia);
    const diaSemana = dataSelecionada.getDay();

    // Domingo
    if (diaSemana === 0) {

        campoHorario.innerHTML = `
            <option value="">Fechado aos domingos</option>
        `;

        alert("A PetVida não funciona aos domingos. Escolha outra data!");

        return;

    }

    // Segunda a sexta
    if (diaSemana >= 1 && diaSemana <= 5) {

        adicionarHorarios(horariosSemana);

    }

    // Sábado
    else if (diaSemana === 6) {

        adicionarHorarios(horariosSabado);

    }

});

// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    // Dados do responsável
    const nomeCliente = document.getElementById("nome-cliente").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    // Dados do pet
    const nomePet = document.getElementById("nome-pet").value;
    const tipoPet = document.getElementById("tipo-pet").value;
    const raca = document.getElementById("raca").value;
    const idadePet = document.getElementById("idade-pet").value;

    // Serviço e transporte
    const servico = document.getElementById("servico").value;
    const transporte = document.getElementById("transporte").value;

    // Data e horário
    const data = campoData.value;
    const horario = campoHorario.value;

    // Validando data vazia
    if (!data) {

        alert("Por favor, selecione uma data!");

        return;

    }

    // Validando formato da data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {

        alert("A data selecionada é inválida!");

        return;

    }

    // Validando data passada
    const dataNumerica = obterDataNumerica(data);
    const hojeNumerico = obterHojeNumerico();

    if (dataNumerica < hojeNumerico) {

        alert("Não é possível agendar para uma data passada!");

        return;

    }

    // Identificando dia da semana
    const partesData = data.split("-");

    const ano = Number(partesData[0]);
    const mes = Number(partesData[1]);
    const dia = Number(partesData[2]);

    const dataSelecionada = new Date(ano, mes - 1, dia);
    const diaSemana = dataSelecionada.getDay();

    // Impedindo domingos
    if (diaSemana === 0) {

        alert("A PetVida não funciona aos domingos. Escolha outra data!");

        return;

    }

    // Validando horário
    if (!horario) {

        alert("Por favor, selecione um horário disponível!");

        return;

    }

    const horaSelecionada = Number(horario.split(":")[0]);

    // Segunda a sexta
    if (diaSemana >= 1 && diaSemana <= 5) {

        if (horaSelecionada < 9 || horaSelecionada >= 18) {

            alert("Nosso horário de funcionamento é das 09h às 18h!");

            return;

        }

    }

    // Sábado
    else if (diaSemana === 6) {

        if (horaSelecionada < 9 || horaSelecionada >= 15) {

            alert("Aos sábados, funcionamos das 09h às 15h!");

            return;

        }

    }

    // Observações
    const observacoes = document.getElementById("observacoes").value;

    // Calculando valor
    let valorServico = 0;

    if (servico === "banho") {

        valorServico = 50;

    } else if (servico === "tosa") {

        valorServico = 70;

    } else if (servico === "banho-tosa") {

        valorServico = 100;

    }

    // Adicional Tele-busca
    if (transporte === "tele-busca") {

        valorServico += 20;

    }

    // Formatando preço
    const valorFormatado = valorServico.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Formatando data
    const dataFormatada =
        `${String(dia).padStart(2, "0")}/` +
        `${String(mes).padStart(2, "0")}/` +
        `${ano}`;

    // Traduzindo serviço
    let nomeServico = "";

    if (servico === "banho") {

        nomeServico = "Banho";

    } else if (servico === "tosa") {

        nomeServico = "Tosa";

    } else if (servico === "banho-tosa") {

        nomeServico = "Banho e Tosa";

    }

    // Traduzindo transporte
    let nomeTransporte = "";

    if (transporte === "proprio") {

        nomeTransporte = "Transporte próprio";

    } else if (transporte === "tele-busca") {

        nomeTransporte = "Tele-busca";

    }

    // Traduzindo tipo do pet
    let tipoPetFormatado = "";

    if (tipoPet === "cachorro") {

        tipoPetFormatado = "Cachorro";

    } else if (tipoPet === "gato") {

        tipoPetFormatado = "Gato";

    }

    // Criando resumo
    resumoDados.innerHTML = `

        <strong>Responsável:</strong> ${nomeCliente}<br>
        <strong>Telefone:</strong> ${telefone}<br>
        <strong>E-mail:</strong> ${email}<br><br>

        <strong>Pet:</strong> ${nomePet}<br>
        <strong>Animal:</strong> ${tipoPetFormatado}<br>
        <strong>Raça:</strong> ${raca || "Não informada"}<br>
        <strong>Idade:</strong> ${idadePet ? idadePet + " anos" : "Não informada"}<br><br>

        <strong>Serviço:</strong> ${nomeServico}<br>
        <strong>Transporte:</strong> ${nomeTransporte}<br><br>

        <strong>Data:</strong> ${dataFormatada}<br>
        <strong>Horário:</strong> ${horario}<br><br>

        <strong>Observações:</strong> ${observacoes || "Nenhuma"}<br><br>

        <strong class="valor-total">
            Valor total: ${valorFormatado}
        </strong>

    `;

    // Exibindo resumo
    resumoAgendamento.style.display = "block";

    // Console
    console.log("Agendamento realizado!");
    console.log("Cliente:", nomeCliente);
    console.log("Pet:", nomePet);
    console.log("Serviço:", nomeServico);
    console.log("Valor:", valorFormatado);

    // Rolando até o resumo
    resumoAgendamento.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});