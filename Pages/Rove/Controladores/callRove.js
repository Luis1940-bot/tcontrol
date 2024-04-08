// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..'

export default function callRove(q, desde, hasta) {
  // eslint-disable-next-line no-console
  console.time('callRove')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    const ruta = `${SERVER}/Routes/index.php`
    const requestBody = {
      q,
      desde,
      hasta,
      rax,
      ruta: '/callRove',
    }
    const datos = JSON.stringify(requestBody)
    // console.log(datos)
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'Access-Control-Allow-Origin': '*',
      },
      body: datos,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        resolve(data)
        // eslint-disable-next-line no-console
        console.timeEnd('callRove')
      })
      .catch((error) => {
        console.timeEnd('callRove')
        reject(error)
      })
  })
}
