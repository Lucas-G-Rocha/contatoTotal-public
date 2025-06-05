const form = document.getElementById('formCadastrarAluno');
const inputs = Array.from(document.getElementsByClassName('input'));
const validacaoContainer = document.getElementById('validacaoContainer');
let tentativas = 0;

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (tentativas >= 1) {
        createErrorContainer("O formulário já foi enviado. Aguarde a resposta antes de tentar novamente.");
        return;
    }
    tentativas++;
    const inputObject = arrayToObject(inputs);
    console.log(JSON.stringify(inputObject, null, 2));
    const response = await fetch('/cadastrarAluno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputObject)
    })
    if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData);
    } else {
        const data = await response.json();
        if (data.isCreated) {

            validacaoContainer.innerHTML = ''
            exibirDadosDoAluno(data.novoAluno);
        } else {
            const errorData = { isCreatedError: data.erro }
            handleError(errorData);
        }
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
    } else if (errorData.cadastrarAlunoError) {
        createErrorContainer(errorData.cadastrarAlunoError)
    } else if (erro) {
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

function exibirDadosDoAluno(aluno) {

    const tituloForm = document.getElementById('tituloForm');
    tituloForm.textContent = "Dados do Aluno";

    const inputContainerUser = document.createElement('div');
    inputContainerUser.className = 'inputContainer';
    const inputContainerPassword = document.createElement('div');
    inputContainerPassword.className = 'inputContainer';

    const labelPassword = document.createElement('label');
    labelPassword.textContent = 'Senha';
    const labelUser = document.createElement('label');
    labelUser.textContent = 'Usuario';

    const usuario = document.createElement('p');
    usuario.textContent = aluno.usuario;
    usuario.className = 'alunoInfo';

    const senha = document.createElement('p');
    senha.textContent = aluno.dataDeNascimento.replaceAll('&#x2F;', '');
    senha.className = 'alunoInfo';
    
    inputContainerUser.appendChild(labelUser);
    inputContainerUser.appendChild(usuario);

    inputContainerPassword.appendChild(labelPassword);
    inputContainerPassword.appendChild(senha);

    const primeiroElemento = form.querySelector('div.inputContainer')

    form.insertBefore(inputContainerPassword, primeiroElemento);

    form.insertBefore(inputContainerUser, inputContainerPassword);



    const input = form.querySelectorAll('.input');
    for (let campo of input) {
        let novoCampo = document.createElement('p');
        novoCampo.className = 'alunoInfo';
        console.log(campo.name);
        novoCampo.textContent = igualarDadosCampoAluno(campo, aluno);

        campo.replaceWith(novoCampo);
    }

    const reloadButton = document.createElement('button');
    reloadButton.id = 'submit';
    reloadButton.textContent = 'Cadastrar mais um Aluno';
    const submit = document.getElementById('submit')
    submit.replaceWith(reloadButton)
    reloadButton.addEventListener('click', ()=>{
        window.location.reload();
    });

    const ultimosAdicionados = document.createElement('a')
    ultimosAdicionados.id = 'ultimosAdicionadosLink';
    ultimosAdicionados.textContent = 'Exibir Todos os Alunos';
    ultimosAdicionados.href = '/exibirTodosOsAlunos'; 
    form.insertBefore(ultimosAdicionados, validacaoContainer);
}

function igualarDadosCampoAluno(campo, aluno) {
    if (Object.keys(aluno).includes(campo.name)) {
        if (campo.name === 'dataDeNascimento') {
            aluno.dataDeNascimento = aluno.dataDeNascimento.replaceAll('&#x2F;', '/')
        }
        if(!aluno[campo.name]) return "dado inexistente";
        return aluno[campo.name];
    } else {
        if(campo.name === 'email'
            && aluno.emailData.email
        ){
            return aluno.emailData.email
        }
        if (campo.name === "nomeResponsavelFinanceiro"
            && aluno.responsavelFinanceiro
            && aluno.responsavelFinanceiro.nome
        ) {
            return aluno.responsavelFinanceiro.nome;
        }
        if (campo.name === "telefoneResponsavelFinanceiro"
            && aluno.responsavelFinanceiro
            && aluno.responsavelFinanceiro.telefone
        ) {
            return aluno.responsavelFinanceiro.telefone;
        }
        if (campo.name === "parentescoResponsavelFinanceiro"
            && aluno.responsavelFinanceiro
            && aluno.responsavelFinanceiro.parentesco
        ) {
            return aluno.responsavelFinanceiro.parentesco;
        }
        if (campo.name === "nomeContatoEmergencia"
            && aluno.contatoEmergencia
            && aluno.contatoEmergencia.nome
        ) {
            return aluno.contatoEmergencia.nome;
        }
        if (campo.name === "telefoneContatoEmergencia"
            && aluno.contatoEmergencia
            && aluno.contatoEmergencia.telefone
        ) {
            return aluno.contatoEmergencia.telefone;
        }
        if (campo.name === "parentescoContatoEmergencia"
            && aluno.contatoEmergencia
            && aluno.contatoEmergencia.nome
        ) {
            return aluno.contatoEmergencia.nome;
        }
    }
    return "dado inexistente";
}