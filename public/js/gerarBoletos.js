const form = document.getElementById('gerarBoletosContainer');
const mesSelect = document.getElementById('mes');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
        const response = await fetch('/gerarBoletos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mesSelect.value)
        })

        
})