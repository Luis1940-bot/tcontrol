
import { config } from "../../traducciones/variables/lenguajes.js";




function lenguaje(lenguaje,cambia){
  
  try {
    //TODO configura el lenguaje por id

    const nuevoObjeto=config[lenguaje];//* leemos el objeto de lenguajes.js

    for (const key in nuevoObjeto) {
      
      if (Object.hasOwnProperty.call(nuevoObjeto, key)) {
        const element = nuevoObjeto[key];
        let primer_caracter=key[0].charCodeAt(0);
        if (primer_caracter!=95) {
          const tag= document.getElementById(key);
         if (tag) {
           tag.innerText=element[0];
           var atributo = tag.getAttribute('title');
           atributo && element[1]?tag.setAttribute("title", element[1]):null;
         }
        }
      }

    }

    
  } catch (error) {
    console.warn(error)

  }
}





export {lenguaje}