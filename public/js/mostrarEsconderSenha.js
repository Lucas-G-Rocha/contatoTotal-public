const iconSenha = document.getElementById('mostrarSenha');
const senhaInput = document.getElementById('password');

function mostrarEsconderSenha() {
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        iconSenha.src = '../image/olho-visivel.svg';

    } else {
        senhaInput.type = 'password';
        iconSenha.src = '../image/olho-cego.svg';

    }
}