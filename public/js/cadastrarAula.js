const form = document.getElementById('formCadastrarAula');
const inputs = Array.from(document.getElementsByClassName('input'));
const validacaoContainer = document.getElementById('validacaoContainer');

form.addEventListener('submit', async function(e){
    e.preventDefault();
    const inputObject = arrayToObject(inputs);
    console.log(JSON.stringify(inputObject, null, 2));

    const response = await fetch('/cadastrarAula', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(inputObject)
    })

    if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData);
    } else {
        const data = await response.json();
        if (data.isCreated) {
        
            validacaoContainer.innerHTML = ''
            exibirDadosDaAula(data.novaAula);
        } else {
            const errorData = { isCreatedError: data.erro }
            handleError(errorData);
        }
    }
})

function arrayToObject(inputs) {
    const formData = inputs.reduce((acc, input) => {
        if (input.type === 'checkbox') {
            if (input.checked) {
                if (acc[input.name.trim()]) {
                    acc[input.name.trim()].push(input.value.trim());
                } else {
                    
                    acc[input.name.trim()] = [input.value.trim()];
                }
            }
        } else {
            // Para outros tipos de input, apenas atribui o valor
            acc[input.name.trim()] = input.value.trim();
        }
        return acc;
    }, {});
    console.log('formData' + JSON.stringify(formData, null, 2));
    return formData;
}


function handleError(errorData) {
    if (errorData.validationErrors) {
        createErrorContainer(errorData.validationErrors);
    } else if (errorData.catchError) {
        createErrorContainer(errorData.catchError);
    } else if (errorData.authError) {
        createErrorContainer(errorData.authError);
    } else if (errorData.updateError) {
        createErrorContainer(errorData.updateError);
    } else if (errorData.cadastrarAulaCatchError) {
        createErrorContainer(errorData.cadastrarAulaCatchError)
    } else if (errorData.erro) {
        createErrorContainer(errorData.isCreatedError);
    }
    else {
        console.log(JSON.stringify(errorData, null, 2));
        errorData.erroDesconhecido = "Erro Desconhecido"
        createErrorContainer(errorData.erroDesconhecido);
    }
}

function createMsgResponse(message) {
    let messageResponse = document.createElement('p');
    messageResponse.textContent = message
    messageResponse.className = 'validacao'
    validacaoContainer.appendChild(messageResponse);
}


function createErrorContainer(Errors) {
    validacaoContainer.replaceChildren()
    if (Array.isArray(Errors)) {
        Errors.forEach(error => {
            createMsgResponse(error)
        });
    } else {
        createMsgResponse(Errors)
    }
}


function exibirDadosDaAula(aula) {
    console.log(JSON.stringify(aula, null, 2));
    form.innerHTML = '';
    const tituloForm = document.createElement('h2');
    tituloForm.textContent = 'Dados da Aula';
    tituloForm.id = 'tituloForm';
    form.appendChild(tituloForm);

    const containerDados = document.createElement('div');
    containerDados.id = 'containerDados';

    const nomeDaAulaTitle = document.createElement('h2');
    nomeDaAulaTitle.textContent = 'Nome da Aula';
    nomeDaAulaTitle.className = 'labelInput';
    containerDados.appendChild(nomeDaAulaTitle);

    const nomeDaAula = document.createElement('label');
    nomeDaAula.textContent = aula.nome;
    nomeDaAula.className = 'checkboxText novaAulaDado';
    containerDados.appendChild(nomeDaAula);

    const diaDaAulaTitle = document.createElement('h2');
    diaDaAulaTitle.className = 'labelInput';
    diaDaAulaTitle.textContent = 'Dias da Aula';
    containerDados.appendChild(diaDaAulaTitle);

    const diaDaAula = document.createElement('label');
    diaDaAula.textContent = aula.dia.join(', ');
    diaDaAula.className = 'checkboxText novaAulaDado';
    containerDados.appendChild(diaDaAula);

    const horarioDaAulaTitle = document.createElement('h2');
    horarioDaAulaTitle.className = 'labelInput';
    horarioDaAulaTitle.textContent = 'Horario da Aula';
    containerDados.appendChild(horarioDaAulaTitle);

    const horarioDaAula = document.createElement('labe');
    horarioDaAula.className = 'checkboxText novaAulaDado';
    horarioDaAula.textContent = aula.horario.join(' / ');
    containerDados.appendChild(horarioDaAula);

    const reloadButton = document.createElement('button');
    reloadButton.id = 'submit';
    reloadButton.className = 'reloadButton';

    reloadButton.textContent = 'Cadastrar uma nova aula';
    reloadButton.onclick = () => {
        window.location.reload();
    }
    containerDados.appendChild(reloadButton);

    form.appendChild(containerDados);
}
