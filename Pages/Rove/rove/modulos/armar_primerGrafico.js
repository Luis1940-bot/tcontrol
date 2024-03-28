import { scrWidth,scrHeight  } from "../utils/medidas.js";
import { insertarError } from "../../errores/manejadorDeErrores.js"
import { objetoError } from "../../errores/variable_global.js";
import { traducir } from "../../traducciones/variables/traducir.js";



function armar_primerGrafico(tipo_rove) {
  console.log("Modulo armar_primerGrafico");
  //?coloca los titulos de los estándares arma las fechas y realiza el traer los datos

  try {
    document.getElementById("tableroDeControl").innerText = "ROVE";

    let tabla = document.getElementById("bodyDatos");
    tabla.innerHTML = "";
    tabla.width = scrWidth;

    let cien = 100;
    for (let index = 1; index <= 17; index++) {
      let fondo = "";
      // fondo = 'class="bg-info"';
      let stylo =
        'style="font-size:10px; width:5px;" class="border-top-0 border-bottom-0 border-left-0 font-weight-bold"';
      let referencia_porcentaje = "";
      if (index > 3 && index < 17) {
        //fondo = 'class="bg-success"';
        stylo =
          'style="font-size:10px; width:5px;" class="border-top-0 border-bottom-0 border-left-0 font-weight-bold"';
        // fondo = 'class="bg-warning"';
      }
      if (index > 6 && index < 17) {
        referencia_porcentaje = cien + "%";
        cien = cien - 10;
        stylo = 'style="font-size:10px; width:5px; height:8px;"'; // class="border-top-0 border-bottom-0 border-left-0"
        // fondo = 'class="bg-success"';
      }

      tabla.innerHTML += `
                <tr class="bg-light text-center small" >
                    <td   style="width: 300px;"></td>
                    <td ${fondo} style="width: 300px;"></td>
                    <td ${stylo}>${referencia_porcentaje}</td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                    <td ${fondo} ${stylo}></td>
                </tr>
             `;
    }
    let fila_0 = "";
    let fila_1 = "";
    let fila_2 = "";
    let fila_3 = "";
    let fila_4 = "";
    let fila_16 = "";
    let tot = [];

    console.log(`${tipo_rove.toUpperCase()}`);
    document.getElementById("nombreDeTabla").innerText = traducir(`ROVE ${tipo_rove.toUpperCase()}`);
    switch (tipo_rove) {
      case "especialidades":
        fila_0 = traducir("Producto");
        fila_1 = "[Kg/h]";
        fila_2 = traducir("Meta");
        fila_3 = "Target";
        fila_4 = "Tn Emp.";
        fila_16 = traducir("Hora");

        tot[0] = "Hs Rum:";
        tot[1] = "Cump. Plan:";
        tot[2] = "Tn Empac.:";
        tot[3] = "Tn Prog.:";
        tot[4] = "Performance:";
        tot[5] = "DWT NoPlan:";
        tot[6] = "DWT NoAsig.:";
        break;
      case "fritas_L2":
        fila_0 = "MP";
        fila_1 = "hRum";
        fila_2 = "LR c/DWT";
        fila_3 = "LR Nominal";
        fila_4 = "Tn/hr";
        fila_16 = traducir("Hora");

        tot[0] = "Hs Rum:";
        tot[1] = "Cump. Plan:";
        tot[2] = "Tn Empac.:";
        tot[3] = "Tn Prog.:";
        tot[4] = "Performance:";
        tot[5] = "DWT NoPlan:";
        tot[6] = "DWT NoAsig.:";
        break;
      case "fritas_L1":
        fila_0 = "MP";
        fila_1 = "hRum";
        fila_2 = "LR c/DWT";
        fila_3 = "LR Nominal";
        fila_4 = "Tn/hr";
        fila_16 = traducir("Hora");

        tot[0] = "Hs Rum:";
        tot[1] = "Cump. Plan:";
        tot[2] = "Tn Empac.:";
        tot[3] = "Tn Prog.:";
        tot[4] = "Performance:";
        tot[5] = "DWT NoPlan:";
        tot[6] = "DWT NoAsig.:";
        break;
      case "pure":
        fila_0 = "MP";
        fila_1 = "hRum";
        fila_2 = "LR c/DWT";
        fila_3 = "LR Nominal";
        fila_4 = "Tn/hr";
        fila_16 = traducir("Hora");

        tot[0] = "Hs Rum:";
        tot[1] = "Cump. Plan:";
        tot[2] = "Tn Empac.:";
        tot[3] = "Tn Prog.:";
        tot[4] = "Performance:";
        tot[5] = "DWT NoPlan:";
        tot[6] = "DWT NoAsig.:";
        break;
      default:
        break;
    }
    // console.log(fila_0);
    tabla.rows[0].cells[2].innerText = fila_0;
    tabla.rows[1].cells[2].innerText = fila_1;
    tabla.rows[2].cells[2].innerText = fila_2;
    tabla.rows[3].cells[2].innerText = fila_3;
    tabla.rows[4].cells[2].innerText = fila_4;
    tabla.rows[16].cells[2].innerText = fila_16;

    for (let index = 0; index < 24; index++) {
      let agregar_cero = "";
      if (index < 10) {
        agregar_cero = "0";
      }
      let celda = agregar_cero + index + ":00"; // + (index + 1);
      tabla.rows[16].cells[index + 3].innerText = celda;
      tabla.rows[16].cells[index + 3].style.fontSize = "10px";
    }
    // console.log(tot);
    for (let i = 1; i < 8; i++) {
      tabla.rows[i].cells[0].innerText = tot[i - 1];
      tabla.rows[i].cells[0].style.fontWeight = "700";
      tabla.rows[i].cells[0].style.color = "#ff0000";
      tabla.rows[i].cells[0].style.textAlign = "right";
    }

    console.log('Sale del módulo armar_primer_Grafico')
  } catch (error) {
    console.warn(error)
    //!-----------------ERROR-----------------
        objetoError.qq='ins23';
        objetoError.descripcion='Error al intentar cargar la primera grilla.';
        objetoError.cod_error='ERR_COMPONENT';
        objetoError.gravedad='Grave';
        objetoError.typeerror=error.stack;
        objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
        objetoError.comentario='';
        console.log(objetoError.qq);
        insertarError(objetoError);
//!------------------------------------------
  }
}

export { armar_primerGrafico }