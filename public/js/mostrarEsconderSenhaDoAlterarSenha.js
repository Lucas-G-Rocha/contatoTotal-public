const senhaAtualId = document.getElementById('senhaAtual');
const novaSenhaId = document.getElementById('novaSenha');

const mostrarSenhaAtual = document.getElementById('mostrarSenhaAtual');
const mostrarNovaSenha = document.getElementById('mostrarNovaSenha');

function mostrarSenhaAtualFunction(){
    if (senhaAtualId.type === 'password') {
        senhaAtualId.type = 'text';
        mostrarSenhaAtual.src = '../image/olho-visivel.svg';

    } else {
        senhaAtualId.type = 'password';
        mostrarSenhaAtual.src = '../image/olho-cego.svg';

    }
}
function mostrarNovaSenhaFunction(){
    if (novaSenhaId.type === 'password') {
        novaSenhaId.type = 'text';
        mostrarNovaSenha.src = '../image/olho-visivel.svg';

    } else {
        novaSenhaId.type = 'password';
        mostrarNovaSenha.src = '../image/olho-cego.svg';

    }
}