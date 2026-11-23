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

const campoCPF = document.getElementById("cpf");


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
// MÁSCARA DE CPF
// ========================================

campoCPF.addEventListener("input", function () {

    let cpf = campoCPF.value.replace(/\D/g, "");

    cpf = cpf.slice(0, 11);

    if (cpf.length <= 3) {

        campoCPF.value = cpf;

    } else if (cpf.length <= 6) {

        campoCPF.value =
            `${cpf.slice(0, 3)}.${cpf.slice(3)}`;

    } else if (cpf.length <= 9) {

        campoCPF.value =
            `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;

    } else {

        campoCPF.value =
            `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;

    }

});


// ========================================
// VALIDAÇÃO DE CPF
// ========================================

function validarCPF(cpf) {

    cpf = cpf.replace(/\D/g, "");

    // CPF precisa possuir 11 números

    if (cpf.length !== 11) {

        return false;

    }


    // Impede CPFs com todos os números iguais

    if (/^(\d)\1{10}$/.test(cpf)) {

        return false;

    }


    // Primeiro dígito verificador

    let soma = 0;

    for (let i = 0; i < 9; i++) {

        soma += Number(cpf[i]) * (10 - i);

    }

    let resto = soma % 11;

    let primeiroDigito = resto < 2
        ? 0
        : 11 - resto;


    if (primeiroDigito !== Number(cpf[9])) {

        return false;

    }


    // Segundo dígito verificador

    soma = 0;

    for (let i = 0; i < 10; i++) {

        soma += Number(cpf[i]) * (11 - i);

    }

    resto = soma % 11;

    let segundoDigito = resto < 2
        ? 0
        : 11 - resto;


    if (segundoDigito !== Number(cpf[10])) {

        return false;

    }


    return true;

}


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
// DEFININDO DATA MÍNIMA
// ========================================

function definirDataMinima() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(hoje.getMonth() + 1).padStart(2, "0");

    const dia = String(hoje.getDate()).padStart(2, "0");


    campoData.min = `${ano}-${mes}-${dia}`;

}

definirDataMinima();


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

        campoData.value = "";

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
// FUNÇÃO PARA FORMATAR VALORES
// ========================================

function formatarValor(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


// ========================================
// FUNÇÃO DE SEGURANÇA HTML
// ========================================

function escaparHTML(texto) {

    return String(texto)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();


    // ========================================
    // DADOS DO RESPONSÁVEL
    // ========================================

    const nomeCliente = document.getElementById("nome-cliente").value.trim();

    const telefone = document.getElementById("telefone").value.trim();

    const email = document.getElementById("email").value.trim();

    const endereco = document.getElementById("endereco").value.trim();

    const cpf = document.getElementById("cpf").value.trim();

    const sexo = document.getElementById("sexo").value;


    // ========================================
    // DADOS DO PET
    // ========================================

    const nomePet = document.getElementById("nome-pet").value.trim();

    const tipoPet = document.getElementById("tipo-pet").value;

    const raca = document.getElementById("raca").value.trim();

    const idadePet = document.getElementById("idade-pet").value;


    // ========================================
    // SERVIÇO E TRANSPORTE
    // ========================================

    const servico = document.getElementById("servico").value;

    const transporte = document.getElementById("transporte").value;


    // ========================================
    // DATA E HORÁRIO
    // ========================================

    const data = campoData.value;

    const horario = campoHorario.value;


    // ========================================
    // OBSERVAÇÕES
    // ========================================

    const observacoes = document.getElementById("observacoes").value.trim();


    // ========================================
    // VALIDANDO CPF
    // ========================================

    if (!validarCPF(cpf)) {

        alert("Por favor, informe um CPF válido!");

        campoCPF.focus();

        return;

    }


    // ========================================
    // VALIDANDO TELEFONE
    // ========================================

    const telefoneNumeros = telefone.replace(/\D/g, "");

    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {

        alert("Por favor, informe um telefone válido!");

        campoTelefone.focus();

        return;

    }


    // ========================================
    // VALIDANDO DATA
    // ========================================

    if (!data) {

        alert("Por favor, selecione uma data!");

        campoData.focus();

        return;

    }


    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {

        alert("A data selecionada é inválida!");

        return;

    }


    const dataNumerica = obterDataNumerica(data);

    const hojeNumerico = obterHojeNumerico();


    if (dataNumerica < hojeNumerico) {

        alert("Não é possível agendar para uma data passada!");

        campoData.focus();

        return;

    }


    // ========================================
    // IDENTIFICANDO DIA DA SEMANA
    // ========================================

    const partesData = data.split("-");

    const ano = Number(partesData[0]);

    const mes = Number(partesData[1]);

    const dia = Number(partesData[2]);


    const dataSelecionada = new Date(ano, mes - 1, dia);

    const diaSemana = dataSelecionada.getDay();


    // ========================================
    // IMPEDINDO DOMINGOS
    // ========================================

    if (diaSemana === 0) {

        alert("A PetVida não funciona aos domingos. Escolha outra data!");

        campoData.focus();

        return;

    }


    // ========================================
    // VALIDANDO HORÁRIO
    // ========================================

    if (!horario) {

        alert("Por favor, selecione um horário disponível!");

        campoHorario.focus();

        return;

    }


    // ========================================
    // VERIFICANDO HORÁRIO DISPONÍVEL
    // ========================================

    let horariosPermitidos = [];


    if (diaSemana >= 1 && diaSemana <= 5) {

        horariosPermitidos = horariosSemana;

    }

    else if (diaSemana === 6) {

        horariosPermitidos = horariosSabado;

    }


    if (!horariosPermitidos.includes(horario)) {

        alert("O horário selecionado não está disponível!");

        campoHorario.focus();

        return;

    }


    // ========================================
    // VALIDANDO DATA REAL
    // ========================================

    if (

        dataSelecionada.getFullYear() !== ano ||

        dataSelecionada.getMonth() !== mes - 1 ||

        dataSelecionada.getDate() !== dia

    ) {

        alert("A data selecionada é inválida!");

        campoData.focus();

        return;

    }


    // ========================================
    // CALCULANDO VALOR
    // ========================================

    let valorServico = 0;


    if (servico === "banho") {

        valorServico = 50;

    }

    else if (servico === "tosa") {

        valorServico = 70;

    }

    else if (servico === "banho-tosa") {

        valorServico = 100;

    }


    // Adicional tele-busca

    if (transporte === "tele-busca") {

        valorServico += 20;

    }


    const valorFormatado = formatarValor(valorServico);


    // ========================================
    // FORMATANDO DATA
    // ========================================

    const dataFormatada =

        `${String(dia).padStart(2, "0")}/` +

        `${String(mes).padStart(2, "0")}/` +

        `${ano}`;


    // ========================================
    // TRADUZINDO SERVIÇO
    // ========================================

    let nomeServico = "";


    if (servico === "banho") {

        nomeServico = "Banho";

    }

    else if (servico === "tosa") {

        nomeServico = "Tosa";

    }

    else if (servico === "banho-tosa") {

        nomeServico = "Banho e Tosa";

    }


    // ========================================
    // TRADUZINDO TRANSPORTE
    // ========================================

    let nomeTransporte = "";


    if (transporte === "proprio") {

        nomeTransporte = "Transporte próprio";

    }

    else if (transporte === "tele-busca") {

        nomeTransporte = "Tele-busca";

    }


    // ========================================
    // TRADUZINDO TIPO DO PET
    // ========================================

    let tipoPetFormatado = "";


    if (tipoPet === "cachorro") {

        tipoPetFormatado = "Cachorro";

    }

    else if (tipoPet === "gato") {

        tipoPetFormatado = "Gato";

    }


    // ========================================
    // CRIANDO RESUMO
    // ========================================

    resumoDados.innerHTML = `

        <strong>Responsável:</strong>
        ${escaparHTML(nomeCliente)}
        <br>

        <strong>Telefone:</strong>
        ${escaparHTML(telefone)}
        <br>

        <strong>E-mail:</strong>
        ${escaparHTML(email)}
        <br>

        <strong>Endereço:</strong>
        ${escaparHTML(endereco)}
        <br>

        <strong>CPF:</strong>
        ${escaparHTML(cpf)}
        <br>

        <strong>Sexo:</strong>
        ${escaparHTML(sexo || "Não informado")}
        <br><br>


        <strong>Pet:</strong>
        ${escaparHTML(nomePet)}
        <br>

        <strong>Animal:</strong>
        ${escaparHTML(tipoPetFormatado)}
        <br>

        <strong>Raça:</strong>
        ${escaparHTML(raca || "Não informada")}
        <br>

        <strong>Idade:</strong>
        ${escaparHTML(idadePet ? idadePet + " anos" : "Não informada")}
        <br><br>


        <strong>Serviço:</strong>
        ${escaparHTML(nomeServico)}
        <br>

        <strong>Transporte:</strong>
        ${escaparHTML(nomeTransporte)}
        <br><br>


        <strong>Data:</strong>
        ${dataFormatada}
        <br>

        <strong>Horário:</strong>
        ${escaparHTML(horario)}
        <br><br>


        <strong>Observações:</strong>
        ${escaparHTML(observacoes || "Nenhuma")}
        <br><br>


        <strong class="valor-total">

            Valor total: ${valorFormatado}

        </strong>

    `;


    // ========================================
    // EXIBINDO RESUMO
    // ========================================

    resumoAgendamento.style.display = "block";


    // ========================================
    // CONSOLE
    // ========================================

    console.log("Agendamento realizado!");

    console.log("Cliente:", nomeCliente);

    console.log("CPF:", cpf);

    console.log("Pet:", nomePet);

    console.log("Serviço:", nomeServico);

    console.log("Valor:", valorFormatado);


    // ========================================
    // ROLANDO ATÉ O RESUMO
    // ========================================

    resumoAgendamento.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

});