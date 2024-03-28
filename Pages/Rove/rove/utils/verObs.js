function verObs(e,i) {
    // console.log(i);
    const mensaje=i.split(',')
    let datosDocumento={
      doc:mensaje[1],
      control_N:mensaje[3],
      control_T:mensaje[4],
      nr:mensaje[5],
      ubicaciontecnica:mensaje[6],
      denominaciondeequipo:mensaje[7],
      componente:mensaje[8]
    }
    // console.log(datosDocumento)
    let mensajeManto='';
    datosDocumento.ubicaciontecnica?mensajeManto=`<h5>Ubic.Téc: ${datosDocumento.ubicaciontecnica}</h5>`:null;
    datosDocumento.denominaciondeequipo?mensajeManto+=`<h5>Equipo: ${datosDocumento.denominaciondeequipo}</h5>`:null;
    datosDocumento.componente?mensajeManto+=`<h5>Comp.: ${datosDocumento.componente}</h5>`:null;
    
    DOC_numero((datosDocumento))
    // Swal.fire({
    //   title:`Observaciones de ${mensaje[0]}`,
    //   html:`<div class="d-block justify-content-left align-items-center">${mensajeManto}</div><br><div>${mensaje[2]}</div>`,
    //   footer:`<span class="small">Haga click en el número del documento para visualizarlo  </span>&nbsp<a href="#" onclick='DOC_numero(${JSON.stringify(datosDocumento)})'>${mensaje[1]}</a>` ,
    // })
  }

function DOC_numero(documento) {
  
   let origen=window.location.origin;
   let pathname = window.location.pathname;
  pathname= pathname.replace("rove/rove.php","");
  if (documento) {
    let mensaje =
      "control_N=" +//numero de idLTYreporte
      documento.nr +
      "&" +
      "control_T=" +
      documento.control_T +//nombre del DWT reporte
      "&nr=" +
      documento.doc;//numero del doc
    window.open(origen+pathname+
      "control/index.php?" + mensaje + "&" + Math.round(Math.random() * 10),
      "_blank"
    );
  } else {
    Swal.fire({
      title: "<strong><u>Atención!</u></strong>",
      icon: "error",
      html: "Tiene que escribir un número de control existente.",
    });
  }
};
  window.verObs=verObs;
  window.DOC_numero=DOC_numero;

  export { verObs, DOC_numero }