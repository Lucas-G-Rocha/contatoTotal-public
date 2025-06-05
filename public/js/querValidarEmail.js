if(window.emailValido === false){

const main = document.getElementById('mainInicio');

const linkContainer = document.getElementById('linkContainer');
const containerInicio = document.getElementById('containerInicio');

linkContainer.style.display = 'none';
containerInicio.style.display = 'none';

const containerQuerValidarEmail = document.createElement('div');
containerQuerValidarEmail.id = 'containerQuerValidarEmail';

const tituloQuerValidarEmail = document.createElement('h1');
tituloQuerValidarEmail.id = 'tituloQuerValidarEmail';
tituloQuerValidarEmail.textContent = 'Deseja Validar seu email agora?'

const containerBtn = document.createElement('div');
containerBtn.id = 'containerBtn';

const depoisBtn = document.createElement('btn');
depoisBtn.id = 'depoisBtn';
depoisBtn.className = 'btnQuerValidarEmail';
depoisBtn.textContent = 'Depois'
depoisBtn.onclick = () =>{
    containerQuerValidarEmail.style.display = 'none';
    linkContainer.style.display = 'flex';
    containerInicio.style.display = 'flex';
}

const validarEmailLink = document.createElement('a');
validarEmailLink.id = 'validarEmailLink';
validarEmailLink.className = 'btnQuerValidarEmail';
validarEmailLink.textContent = 'Validar Email'
validarEmailLink.href = '/validarEmail';

containerBtn.appendChild(depoisBtn)
containerBtn.appendChild(validarEmailLink);

containerQuerValidarEmail.appendChild(tituloQuerValidarEmail);
containerQuerValidarEmail.appendChild(containerBtn);

main.appendChild(containerQuerValidarEmail);

}