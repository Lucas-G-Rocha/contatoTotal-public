const form = document.getElementById('editarAlunoForm');
const inputs = Array.from(document.getElementsByClassName('input'));
const parametros = window.location.pathname.split('/');
const objectParam = pegarParametros(parametros);
console.log(objectParam);
const validacaoContainer = document.getElementById('validacaoContainer');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const inputObject = arrayToObject(inputs);
    console.log(inputObject);
    const response = await fetch('/editarAluno', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({inputObject, objectParam})
    });
    if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData);
    } else {
        console.log(response);
        const resposta = await response.json();
        if(resposta.status === true){
            alert(resposta.resposta);
            window.location.href = '/exibirTodosOsAlunos'
        }
        console.log(resposta);

    }
})


function arrayToObject(inputs) {
    const formData = inputs.reduce((acc, input) => {
        acc[input.name.trim()] = input.value.trim();
        return acc;
    }, {})
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
    }
    else {
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

function pegarParametros(parametros) {
    const objectParam = {
        nomeCompleto: decodeURIComponent(parametros[2]),
        dataDeNascimento: decodeURIComponent(parametros[3]),
        turma: decodeURIComponent(parametros[4]),
        turno: decodeURIComponent(parametros[5]),
        graduacao: decodeURIComponent(parametros[6])
    }
    return objectParam;
}