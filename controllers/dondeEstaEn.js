import { trO } from './trOA.js'

function dondeEstaEn(objTranslate, donde) {
  const ustedEstaEn =
    `${trO('Usted está en', objTranslate)} ` || 'Usted está en'
  const nuevaCadena = `${trO(donde, objTranslate)} ` || donde
  document.getElementById('whereUs').innerText = `${ustedEstaEn} ${nuevaCadena}`
  document.getElementById('whereUs').style.display = 'block'
  return nuevaCadena
}

export { dondeEstaEn }
