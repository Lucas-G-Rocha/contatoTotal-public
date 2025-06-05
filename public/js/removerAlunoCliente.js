const validacaoContainer = document.getElementById('validacaoContainer');
const removerBTN = document.getElementById('removerBTN');
const nomeCompletoElement = document.getElementsByClassName('nomeCompleto')[0];
const nomeCompleto = nomeCompletoElement.textContent.toLocaleUpperCase();
const parametros = window.location.pathname.split('/');
// console.log(parametros); 
const objectParam = pegarParametros(parametros);
console.log(objectParam);
removerBTN.onclick = async () => {
    const confirmado = await criarLayoutConfirmarRemoverAluno();
    console.log(confirmado);
    if (confirmado) {
        const response = await fetch('/removerAluno', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objectParam)
        });
        console.log(response);
        if (response.ok) {
            const data = await response.json();
            if (data.status === true) {
                alert(data.message);
                return window.location.href = '/exibirTodosOsAlunos';
            } else {
                alert(data.message);
                return window.location.href = '/exibirTodosOsAlunos';
            }
        } else {
            const errorData = await response.json();
            handleError(errorData);

        }
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


function criarLayoutConfirmarRemoverAluno() {
    return new Promise((resolve) => {
        const mainRemoverAluno = document.getElementById('mainRemoverAluno');
        const containerDoDataContainer = document.getElementById('containerDoDataContainer');
        containerDoDataContainer.style.display = 'none';

        const removerAlunoContainer = document.createElement('div');
        removerAlunoContainer.id = 'removerAlunoContainer';

        const titleConfirmarRemoverAluno = document.createElement('h2');
        titleConfirmarRemoverAluno.id = 'titleConfirmarRemoverAluno';
        titleConfirmarRemoverAluno.textContent = `Confirme se realmente deseja REMOVER/DELETAR PERMANENTEMENTE o aluno: ${nomeCompleto}`;

        const NAOremoverAluno = document.createElement('button');
        NAOremoverAluno.className = 'confirmarRemoverAlunoBTN';
        NAOremoverAluno.id = 'NAOremoverAluno';
        NAOremoverAluno.textContent = 'NÃO';
        NAOremoverAluno.onclick = () => {
            if (removerAlunoContainer) removerAlunoContainer.remove();
            containerDoDataContainer.style.display = 'flex';
            resolve(false); // Retorna "false" ao clicar em "NÃO"
        };

        const SIMremoverAluno = document.createElement('button');
        SIMremoverAluno.className = 'confirmarRemoverAlunoBTN';
        SIMremoverAluno.id = 'SIMremoverAluno';
        SIMremoverAluno.textContent = 'SIM';
        SIMremoverAluno.onclick = () => {
            if (removerAlunoContainer) removerAlunoContainer.remove();
            resolve(true); // Retorna "true" ao clicar em "SIM"
        };

        removerAlunoContainer.appendChild(titleConfirmarRemoverAluno);
        removerAlunoContainer.appendChild(SIMremoverAluno);
        removerAlunoContainer.appendChild(NAOremoverAluno);
        mainRemoverAluno.appendChild(removerAlunoContainer);
    });
}

function handleError(errorData) {
    if (errorData.validationErrors) {
        createErrorContainer(errorData.validationErrors);
    } else if (errorData.catchError) {
        createErrorContainer(errorData.catchError);
    } else if (errorData.authError) {
        createErrorContainer(errorData.authError);
    }else if (errorData.deleteErro){
        createErrorContainer(errorData.deleteErro);
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