// // eslint-disable-next-line import/extensions
// import guardaNotas from './guardaNotas.js';

// const encabezados = {
//   titulo: 'Informe',
//   tipodeInforme: 'Nuevo',
//   title: [
//     'Acción', 'Concepto', 'Anterior', 'Actual', 'observación',
//   ],
//   width: [
//     '.2', '.2', '.2', '.2', '.2',
//   ],
// };

// const widthScreen = window.innerWidth * 0.8;
// let arrayWidthEncabezado;

// function trO(palabra, objTraductor) {
//   const palabraNormalizada = palabra.replace(/\s/g, '').toLowerCase();
//   const index = objTraductor.operativoES.findIndex(
//     (item) => item.replace(/\s/g, '').toLowerCase() === palabraNormalizada,
//   );
//   if (index !== -1) {
//     return objTraductor.operativoTR[index];
//   }
//   return palabra;
// }

// function estilosTheadCell(element, index) {
//   const cell = document.createElement('th');
//   if (index < 5) {
//     cell.textContent = trO(element.toUpperCase()) || element.toUpperCase();
//     cell.style.background = '#000000';
//     cell.style.border = '1px solid #cecece';
//     cell.style.overflow = 'hidden';
//     const widthCell = widthScreen * arrayWidthEncabezado[index];
//     cell.style.width = `${widthCell}px`;
//   } else {
//     cell.style.display = 'none';
//   }
//   return cell;
// }

// function crearEncabezados() {
//   const thead = document.getElementById('theadInforme');
//   const newRow = document.createElement('tr');
//   arrayWidthEncabezado = [...encabezados.width];
//   encabezados.title.forEach((element, index) => {
//     const cell = estilosTheadCell(element, index, objTraductor);
//     newRow.appendChild(cell);
//   });
//   thead.appendChild(newRow);
// }

// function informe(objetoMensaje, objetoControl) {
//   crearEncabezados();
//   const tbody = document.getElementById('tbodyInforme');
//   const valores = objetoMensaje.valor;
//   // eslint-disable-next-line no-plusplus
//   for (let i = 0; i < valores.length; i++) {
//     const element = valores[i];
//     console.log(element);
//   }
//   guardaNotas(objetoControl);
// }

// export default informe;
