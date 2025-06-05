const form = document.getElementById('formLogin');
const user = document.getElementById('usuario');
const senha = document.getElementById('password');
const validacaoContainer = document.getElementById('validacaoContainer');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let usuarioValor = sanitizeInput(usuario.value).trim();
    let senhaValor = sanitizeInput(senha.value).trim();

    const response = await fetch('/login', {
        method: 'post',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario: usuarioValor, senha: senhaValor })
    })
    if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData);
    } else {
        if (response.redirected) {
            location.assign(response.url);
        }
    }

})



function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.textContent;
}

function handleError(errorData) {
    if (errorData.validationErrors) {
        createErrorContainer(errorData.validationErrors);
    } else if (errorData.catchError) {
        createErrorContainer(errorData.catchError);
    } else if (errorData.authError) {
        createErrorContainer(errorData.authError);
    } else {
        errorData.erroDesconhecido = "Erro Desconhecido"
        createErrorContainer(errorData.erroDesconhecido);
    }
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

function createMsgResponse(message) {
    let messageResponse = document.createElement('p');
    messageResponse.textContent = message
    messageResponse.className = 'validacao'
    validacaoContainer.appendChild(messageResponse);
}