
import { lenguaje } from "./config_lenguaje.js";
import {  nombreIDIOMA,nombreES, clonarNombres,clonarDetalles,detalleES,detalleIDIOMA } from "../../traducciones/variables/variables.js";


 
function leerTXT(lenguaje,idiomaDelControl,funxion) {
  let ruta = `..//..//traducciones/archivos/Nombre de campo ${lenguaje} LTYcontrol.txt?_=${new Date().getTime()}`;
  fetch(ruta)
  .then(response1 => response1.text())
  .then(data1 => {
    clonarNombres(data1,lenguaje,idiomaDelControl);
    ruta = `..//..//traducciones/archivos/Nombre de campo ES LTYcontrol.txt?_=${new Date().getTime()}`;
    return fetch(ruta);
  })
  .then(response2 => response2.text())
  .then(data2 => {
    clonarNombres(data2,'ES','ZZ')
    ruta = `..//..//traducciones/archivos/Detalle de campo ${lenguaje} LTYcontrol.txt?_=${new Date().getTime()}`;
    return fetch(ruta);
  })
  .then(response3 => response3.text())
  .then(data3 => {
    clonarDetalles(data3,lenguaje,idiomaDelControl);
    ruta = `..//..//traducciones/archivos/Detalle de campo ES LTYcontrol.txt?_=${new Date().getTime()}`;
    return fetch(ruta);
  })
  .then(response4 => response4.text())
  .then(data4 => {
    clonarDetalles(data4,'ES','ZZ');
    // funxion==='Traducir'?traducir():NuevoControl();
    traducir(lenguaje);
  })
  .catch(error => console.error(error));
  }

function recargaArrays(lenguaje) {
    let idiomaDelControl='ZZ'
    lenguaje==='ES'?idiomaDelControl='XX':null;
    leerTXT(lenguaje,idiomaDelControl,'Traducir');

}






function traducir(len) {
  lenguaje(len,true)
   
}


export { leerTXT,recargaArrays};