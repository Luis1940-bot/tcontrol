// const SERVER = '/iControl-Vanilla/icontrol';
const SERVER = '../../../..'

export default function callProcedure(sql, desde, hasta) {
  // eslint-disable-next-line no-console
  console.time('callProcedure')
  return new Promise((resolve, reject) => {
    const rax = `&new=${new Date()}`
    const ruta = `${SERVER}/Pages/ConsultasViews/Routes/callProcedure.php?${rax}`
    const requestBody = {
      q: sql,
      desde,
      hasta,
    }

    const datos = JSON.stringify(requestBody)
    fetch(ruta, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: datos,
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data)
        // eslint-disable-next-line no-console
        console.timeEnd('callProcedure')
      })
      .catch((error) => {
        console.timeEnd('callProcedure')
        reject(error)
      })
  })
}
