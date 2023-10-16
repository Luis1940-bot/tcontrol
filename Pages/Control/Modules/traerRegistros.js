// export default function traerRegistros(sql) {
//   // console.log(sql);
//   const rax = `&new=${new Date()}`;
//   const ruta = `../../../Pages/Control/Routes/traerRegistros.php?q=${sql}${rax}`;
//   fetch(ruta, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       resolve(data);
//     })
//     .catch((error) => {
//       // eslint-disable-next-line no-console
//       console.warn(error);
//     });
// }
export default function traerRegistros(sql) {
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const ruta = `../../../Pages/Control/Routes/traerRegistros.php?q=${sql}${rax}`;
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data); // Resuelve la promesa con los datos obtenidos
      })
      .catch((error) => {
        reject(error); // Rechaza la promesa en caso de error
      });
  });
}
