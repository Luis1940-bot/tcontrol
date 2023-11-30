// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..';

export default function traerRegistros(sql) {
  // eslint-disable-next-line no-console
  console.time('miTemporizador');
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`;
    const ruta = `${SERVER}/Pages/Control/Routes/traerRegistros.php?q=${sql}${rax}`;
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
        let vecesLoad = localStorage.getItem('loadSystem');
        vecesLoad = Number(vecesLoad) + 1;
        localStorage.setItem('loadSystem', vecesLoad);
        // eslint-disable-next-line no-console
        console.timeEnd('miTemporizador');
      })
      .catch((error) => {
        reject(error);
      });
  });
}
