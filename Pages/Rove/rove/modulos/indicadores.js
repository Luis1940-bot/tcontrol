import { insertarError } from "../../errores/manejadorDeErrores.js"
import { objetoError } from "../../errores/variable_global.js";


function indicadores(tabla,respuesta) {
  console.log("entramos en el módulo indicadores");
  //*realizamos los cálculos de los indicadores
  // console.log(tabla.getElementsByTagName("tr"));
  try {
    
    let tr = tabla.getElementsByTagName("tr");
    let td1 = tr[1].getElementsByTagName("td");
    let td2 = tr[2].getElementsByTagName("td");
    let td3 = tr[3].getElementsByTagName("td");
    let td4 = tr[4].getElementsByTagName("td");
    let td17 = "";
    // respuesta.length === 0 ? null : (td17 = tr[17].getElementsByTagName("td"));

    let contador = 0;
    let TnEmpacada = 0;
    let hRum = 0;
    let it = 0;
    let LRcDWT = 0;
    let LRNominal = 0;
    let DWTPlan = 0;
    let DWTNoPlan = 0;
    let DWTNoAsig = 0;
    let LRR = 0;
    let DWT = 0;
    //*cada for itera sobre la fila a todas las columnas iterator=lo que hay en la celda
    for (const iterator of td1) {
      iterator.textContent === "-"
        ? contador++
        : it > 2
        ? (hRum += parseFloat(iterator.textContent))
        : null;
      it++;
    }
    it = 0;
    for (const iterator of td2) {
      iterator.textContent === "-"
        ? null
        : it > 2
        ? (LRcDWT += parseFloat(iterator.textContent))
        : null;
      it++;
    }
    it = 0;
    for (const iterator of td3) {
      iterator.textContent === "-"
        ? null
        : it > 2
        ? (LRNominal += parseFloat(iterator.textContent))
        : null;
      it++;
    }
    it = 0;
    for (const iterator of td4) {
      iterator.textContent === "-"
        ? null
        : it > 2
        ? (TnEmpacada += parseFloat(iterator.textContent))
        : null;
      it++;
    }
    it = 0;
    for (const iterator of td17) {
      iterator.textContent.trim() === "LRR"
        ? (LRR += parseFloat(tabla.rows[18].cells[it].textContent))
        : iterator.textContent.trim() === "DWT"
        ? (DWT += parseFloat(tabla.rows[18].cells[it].textContent))
        : null;

      it++;
    }

    contador = 24 - contador;
    tabla.rows[1].cells[1].innerText = contador;
    tabla.rows[1].cells[1].style.fontWeight = "700";
    tabla.rows[1].cells[1].style.color = "#ff0000";
    tabla.rows[1].cells[1].style.textAlign = "left";
    tabla.rows[3].cells[1].innerText = TnEmpacada.toFixed(2); //!cargamos la tn emp
    tabla.rows[3].cells[1].style.fontWeight = "700";
    tabla.rows[3].cells[1].style.color = "#ff0000";
    tabla.rows[3].cells[1].style.textAlign = "left";
    tabla.rows[4].cells[1].innerText = (
      (hRum / contador) *
      (LRcDWT / contador)
    ).toFixed(2);
    tabla.rows[4].cells[1].style.fontWeight = "700";
    tabla.rows[4].cells[1].style.color = "#ff0000";
    tabla.rows[4].cells[1].style.textAlign = "left";
    tabla.rows[2].cells[1].innerText =
      (
        (tabla.rows[3].cells[1].textContent /
          tabla.rows[4].cells[1].textContent) *
        100
      ).toFixed(2) + "%";
    tabla.rows[2].cells[1].style.fontWeight = "700";
    tabla.rows[2].cells[1].style.color = "#ff0000";
    tabla.rows[2].cells[1].style.textAlign = "left";
    let TnEmpac = tabla.rows[3].cells[1].textContent;
    TnEmpac = TnEmpac / ((hRum / contador) * (LRNominal / contador));
    TnEmpac = TnEmpac * 100;
    tabla.rows[5].cells[1].innerText = TnEmpac.toFixed(2) + "%";
    tabla.rows[5].cells[1].style.fontWeight = "700";
    tabla.rows[5].cells[1].style.color = "#ff0000";
    tabla.rows[5].cells[1].style.textAlign = "left";

    //DWT
    for (let i = 19; i < tabla.rows.length; i++) {
      if (tabla.rows[i].cells[0].textContent.includes("NO PLANEADO")) {
        DWTNoPlan += parseFloat(tabla.rows[i].cells[2].textContent);
      } else if (tabla.rows[i].cells[0].textContent.includes("PLANEADO")) {
        DWTPlan += parseFloat(tabla.rows[i].cells[2].textContent);
      }
    }

    DWTNoPlan =
      DWTNoPlan +
      (LRR * 0.18) / 60 / parseFloat(tabla.rows[1].cells[1].textContent);
    tabla.rows[6].cells[1].innerText = DWTNoPlan.toFixed(2);
    tabla.rows[6].cells[1].style.fontWeight = "700";
    tabla.rows[6].cells[1].style.color = "#ff0000";
    tabla.rows[6].cells[1].style.textAlign = "left";

    DWTNoAsig = 100 - tabla.rows[3].cells[1].textContent - DWTNoPlan;

    tabla.rows[7].cells[1].innerText = DWTNoAsig.toFixed(2);
    tabla.rows[7].cells[1].style.fontWeight = "700";
    tabla.rows[7].cells[1].style.color = "#ff0000";
    tabla.rows[7].cells[1].style.textAlign = "left";
    console.log("salimos del módulo indicadores");
  } catch (error) {
    console.log(error);
     //!-----------------ERROR-----------------
        objetoError.qq='ins23';
        objetoError.descripcion='Error al realizar los cálculos de los indicadores del encabezado.';
        objetoError.cod_error='ERR_COMPONENT';
        objetoError.gravedad='Grave';
        objetoError.typeerror=error.stack;
        objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
        objetoError.comentario='';
        
        insertarError(objetoError);
//!------------------------------------------
  }
}

export { indicadores }