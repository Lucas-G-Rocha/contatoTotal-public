const form = document.getElementById('esqueceuASenhaForm');
const email = document.getElementById('emailInput');
const validacaoContainer = document.getElementById('validacaoContainer');

form.addEventListener('submit', async function(e){
    e.preventDefault();

    const response = await fetch('/esqueceuASenha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.textContent })
    });
    console.log(response);
})