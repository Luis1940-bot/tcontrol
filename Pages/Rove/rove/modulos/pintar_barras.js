function pintar_barras(tabla){
  console.log("entramos al módulo pintar_barras")
  try {
    let colores={
            blanco:"#FFFFFF",
            rojo:"#FF0000",
            verde:"#00FF00"
          };
    for (let c = 3; c <= 26; c++) {
      // for (let r = 6; r <= 15; r++) {
        if (tabla.rows[4].cells[c].textContent!="0") {
          let lr= parseFloat(tabla.rows[3].cells[c].textContent);
          let tn=parseFloat(tabla.rows[4].cells[c].textContent);
          let tn_lr=(tn/lr*100).toFixed(0);
          let estandar=parseFloat(tabla.rows[5].cells[c].textContent);
          let colorFondo=colores.blanco;
          tn/lr<estandar?colorFondo=colores.rojo:colorFondo=colores.verde;
          let ejeX=0;
          let filaFinal=6;
          for (let r = 15; r >=6; r--) {
            if (tn_lr>=ejeX && colorFondo===colores.rojo) {
              tabla.rows[r].cells[c].style.backgroundColor=colorFondo;
              filaFinal=r;
            }else if(tn_lr>=estandar && colorFondo===colores.verde){
              tabla.rows[r].cells[c].style.backgroundColor=colorFondo;
            }
            ejeX=ejeX+10;
          }
          tabla.rows[filaFinal].cells[c].textContent=`${(tn/lr*100).toFixed(1)}%`;
          tabla.rows[filaFinal].cells[c].style.fontWeight = "900"
        }
      // }     
    }
    console.log('sale del módulo pintar_barras')
  } catch (e) {
    console.error(e,"By Luis Gimenez")
  }
}

export { pintar_barras }