const btnEnviarEmail = document.getElementById('btnEnviarEmail');
const validacaoContainer = document.getElementById('validacaoContainer');
const containerValidarEmail = document.getElementById('containerValidarEmail');
const tituloValidarEmail = document.getElementById('tituloValidarEmail');
const btnContainer = document.getElementById('btnContainer');
const paragrafoDoEnviarEmail = document.getElementById('paragrafoDoEnviarEmail');

btnEnviarEmail.onclick = async () => {
    const response = await fetch('/validarEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ tantoFaz: true })
    })

    if(response.ok){
        const resposta = await response.json();
        if(resposta.status){
            sucessfulResponse();
            
        }else{
            handleError(resposta)
        }
    }
}


function handleError(errorData) {
    if (errorData.validationErrors) {
        createErrorContainer(errorData.validationErrors);
    } else if (errorData.catchError) {
        createErrorContainer(errorData.catchError);
    } else if (errorData.authError) {
        createErrorContainer(errorData.authError);
    }else if(errorData.message){
        createErrorContainer(errorData.message)
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

function sucessfulResponse(){
    btnContainer.style.display = 'none';
    // btnEnviarEmail.style.display = 'none';
    // paragrafoDoEnviarEmail.style.display = 'none';
    tituloValidarEmail.textContent = 'Digite o código';
    
    const form = document.createElement('form');
    form.id = 'formValidarEmail';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.required = true;
    input.name = 'codigoEmail';
    input.id = 'inputCodigoEmail';
    input.pattern = "\\d{6}"
    input.maxLength = '6'
    input.minLength = '6'

    

    const btnEnviarCodigo = document.createElement('button');
    btnEnviarCodigo.id = 'btnEnviarCodigo';
    btnEnviarCodigo.textContent = 'Enviar Código';
    btnEnviarCodigo.onclick = async () => {
        
    }

    const reenviarCodigo = document.createElement('button');
    reenviarCodigo.id = 'reenviarCodigo';
    reenviarCodigo.textContent = 'Reenviar Código';
    reenviarCodigo.onclick = async () => {
        const response = await fetch('/reenviarCodigo', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ tantofaz2: true })
        })
        console.log(response);
    }
    
    form.appendChild(input);
    form.appendChild(btnEnviarCodigo);
    form.appendChild(reenviarCodigo);
    containerValidarEmail.insertBefore(form, validacaoContainer);

}

console.log(form);