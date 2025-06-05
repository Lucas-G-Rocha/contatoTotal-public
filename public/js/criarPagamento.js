const buttonCreatePagamento = document.getElementById('createPagamento');
const containerCreatePagamento = document.getElementById('createPagamentoContainer');
const pagamentosContainer = document.getElementById('pagamentosContainer');
const url = window.location.pathname;

let isActive = false;
buttonCreatePagamento.onclick = async () => {
    if (!isActive) {
        isActive = true;
        pagamentosContainer.classList.add('ocultar');
        buttonCreatePagamento.textContent = "Voltar"
        criarContainerDoPagamento();
        const formContainerPagamentos = document.getElementById('formContainerPagamentos');
        formContainerPagamentos.addEventListener('submit', async (e) => {
            e.preventDefault();

            const objectParam = pegarParametrosDaURL()

            const inputObject = pegarETransformarDados();
            const response = await fetch("/adicionarPagamentoRota", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputObject, objectParam })
            })
            if (response.ok) {
                window.location.reload();
            }
        });
    } else {
        isActive = false;
        const formContainerPagamentos = document.getElementById('formContainerPagamentos');
        formContainerPagamentos.remove();
        buttonCreatePagamento.textContent = "Adicionar Pagamento"
        pagamentosContainer.classList.remove('ocultar');

    }
}

function pegarETransformarDados() {

    const inputObject = {
        status: document.querySelector('select[name="status"]').value,
        mes: document.querySelector('select[name="mes"]').value,
        valor: document.querySelector('input[name="valor"]').value,
        metodoDePagamento: document.querySelector('select[name="metodoDePagamento"]').value,
        dataDePagamento: document.querySelector('input[name="dataDePagamento"]').value
    };
    console.log(inputObject);
    return inputObject;
}

function criarContainerDoPagamento() {
    // Criando o container principal do formulário
    const formContainerPagamentos = document.createElement('form');
    formContainerPagamentos.id = 'formContainerPagamentos';

    const titlePagamento = document.createElement('h1');
    titlePagamento.id = 'titlePagamento';
    titlePagamento.textContent = 'Criar Pagamento';
    formContainerPagamentos.appendChild(titlePagamento);

    // Container e elementos para o status
    const statusContainer = document.createElement('div');
    statusContainer.className = 'inputContainer';
    const statusLabel = document.createElement('label');
    statusLabel.className = 'labelPagamento';
    statusLabel.textContent = 'Status do Pagamento';
    const statusSelect = document.createElement('select');
    statusSelect.className = 'inputPagamento';
    statusSelect.required = true;
    statusSelect.name = 'status'; // Atributo name
    ['Pago', 'A pagar', 'Vencido'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusSelect.appendChild(option);
    });
    statusSelect.defaultValue = '';
    statusContainer.appendChild(statusLabel);
    statusContainer.appendChild(statusSelect);

    // Container e elementos para o mês
    const mesContainer = document.createElement('div');
    mesContainer.className = 'inputContainer';
    const mesLabel = document.createElement('label');
    mesLabel.className = 'labelPagamento';
    mesLabel.textContent = 'Mês';
    const mesSelect = document.createElement('select');
    mesSelect.className = 'inputPagamento';
    mesSelect.required = true;
    mesSelect.name = 'mes';

    const meses = [
        'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
        'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
    ];

    meses.forEach((mes) => {
        const option = document.createElement('option');
        option.value = mes; // Valor agora é o nome do mês
        option.textContent = mes;
        mesSelect.appendChild(option);
    });

    mesContainer.appendChild(mesLabel);
    mesContainer.appendChild(mesSelect);

    // Container e elementos para o valor
    const valorContainer = document.createElement('div');
    valorContainer.className = 'inputContainer';
    const valorLabel = document.createElement('label');
    valorLabel.className = 'labelPagamento';
    valorLabel.textContent = 'Valor';
    const valorInput = document.createElement('input');
    valorInput.className = 'inputPagamento';
    valorInput.type = 'number';
    valorInput.required = true;
    valorInput.name = 'valor'; // Atributo name
    valorContainer.appendChild(valorLabel);
    valorContainer.appendChild(valorInput);

    // Container e elementos para o método de pagamento
    const metodoDePagamentoContainer = document.createElement('div');
    metodoDePagamentoContainer.className = 'inputContainer';
    const metodoDePagamentoLabel = document.createElement('label');
    metodoDePagamentoLabel.className = 'labelPagamento';
    metodoDePagamentoLabel.textContent = 'Método de Pagamento';
    const metodoDePagamentoSelect = document.createElement('select');
    metodoDePagamentoSelect.className = 'inputPagamento';
    metodoDePagamentoSelect.required = true;
    metodoDePagamentoSelect.name = 'metodoDePagamento'; // Atributo name
    ['espécie', 'pix', 'credito', 'debito', ''].forEach(metodo => {
        const option = document.createElement('option');
        option.value = metodo;
        option.textContent = metodo || 'Selecione um método';
        metodoDePagamentoSelect.appendChild(option);
    });
    metodoDePagamentoContainer.appendChild(metodoDePagamentoLabel);
    metodoDePagamentoContainer.appendChild(metodoDePagamentoSelect);

    // Container e elementos para a data de pagamento
    const dataDePagamentoContainer = document.createElement('div');
    dataDePagamentoContainer.className = 'inputContainer';
    const dataDePagamentoLabel = document.createElement('label');
    dataDePagamentoLabel.className = 'labelPagamento';
    dataDePagamentoLabel.textContent = 'Data de Pagamento';
    const dataDePagamentoInput = document.createElement('input');
    dataDePagamentoInput.className = 'inputPagamento';
    dataDePagamentoInput.type = 'date';
    dataDePagamentoInput.required = true;
    dataDePagamentoInput.name = 'dataDePagamento'; // Atributo name
    dataDePagamentoContainer.appendChild(dataDePagamentoLabel);
    dataDePagamentoContainer.appendChild(dataDePagamentoInput);

    // Adicionando todos os containers ao formulário
    formContainerPagamentos.appendChild(statusContainer);
    formContainerPagamentos.appendChild(mesContainer);
    formContainerPagamentos.appendChild(valorContainer);
    formContainerPagamentos.appendChild(metodoDePagamentoContainer);
    formContainerPagamentos.appendChild(dataDePagamentoContainer);

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Adicionar';
    submitButton.id = 'submitButton';
    formContainerPagamentos.appendChild(submitButton);

    pagamentosContainer.appendChild(formContainerPagamentos);
}

function pegarParametrosDaURL() {
    // Divide a URL em segmentos com base nas barras (/)
    const parametros = url.split('/');

    // Cria o objeto com os parâmetros extraídos
    const objectParams = {
        nome: decodeURIComponent(parametros[2]), // Ex: 'lucas gomes da rocha'
        dataDeNascimento: parametros[3].replaceAll('%2F', '&#x2F;').replaceAll('%252F', '&#x2F;'),
        // Ex: '03/09/2003'
        turma: decodeURIComponent(parametros[4]), // Ex: 'muay thai'
        turno: decodeURIComponent(parametros[5]), // Ex: 'manhã'
        graduacao: decodeURIComponent(parametros[6]) // Ex: 'branco'
    };

    return objectParams;
}
