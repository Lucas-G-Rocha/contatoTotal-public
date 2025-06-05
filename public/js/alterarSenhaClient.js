const form = document.getElementById('alterarSenhaForm');

form.addEventListener('submit', async function(e){
    e.preventDefault();
    
    const senhaAtual = document.getElementById('senhaAtual');
    const novaSenha = document.getElementById('novaSenha');
    const usuario = document.getElementById('usuario');
    
    const alterarObject = {
        usuario: usuario.value.trim(),
        senhaAtual: senhaAtual.value.trim(),
        novaSenha: novaSenha.value.trim()
    }
    
    console.log(alterarObject);

    const response = await fetch('/alterarSenha', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alterarObject)
    })
    if(response.ok){
        console.log(response);
        const resposta = await response.json();
        if(resposta.status){
            alert(resposta.message);
            window.location.href = '/atualizarDados';
        }else{
            handleError(resposta);
        }
    }else{
        console.log(response)
        const resposta = await response.json();
        console.log(resposta);
        if(!resposta.status){
            handleError(resposta);
        }else{
            alert('Erro desconhecido');
        }
    }

});

function handleError(errorData) {
    if (errorData.validationErrors) {
        createErrorContainer(errorData.validationErrors);
    } else if (errorData.catchError) {
        createErrorContainer(errorData.catchError);
    } else if (errorData.authError) {
        createErrorContainer(errorData.authError);
    }else if(errorData.erro){
        createErrorContainer(errorData.erro);
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