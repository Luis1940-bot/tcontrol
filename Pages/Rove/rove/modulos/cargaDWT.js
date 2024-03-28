import { insertarError } from "../../errores/manejadorDeErrores.js"
import { objetoError } from "../../errores/variable_global.js";


let respuesta_modulo=0;
const paradasDWT={
  linea:[],
  DWT:{
    paradapor:{
      idLTYreporte:[],
      name_reporte:[],
      Doc:[],
      parada:[],
      ini:[],
      fin:[],
      diferencia:{
        dif:[],
        hora:[]
      },
      observaciones:{
        obs:[],
        doc:[]
      },
      impacto:{
        imp:[],
        demora:[],
        doc:[]
      },
      LRR:{
        lrr:[],
        velocidad:[],
        demora:[],
        doc:[]
      },

    },
    tipodemanto:{
      tipo_de_mantto:[],
      ubicaciontecnica:[],
      denominaciondeequipo:[],
      componente:[]
    }
  }
}


function CargaDWT(tabla,respuesta) {
  console.log("entramos al módulo CargaDWT");
  // console.log(respuesta)
  /**
   * TODO >>>>>>>>>>
   * * este módulo trae todos los DWT's de la fecha seleccionada. La consulta está ordenada por NUXPEDIDO y por el orden de los controles. Se debe representar agrupados primero por el campo[0] que es el ID de LTYreporte, por el campo[1] que es el nombre de la línea, por el campo[2] que es el nombre del DWT y por el campo[4] que es el nombre de la parada.
   * 
   * *En el renderizado la primera columna es el tipo de parada o DWT, el segundo campo es el número de documento o nuxpedido es el que tiene el link para ver la observación y para ir al documento en cuestión, la tercera columna es el total de minutos.
   * 
   * ! EXCEPCIONES >>>>>>>>>>>>>>
   * *Cuando la parada es por MANTENIMIENTO es necesario que se renderice el tipo de mantenimiento
   */
    // console.log(tabla);
    // console.log(respuesta)
    respuesta.length>0?console.log('Existen DWTs cargados para la fecha'):console.log('NO existen DWTs cargados para esta fecha');
    if (respuesta.length>0) {
      
       //* clonamos el array de respuesta en data
      let data = respuesta.slice();
      const result = [];
      //*eliminamos los repetidos y armamos un array de nuxpedido en result
      data.forEach((item) => {
        //pushes only unique element
        if (!result.includes(item[0])) {
          result.push(item[0]);
        }
      });
      recorro_result(tabla,result,respuesta);
      
    }else{
      respuesta_modulo=400
    }

};

function recorro_result(tabla,result,respuesta) {
  try {
    console.log('comienza recorrido en DWT para armar objeto');
     let filtrado ='';
     
    //*filtrado contiene un array con sólo los datos de cada num de reporte por vuelta del result.foreach
    // console.log(respuesta)
    const nuevoArray = respuesta.slice();
    // console.log(result)
     result.forEach(element => {
       filtrado = respuesta.filter((nux) => nux[0] === element);
      //armamos el objeto
      
     
      paradasDWT.linea.push(filtrado[0][1]);//! LINEA 
      // paradasDWT.DWT.name_reporte.push(filtrado[0][2]);//! NOMBRE DEL REPORTE
      // paradasDWT.DWT.Doc.push(filtrado[0][7]);//! DOCUMENTO
      let inicio=0;
      let diferencia=0;
      let filaComponente=0;
      
      // console.log(filtrado)
      for (let i = 0; i < filtrado.length; i++) {
        objetoError.filaError=i;
        objetoError.largoError=filtrado.length;

              if (filtrado[i][4].toLowerCase().replace(/\s+/g, "")==='iniciodeparada'){
                
                if (filtrado[i][5]!=filtrado[i+1][5]) {
                  //*encontramos una parada
                  objetoError.detalleError='encontramos una parada';
                  paradasDWT.DWT.paradapor.idLTYreporte.push(filtrado[i][0]);//! ID DEL REPORTE
                  paradasDWT.DWT.paradapor.name_reporte.push((filtrado[i][2]));//! NOMBRE DEL REPORTE
                  paradasDWT.DWT.paradapor.Doc.push(filtrado[i][7]);//! DOCUMENTO
                  objetoError.docError=filtrado[i][7];
                  inicio=filtrado[i][5].slice(0, 2);

                  
                  paradasDWT.DWT.paradapor.ini.push(filtrado[i][5]);//! INICIO
                  paradasDWT.DWT.paradapor.fin.push(filtrado[i+1][5]);//! FIN
                  diferencia=restoHoras(filtrado[i][5],filtrado[i+1][5]);
                  paradasDWT.DWT.paradapor.diferencia.dif.push(diferencia);//! DIFERENCIA
                  paradasDWT.DWT.paradapor.diferencia.hora.push(inicio);//! HORA DE LA DIFERENCIA
                  let name_control=(filtrado[i-1][4]);
                  
                  if (name_control.slice(0,10).toLocaleLowerCase().replace(/\s+/g,"")==='paradapor' || name_control.slice(0,9).toLocaleLowerCase().replace(/\s+/g,"")==='paradade') {

                    paradasDWT.DWT.paradapor.parada.push(name_control);//! NOMBRE DE PARADA
                    paradasDWT.DWT.tipodemanto.tipo_de_mantto.push('X');//! TIPO DE NOOOO MANTO
                    paradasDWT.DWT.tipodemanto.componente.push('X');//! TIPO DE NOOOO COMPONENTE
                    paradasDWT.DWT.tipodemanto.denominaciondeequipo.push('X');//! TIPO DE NOOOO DENOMINACION DE EQUIPO
                    paradasDWT.DWT.tipodemanto.ubicaciontecnica.push('X');//! TIPO DE NOOOO UBICACION TECNICA

                    objetoError.detalleError+='< NOMBRE:'+filtrado[i][2];

                  }else if(name_control.slice(0,7).toLocaleLowerCase().replace(/\s+/g,"")==='tipode' ){ 

                    paradasDWT.DWT.paradapor.parada.push(filtrado[i-2][4]);//! NOMBRE DE PARADA TIPO DE MANTO
                    paradasDWT.DWT.tipodemanto.tipo_de_mantto.push(filtrado[i-1][5]);//! TIPO DE MANTO
                   
                    objetoError.detalleError+='< NOMBRE:'+filtrado[i][2];
                    objetoError.detalleError+='< TIPO'+(filtrado[i-1][5]);

                    
                    i+2>filtrado.length?filaComponente=filtrado.length-1:filaComponente=i+2;
                   


                    filtrado[filaComponente][4].slice(0,17).toLocaleLowerCase().replace(/\s+/g,"")==='ubicacióntécnica' ||  filtrado[filaComponente][4].slice(0,17).toLocaleLowerCase().replace(/\s+/g,"")==='área'  ? filtrado[filaComponente][5]?paradasDWT.DWT.tipodemanto.ubicaciontecnica.push(filtrado[filaComponente][5]): paradasDWT.DWT.tipodemanto.ubicaciontecnica.push('X'):paradasDWT.DWT.tipodemanto.ubicaciontecnica.push('X');//! UBICACION TECNICA

                    objetoError.detalleError+='< ut:'+filtrado[filaComponente][5];
                    
                    i+3>filtrado.length?filaComponente=filtrado.length-1:filaComponente=i+3;

                    filtrado[filaComponente][4].slice(0,22).toLocaleLowerCase().replace(/\s+/g,"")==='denominacióndeequipo'  || filtrado[filaComponente][4].slice(0,22).toLocaleLowerCase().replace(/\s+/g,"")==='localizaçãofuncional' ? filtrado[filaComponente][5]?paradasDWT.DWT.tipodemanto.denominaciondeequipo.push(filtrado[filaComponente][5]): paradasDWT.DWT.tipodemanto.denominaciondeequipo.push('X'):paradasDWT.DWT.tipodemanto.denominaciondeequipo.push('X');//! DENOMINACION DE EQUIPO

                    objetoError.detalleError+='< de:'+filtrado[filaComponente][5];
                     
                    i+4>filtrado.length-1?filaComponente=filtrado.length-1:filaComponente=i+4;
                    
                     filtrado[filaComponente][4].slice(0,10).toLocaleLowerCase().replace(/\s+/g,"")==='componente' ? filtrado[filaComponente][5]?paradasDWT.DWT.tipodemanto.componente.push(filtrado[filaComponente][5]): paradasDWT.DWT.tipodemanto.componente.push('X'):paradasDWT.DWT.tipodemanto.componente.push('X');//! COMPONENTE

                     objetoError.detalleError+='< co:'+filtrado[filaComponente][5];
                  }
                  
                  filtrado[i][6]?(paradasDWT.DWT.paradapor.observaciones.obs.push(filtrado[i][6]),paradasDWT.DWT.paradapor.observaciones.doc.push(filtrado[i][7])):paradasDWT.DWT.paradapor.observaciones.obs.push('X');//!OBSERVACIONES

                  const esbaja=bajaenvelocidad(inicio,nuevoArray,diferencia, objetoError.docError);
                
                  esbaja?null:paradatotal(inicio,nuevoArray,diferencia, objetoError.docError);
                  // paradatotal(inicio,filtrado,i,diferencia);

                }
              };
              
      }
      
     });
     console.log('fin de armado de objeto en el módulo cargaDWT')
     return paradasDWT;
  } catch (error) {
   
     //!-----------------ERROR-----------------
        objetoError.qq='ins23';
        objetoError.descripcion='Error al intentar armar el objeo paradasDWT.';
        objetoError.cod_error='ERR_LOGICA';
        objetoError.gravedad='Grave';
        objetoError.typeerror=error.stack;
        objetoError.usuario=document.getElementById('carpeta_principal').textContent+'/'+document.querySelector('span.small').textContent;
        objetoError.comentario='El número de registro es: '+objetoError.filaError+'  >> el documento del error es: '+  objetoError.docError + ' de '+objetoError.largoError+' registros. Detalles:>> ' + objetoError.detalleError;
        
        insertarError(objetoError);
//!------------------------------------------
console.warn(error);
return
  }
};

function bajaenvelocidad(inicio,nuevoArray,diferencia,doc) {
const filter = nuevoArray.filter((nux) => nux[7] === doc);
              for (let x = 0; x < filter.length; x++) {
                 if (filter[x][4].toLowerCase().replace(/\s+/g, "")==='bajaenlavelocidad'){
                  inicio.length>1?(paradasDWT.DWT.paradapor.LRR.lrr.push('LRR'+inicio),paradasDWT.DWT.paradapor.LRR.demora.push(diferencia),paradasDWT.DWT.paradapor.LRR.doc.push(filter[x][7])):null;//! HORA DE LA LRR
                  filter[x][6]?paradasDWT.DWT.paradapor.LRR.velocidad.push(filter[x][6]):null;//! OBSERVACIÓN DE LA LRR
                  objetoError.detalleError+='< bv:'+('LRR'+inicio);
                   return true;
               };
              }
             return false
}

function paradatotal(inicio,nuevoArray,diferencia,doc) {
  const filter = nuevoArray.filter((nux) => nux[7] === doc);
  for (let x = 0; x < filter.length; x++) {
            if (filter[x][4].toLowerCase().replace(/\s+/g, "")==='paradatotal'){
                  inicio.length>1?(paradasDWT.DWT.paradapor.impacto.imp.push('DWT'+inicio),paradasDWT.DWT.paradapor.impacto.demora.push(diferencia),paradasDWT.DWT.paradapor.impacto.doc.push(filter[x][7])):null;//! HORA DE LA PARADA TOTAL
                  objetoError.detalleError+='< bv:'+('DWT'+inicio);
                  break;
               };
  }
  return;
}

function restoHoras(ini,fin) {
  const minutos1 = horaToMinutos(ini);
  const minutos2 = horaToMinutos(fin);
  const diferenciaMinutos = minutos2 - minutos1;
  return diferenciaMinutos
};
function horaToMinutos(hora) {
  // Separar las horas y los minutos
  const [horas, minutos] = hora.split(":").map(Number);

  // Convertir las horas a minutos y sumar los minutos
  const totalMinutos = horas * 60 + minutos;

  return totalMinutos;
};



export { CargaDWT, respuesta_modulo,paradasDWT };