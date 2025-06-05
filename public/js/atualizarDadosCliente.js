const form = document.getElementById('atualizarDadosForm');
const inputs = Array.from(document.getElementsByClassName('input'));
const validacaoContainer = document.getElementById('validacaoContainer');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const inputObject = arrayToObject(inputs);
    const response = await fetch('/atualizarDados', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputObject)
    });
    if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData);
    } else {
        location.assign('/');
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
