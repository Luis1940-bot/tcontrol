import { insertarError } from "../../errores/manejadorDeErrores.js"
import { objetoError } from "../../errores/variable_global.js";


function  getStandares(tabla,respuesta) {
  //*carga solamente la parte de arriba de las graficas con los estándares y toneladas de la hora
  console.log("Entramos al modulo getStandares");
  // console.log(respuesta);
  try {
      if (respuesta.length > 0) {
        let m=0;
        for (let i = 0; i <= 23; i++) {
          
            let horaDeLaTabla=tabla.rows[16].cells[i + 3].textContent;
            let horaRegistrocontrol='';
            m < respuesta.length?horaRegistrocontrol=respuesta[m][7].padStart(2, "0") + ":00":null;

            if (horaDeLaTabla===horaRegistrocontrol && m < respuesta.length) {
              tabla.rows[0].cells[i + 3].innerText = respuesta[m][1];
              tabla.rows[1].cells[i + 3].innerText = respuesta[m][2];
              tabla.rows[2].cells[i + 3].innerText = respuesta[m][3];
              tabla.rows[3].cells[i + 3].innerText = respuesta[m][4];
              
              var ton = 0;

              respuesta[m][6] ? (ton = respuesta[m][6] / 1000) : (ton = 0);
              tabla.rows[4].cells[i + 3].innerText = ton.toFixed(2);
              tabla.rows[5].cells[i + 3].innerText = parseFloat(
                respuesta[m][5]
              ).toFixed(2);
            
                m < respuesta.length?m++:null;

          } else {
            tabla.rows[0].cells[i + 3].innerText = "-";
            tabla.rows[1].cells[i + 3].innerText = "-";
            tabla.rows[2].cells[i + 3].innerText = "-";
            tabla.rows[3].cells[i + 3].innerText = "-";
            tabla.rows[4].cells[i + 3].innerText = "0";
            tabla.rows[5].cells[i + 3].innerText = "0";
          }

          tabla.rows[5].cells[i + 3].style.backgroundColor = "transparent";
          tabla.rows[5].cells[i + 3].style.color = "transparent";
        }


        console.log('Sale del módulo getStandares');
    
        } else {
          var mensaje = "No hay datos que mostrar para esta fecha de hoy.";
          var icono = "error";
          var titulo = "No hay datos.";

          //!-----------------ERROR-----------------
              objetoError.qq='ins23';
              objetoError.descripcion='Error en el armado de las primeras 5 líneas. Puede que no se haya cargado nada.';
              objetoError.cod_error='ERR_COMPONENT';
              objetoError.gravedad='Grave';
              objetoError.typeerror='rove>modulos>getStandares.js>getStandares';
              objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
              objetoError.comentario='';
              
              insertarError(objetoError);
      //!------------------------------------------
        }
  } catch (error) {
    console.warn(error)
         //!-----------------ERROR-----------------
        objetoError.qq='ins23';
        objetoError.descripcion='Error en el armado de las primeras 5 líneas. Puede que no se haya cargado nada.';
        objetoError.cod_error='ERR_COMPONENT';
        objetoError.gravedad='Grave';
        objetoError.typeerror=error.stack;
        objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
        objetoError.comentario='';
        
        insertarError(objetoError);
//!------------------------------------------
  }

}

export { getStandares }