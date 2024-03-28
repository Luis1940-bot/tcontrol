
import { contenidoRow } from "./insertarFila.js";
import { insertarError } from "../../errores/manejadorDeErrores.js"
import { objetoError } from "../../errores/variable_global.js";
import { traducir } from "../../traducciones/variables/traducir.js";




function pintamos(paradasDWT,tabla) {
  try {
    console.log("modulo para pintar DWTs");
    // console.log((paradasDWT));
   
          
    var arrayLRR=[...paradasDWT.DWT.paradapor.LRR.lrr.slice(),...paradasDWT.DWT.paradapor.LRR.doc.slice()];
    var arrayDWT=[...paradasDWT.DWT.paradapor.impacto.imp.slice(),...paradasDWT.DWT.paradapor.impacto.doc.slice()];
    
     let ultima_fila= document.getElementById(tabla.id).rows.length-1;
    const name_reporte=paradasDWT.DWT.paradapor.name_reporte.slice();
    const resultN = [];
    
    name_reporte.forEach((item) => {
        //pushes only unique element
        if (!resultN.includes(item)) {
          resultN.push(item);
        }
      });
     
    let i=0;
    let DWT='';
    
    
     


    while (i<paradasDWT.DWT.paradapor.Doc.length) { 
      
      if (DWT!=paradasDWT.DWT.paradapor.name_reporte[i]) {
        //? agrego una fila gris con el nombre del reporte
        agregamosRow(tabla,"lightgrey");
        ultima_fila++;
        tabla.rows[ultima_fila].cells[0].innerText =traducir(paradasDWT.DWT.paradapor.name_reporte[i]);
        negrita(tabla,ultima_fila,0);
        DWT=paradasDWT.DWT.paradapor.name_reporte[i];
        // console.log(paradasDWT.DWT.paradapor.name_reporte[i])
         agregamosRow(tabla,"transparent");
         ultima_fila++;
         let paradaTipo='';
         paradasDWT.DWT.paradapor.parada[i].toLowerCase().replace(/\s+/g, "")==='paradapormantenimiento'?paradaTipo='paradapormantenimiento':paradaTipo='';
        
         addRow(ultima_fila,i,paradasDWT,tabla,arrayLRR,arrayDWT,paradaTipo);
       
        i++;

      }else if(paradasDWT.DWT.paradapor.parada[i].toLowerCase().replace(/\s+/g, "")==='paradapormantenimiento'){
         agregamosRow(tabla,"transparent");
         ultima_fila++;
         addRow(ultima_fila,i,paradasDWT,tabla,arrayLRR,arrayDWT,'paradapormantenimiento')
      
        i++;
        
      }else{
         agregamosRow(tabla,"transparent");
        ultima_fila++;
         addRow(ultima_fila,i,paradasDWT,tabla,arrayLRR,arrayDWT,'')
        i++
      }
    }
    
    calculoDeTotales(tabla,ultima_fila);

  } catch (error) {
    console.warn(error)
     //!-----------------ERROR-----------------
        objetoError.qq='ins23';
        objetoError.descripcion='Error al agregar una fila nueva.';
        objetoError.cod_error='ERR_COMPONENT';
        objetoError.gravedad='Grave';
        objetoError.typeerror=error.stack;
        objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
        objetoError.comentario='';
        
        insertarError(objetoError);
//!------------------------------------------
  }
}

function addRow(ultima_fila,i,paradasDWT,tabla,arrayLRR,arrayDWT,paradaPorManto) {
  let Parada =paradasDWT.DWT.paradapor.parada[i];
  let celdaDoc=paradasDWT.DWT.paradapor.Doc[i];
  let observaciones=paradasDWT.DWT.paradapor.observaciones[i];
  let control_N=paradasDWT.linea[0];
  let control_T=paradasDWT.DWT.paradapor.name_reporte[i];
  let nr=paradasDWT.DWT.paradapor.idLTYreporte[i];
  let tipoDeParada='';
  let componente='';
  paradasDWT.DWT.tipodemanto.componente[i]!='X'?componente=paradasDWT.DWT.tipodemanto.componente[i]:componente='';
  let denominaciondeequipo='';
  paradasDWT.DWT.tipodemanto.denominaciondeequipo[i]!='X'?denominaciondeequipo=paradasDWT.DWT.tipodemanto.denominaciondeequipo[i]:denominaciondeequipo='';
  let ubicaciontecnica='';
  paradasDWT.DWT.tipodemanto.ubicaciontecnica[i]!='X'?ubicaciontecnica=paradasDWT.DWT.tipodemanto.ubicaciontecnica[i]:ubicaciontecnica='';
 
  paradasDWT.DWT.paradapor.observaciones.doc[i]===celdaDoc?observaciones=(paradasDWT.DWT.paradapor.observaciones.obs[i]):observaciones='No hay observaciones.';
  let mensaje=[Parada,celdaDoc,observaciones,control_N,control_T,nr,ubicaciontecnica,denominaciondeequipo,componente]
  
  let nuevoTag = `<div><a  name="tagA" href="#" onClick="verObs(this,'${mensaje}')"  >${celdaDoc}</a><i class="fa fa-info-circle fa-1x text-success !${celdaDoc}" aria-hidden="true" title="Haga click para Informe"></i></div>`;


   paradaPorManto==='paradapormantenimiento'?tipoDeParada=paradasDWT.DWT.paradapor.parada[i]+' '+paradasDWT.DWT.tipodemanto.tipo_de_mantto[i]:tipoDeParada=paradasDWT.DWT.paradapor.parada[i];

  tabla.rows[ultima_fila].cells[0].innerText =traducir(tipoDeParada);
        negrita(tabla,ultima_fila,0);
        tabla.rows[ultima_fila].cells[1].innerHTML =nuevoTag;
        negrita(tabla,ultima_fila,1);
        divideTiempoEnSesenta(paradasDWT,tabla,ultima_fila,i,arrayLRR,arrayDWT);
       
}



function agregamosRow(tabla,colorFondo) {
   //* agregamos una linea al final
      let contenidoClase = contenidoRow(
        '"border-top-0 border-bottom-0 border-left-0 font-weight-bold "' ,
         `style="font-size:10px; width:5px;text-align:center;background-color: ${colorFondo};"`,
          `style="font-size:10px; width:5px;text-align:center;background-color: ${colorFondo};"`,
           `style="font-size:10px; width:5px;text-align:center;background-color: ${colorFondo};"`,
      `style="font-size:10px; width:5px;text-align:center;background-color: ${colorFondo};"`,
        ""
      );
      $(`#${tabla.id}`).append(contenidoClase);
};

function divideTiempoEnSesenta(paradasDWT,tabla,ultima_fila,i,arrayLRR,arrayDWT){
try {
        let columna=parseInt(paradasDWT.DWT.paradapor.diferencia.hora[i])+3;
        let diferencia = parseInt(paradasDWT.DWT.paradapor.diferencia.dif[i]);
        //* LRR-DWT
      let objetColores={
        tipopd:'',
        clrfondo:'',
        txtcolor:''
      }

        objetColores = ponerColores(i,tabla,paradasDWT,arrayLRR,arrayDWT);
        
        let tipoDeImpacto=objetColores.tipopd;
        let colorFondo=objetColores.clrfondo;
        let textColor=objetColores.txtcolor;

        
        let agregaColumna=0;
        let  valorFila_18=0;
        let valorColumnaTotal=0;
        diferencia<0?(diferencia=0,colorFondo='#000000',textColor='white'):(diferencia=diferencia,colorFondo=colorFondo,textColor=textColor)
        while (diferencia>60) {
          diferencia=diferencia - 60;
           tabla.rows[ultima_fila].cells[columna+agregaColumna].innerHTML =60;
           valorFila_18=tabla.rows[18].cells[columna+agregaColumna].textContent;
          valorFila_18===''?valorFila_18=0:null;
          tabla.rows[18].cells[columna+agregaColumna].innerText= parseInt(valorFila_18)+60;
          negrita(tabla,18,columna+agregaColumna);
          negrita(tabla,ultima_fila,columna+agregaColumna);
          colorDeFondo(tabla, ultima_fila,columna+agregaColumna,colorFondo);
          colorDeTexto(tabla,ultima_fila,columna+agregaColumna,textColor);
          valorColumnaTotal=tabla.rows[ultima_fila].cells[2].textContent;
          valorColumnaTotal===''?valorColumnaTotal=0:null;
          tabla.rows[ultima_fila].cells[2].innerText= parseInt(valorColumnaTotal)+60;
          negrita(tabla,ultima_fila,2);
          colorDeTexto(tabla,ultima_fila,2,"#FF0000");

          //*acumulamos en la fila 17
          tabla.rows[17].cells[columna+agregaColumna].innerHTML =tipoDeImpacto;
           negrita(tabla,17,columna+agregaColumna);
         
          //*sumamos parciales por hora
           sumaParcialporHora(tabla,ultima_fila,columna+agregaColumna,60)

          agregaColumna++;
        }
        tabla.rows[ultima_fila].cells[columna+agregaColumna].innerHTML =diferencia;
        valorFila_18=tabla.rows[18].cells[columna+agregaColumna].textContent;
          valorFila_18===''?valorFila_18=0:null;
         tabla.rows[18].cells[columna+agregaColumna].innerText= parseInt(valorFila_18)+diferencia;
          negrita(tabla,18,columna+agregaColumna);
          negrita(tabla,ultima_fila,columna+agregaColumna);
          colorDeFondo(tabla, ultima_fila,columna+agregaColumna,colorFondo);
           colorDeTexto(tabla,ultima_fila,columna+agregaColumna,textColor);
           valorColumnaTotal=tabla.rows[ultima_fila].cells[2].textContent;
          valorColumnaTotal===''?valorColumnaTotal=0:null;
          tabla.rows[ultima_fila].cells[2].innerText= parseInt(valorColumnaTotal)+diferencia;
          negrita(tabla,ultima_fila,2);
          colorDeTexto(tabla,ultima_fila,2,"#FF0000");

          tabla.rows[17].cells[columna+agregaColumna].innerHTML =tipoDeImpacto;
           negrita(tabla,17,columna+agregaColumna);

           //*sumamos parciales por hora
           sumaParcialporHora(tabla,ultima_fila,columna+agregaColumna,diferencia)
          
       
} catch (error) {
  console.warn(error);
   //!-----------------ERROR-----------------
        objetoError.qq='ins23';
        objetoError.descripcion='Error al dividir en 60 segundos.';
        objetoError.cod_error='ERR_COMPONENT';
        objetoError.gravedad='Grave';
        objetoError.typeerror=error.stack;
        objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
        objetoError.comentario='';
        
        insertarError(objetoError);
//!------------------------------------------
}
};

function ponerColores(i,tabla,paradasDWT,arrayLRR,arrayDWT) {
  //* esta función pinta de colores según LRR-DWT
  //* viene de divideTiemposEnSesenta
try {
  const Colores={
        tipopd:'',
        clrfondo:'',
        txtcolor:''
      }
  if (arrayLRR.length>0) {
    
    var mitadDeArray=parseInt(arrayLRR.length/2);
    
    for (let r = 0; r < arrayLRR.length; r++) {
      const lrr = arrayLRR[r];
      const doc=arrayLRR[r+mitadDeArray];
  
      if ('LRR'+paradasDWT.DWT.paradapor.diferencia.hora[i]===lrr && paradasDWT.DWT.paradapor.Doc[i]===doc ) {
        
        arrayLRR.splice(r+mitadDeArray,1);
        arrayLRR.splice(r,1);
        
   let contenidoFila_17= tabla.rows[17].cells[i].textContent;
          switch (contenidoFila_17) {
                case '':
                    Colores.tipopd="LRR";
                    break;
                case 'DWT':
                    Colores.tipopd="DWT/LRR";
                    break;
                case 'LRR/DWT':
                    Colores.tipopd='LRR/DWT';
                    break;
                case 'DWT/LRR':
                    Colores.tipopd='DWT/LRR';
                    break;
                  default:
                    Colores.tipopd="LRR";
                    break;
              }
      Colores.clrfondo='#BB8FCE';
      Colores.txtcolor='black';
      
  }
       break;
      }

    };
     
  //* ///////////////////////////////////////////////////
  if (arrayDWT.length>0) {
    
    var mitadDeArray=parseInt(arrayDWT.length/2);
    
    for (let r = 0; r < arrayDWT.length; r++) {
      const imp = arrayDWT[r];
      const doc=arrayDWT[r+mitadDeArray];

      if ('DWT'+paradasDWT.DWT.paradapor.diferencia.hora[i]===imp && paradasDWT.DWT.paradapor.Doc[i]===doc ) {
        
        arrayDWT.splice(r+mitadDeArray,1);
        arrayDWT.splice(r,1);
        
   let contenidoFila_17= tabla.rows[17].cells[i].textContent;
          switch (contenidoFila_17) {
                case '':
                    Colores.tipopd="DWT";
                    break;
                case 'LRR':
                    Colores.tipopd="'LRR/DWT";
                    break;
                case 'LRR/DWT':
                    Colores.tipopd='LRR/DWT';
                    break;
                case 'DWT/LRR':
                    Colores.tipopd='DWT/LRR';
                    break;
                  default:
                    Colores.tipopd="DWT";
                    break;
              }
      Colores.clrfondo='#FF333C';
      Colores.txtcolor='whait';
      
  }
       break;
      }

    };

  //* //////////////////////////////////////////////////
  return Colores;
} catch (error) {
  console.warn(error);
   //!-----------------ERROR-----------------
        objetoError.qq='ins23';
        objetoError.descripcion='Error al dividir en 60 segundos.';
        objetoError.cod_error='ERR_COMPONENT';
        objetoError.gravedad='Grave';
        objetoError.typeerror=error.stack;
        objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
        objetoError.comentario='';
        
        insertarError(objetoError);
//!------------------------------------------
}
  return
}

function negrita(tabla,row,col) {
  tabla.rows[row].cells[col].style.fontWeight = "900";
}
function colorDeFondo(tabla, row,col,colorFondo){
  tabla.rows[row].cells[col].style.backgroundColor = colorFondo;
  if (colorFondo==='#000000') {
    // tabla.rows[row].cells[1].style.backgroundColor = colorFondo;
    tabla.rows[row].cells[0].innerHTML =tabla.rows[row].cells[0].textContent+`<br><i class="fa fa-exclamation-triangle fa-2x text-danger" aria-hidden="true"></i>`;
  }

}
function colorDeTexto(tabla,row,col,textColor){
  tabla.rows[row].cells[col].style.color = textColor;
}


function calculoDeTotales(tabla,ultima_fila){
  try {
    console.log('entramos al módulo de totales');
    //*agregamos 0 en la fila 18 donde está vació
    let filaDWT=18;
   
    for (let c = 3; c <= 26; c++) {
      tabla.rows[filaDWT].cells[c].textContent===''?tabla.rows[filaDWT].cells[c].innerText=0:null      
    }

    //*sumamos los minutos de la columna 2 y colocamos el parcial en las cabeceras de DWT
   let parcial=0;
   
    for (let r = ultima_fila; r >= filaDWT; r--) {
      tabla.rows[r].cells[2].style.backgroundColor==='lightgrey'?(tabla.rows[r].cells[2].innerText=parcial,parcial=0,negrita(tabla,r,2),colorDeTexto(tabla,r,2,"#FF0000")):parcial+=parseInt(tabla.rows[r].cells[2].textContent);
    }
    
    //*agregamos 0 donde está vacío
    var celdas = tabla.getElementsByTagName("td");
    
    for (var i = 0; i < celdas.length; i++) {
      !celdas[i].innerHTML && i>494?(celdas[i].innerHTML = "0",celdas[i].style.color='lightgrey'):null;
    }
    console.log('salimos del módulo de totales')
  } catch (error) {
    console.log(error);
  }
}

function sumaParcialporHora(tabla,rowActual,colActual,minutos) {
  try {
     let parcial=0;
     let swap=true;
    for (let r = rowActual; r >=19; r--) {
              let valorCelda=tabla.rows[r].cells[colActual].textContent;
              !valorCelda?valorCelda=0:valorCelda=parseInt(valorCelda);
             tabla.rows[r].cells[colActual].style.backgroundColor==='lightgrey'?(tabla.rows[r].cells[colActual].innerText=parcial,parcial=0,negrita(tabla,r,colActual),swap=false):parcial+=valorCelda;
             if (!swap) {
                break;
             }
    }
  } catch (error) {
    console.log(error);
  }
}





export { pintamos }