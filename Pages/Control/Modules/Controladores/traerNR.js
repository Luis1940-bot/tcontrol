// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..';

export default function traerNR(nr) {
  // eslint-disable-next-line no-console
  console.time('traerNR');
  const sql = `ctrlCargado,${nr}`;
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
        // eslint-disable-next-line no-console
        console.timeEnd('traerNR');
      })
      .catch((error) => {
        reject(error);
      });
  });
}
