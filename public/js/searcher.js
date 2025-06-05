const searcher = document.getElementById('searcher');
const nomesCompletos = document.querySelectorAll('.nomeCompleto')
console.log(nomesCompletos)

if(nomesCompletos){
    searcher.addEventListener('input', function(e){
        Array.from(nomesCompletos).forEach(element => {
            if(searcher.value.trim() !== '' && !element.textContent.toLowerCase().trim().startsWith(searcher.value.toLowerCase().trim())){
                element.parentNode.parentNode.style.display = 'none';
            }else{
                element.parentNode.parentNode.style.display = 'flex';
            }
        });
    })
}