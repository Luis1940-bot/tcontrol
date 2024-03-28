// console.log('marquesina')
// 24/4/2021


var contenido = document.getElementById('marquis');

function traer(archivo){
    fetch(archivo)
    .then(res => res.text())
    .then(data => {
    contenido.innerHTML=data;
    
    })
    .catch(error =>{
      console.log(error);
    });

}


