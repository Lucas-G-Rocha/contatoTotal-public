const ativarAlunos = document.getElementsByClassName('ativarAluno');
const trancarAlunos = document.getElementsByClassName('trancarAluno');
const desativarAlunos = document.getElementsByClassName('desativarAluno');
const mainExibirTodosOsAlunos = document.getElementById('mainExibirTodosOsAlunos');
const alunosContainer = document.getElementById('alunosContainer');

Array.from(ativarAlunos).forEach(ativarAluno => {
ativarAluno.onclick = () => {
    const operacao = 'ativo';

    const nomeCompleto = ativarAluno.closest('.alunoContainer').querySelector('.nomeCompleto').textContent.trim();
    const turma = ativarAluno.closest('.alunoContainer').querySelector('.turma').textContent.trim();
    const turno = ativarAluno.closest('.alunoContainer').querySelector('.turno').textContent.trim();
    const graduacao = ativarAluno.closest('.alunoContainer').querySelector('.graduacao').textContent.trim();
    const dataDeNascimento = ativarAluno.closest('.alunoContainer').querySelector('.dataDeNascimento').textContent.trim();
    console.log(nomeCompleto, turno, turma);

    atdAlunoElementsFunction('ativar', nomeCompleto, turma, turno);

    const SIMbtn = document.getElementById('SIMbtn');
    const NAObtn = document.getElementById('NAObtn');

    SIMbtn.onclick = () =>{
        atualizarSituacaoDoAlunoClient(operacao, nomeCompleto, turma, turno, dataDeNascimento, graduacao);
    }

    NAObtn.onclick = () =>{
        window.location.reload();
    }

}
})
Array.from(trancarAlunos).forEach(trancarAluno => {
trancarAluno.onclick = () => {
    const operacao = 'trancado';

    const nomeCompleto = trancarAluno.closest('.alunoContainer').querySelector('.nomeCompleto').textContent.trim();
    const turma = trancarAluno.closest('.alunoContainer').querySelector('.turma').textContent.trim();
    const turno = trancarAluno.closest('.alunoContainer').querySelector('.turno').textContent.trim();
    const graduacao = trancarAluno.closest('.alunoContainer').querySelector('.graduacao').textContent.trim();
    const dataDeNascimento = trancarAluno.closest('.alunoContainer').querySelector('.dataDeNascimento').textContent.trim();
    console.log(nomeCompleto, turno, turma);

    atdAlunoElementsFunction('trancar', nomeCompleto, turma, turno);

    const SIMbtn = document.getElementById('SIMbtn');
    const NAObtn = document.getElementById('NAObtn');

    SIMbtn.onclick = () =>{
        atualizarSituacaoDoAlunoClient(operacao, nomeCompleto, turma, turno, dataDeNascimento, graduacao);
    }

    NAObtn.onclick = () =>{
        window.location.reload();
    }

}
})
Array.from(desativarAlunos).forEach(desativarAluno => {
desativarAluno.onclick = () => {
    const operacao = 'desativado';

    const nomeCompleto = desativarAluno.closest('.alunoContainer').querySelector('.nomeCompleto').textContent.trim();
    const turma = desativarAluno.closest('.alunoContainer').querySelector('.turma').textContent.trim();
    const turno = desativarAluno.closest('.alunoContainer').querySelector('.turno').textContent.trim();
    const graduacao = desativarAluno.closest('.alunoContainer').querySelector('.graduacao').textContent.trim();
    const dataDeNascimento = desativarAluno.closest('.alunoContainer').querySelector('.dataDeNascimento').textContent.trim();
    console.log(nomeCompleto, turno, turma);

    atdAlunoElementsFunction('desativar', nomeCompleto, turma, turno);

    const SIMbtn = document.getElementById('SIMbtn');
    const NAObtn = document.getElementById('NAObtn');

    SIMbtn.onclick = () =>{
        atualizarSituacaoDoAlunoClient(operacao, nomeCompleto, turma, turno, dataDeNascimento, graduacao);
    }

    NAObtn.onclick = () =>{
        window.location.reload();
    }

}
})

function atdAlunoElementsFunction(operacao, nomeCompleto, turma, turno){
    
    const containerConfirmarOperacao = document.createElement('div');
    containerConfirmarOperacao.id = 'containerConfirmarOperacao';

    const tituloOperacao = document.createElement('h2');
    tituloOperacao.id = 'tituloOperacao';
    tituloOperacao.textContent = `Deseja realmente ${operacao} o aluno de Nome: ${nomeCompleto} ,Turma: ${turma} e Turno: ${turno}`;

    const SIMbtn = document.createElement('button');
    SIMbtn.id = 'SIMbtn';
    SIMbtn.className = 'confirmarBtn';
    SIMbtn.textContent = 'SIM'

    const NAObtn = document.createElement('button');    
    NAObtn.id = 'NAObtn';
    NAObtn.className = 'confirmarBtn';
    NAObtn.textContent = 'NÃO';

    alunosContainer.style.display = 'none';
    
    containerConfirmarOperacao.appendChild(tituloOperacao);
    containerConfirmarOperacao.appendChild(SIMbtn);
    containerConfirmarOperacao.appendChild(NAObtn)
    mainExibirTodosOsAlunos.appendChild(containerConfirmarOperacao);

}

async function atualizarSituacaoDoAlunoClient(operacao, nomeCompleto, turma, turno, dataDeNascimento, graduacao){
    alunoInfo = {
        nomeCompleto: nomeCompleto,
        turma: turma,
        turno: turno,
        dataDeNascimento: dataDeNascimento,
        graduacao: graduacao
    }

    const response = await fetch('/atualizarSituacao', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({alunoInfo, operacao: operacao})
    });
    console.log(response);
    if(response.ok){
        const resposta = await response.json();
        if(resposta.status === true){
            alert(resposta.message);
            window.location.reload();
        }else{
            alert(resposta.message);
            window.location.reload();
        }
    }else{
        const Error = await response.json();
        if(Error.status === false){
            if(Error.message){
            alert(Error.message);
            
        }
        if(Error.catchError){
            alert(Error.catchError);
        }
        if(Error.validationError){
            alert(Error.validationError);
        }
        window.location.reload();
        }
    }

}