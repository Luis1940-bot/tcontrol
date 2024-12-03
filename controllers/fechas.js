class fechasGenerator {
  static fecha_corta_ddmmyyyy(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    const year = date.getFullYear()
    month = (month < 10 ? '0' : '') + month
    day = (day < 10 ? '0' : '') + day
    return `${day}-${month}-${year}`
  }

  static fecha_corta_yyyymmdd(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    const year = date.getFullYear()
    month = (month < 10 ? '0' : '') + month
    day = (day < 10 ? '0' : '') + day
    return `${year}-${month}-${day}`
  }

  static fecha_larga_ddmmyyyyhhmm(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    const year = date.getFullYear()
    let hour = date.getHours()
    let min = date.getMinutes()

    month = (month < 10 ? '0' : '') + month
    day = (day < 10 ? '0' : '') + day
    hour = (hour < 10 ? '0' : '') + hour
    min = (min < 10 ? '0' : '') + min
    return `${day}-${month}-${year} ${hour}:${min}`
  }

  static fecha_larga_dateHour(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    const year = date.getFullYear()
    let hour = date.getHours()
    let min = date.getMinutes()

    month = (month < 10 ? '0' : '') + month
    day = (day < 10 ? '0' : '') + day
    hour = (hour < 10 ? '0' : '') + hour
    min = (min < 10 ? '0' : '') + min
    return `${day}.${month}.${year} ${hour}.${min}`
  }

  static fecha_larga_yyyymmddhhmm(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    const year = date.getFullYear()
    let hour = date.getHours()
    let min = date.getMinutes()

    month = (month < 10 ? '0' : '') + month
    day = (day < 10 ? '0' : '') + day
    hour = (hour < 10 ? '0' : '') + hour
    min = (min < 10 ? '0' : '') + min
    return `${year}-${month}-${day} ${hour}:${min}`
  }

  static hora_actual(date) {
    let hour = date.getHours()
    let min = date.getMinutes()
    hour = (hour < 10 ? '0' : '') + hour
    min = (min < 10 ? '0' : '') + min
    return `${hour}:${min}`
  }

  static nuxpedido(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    const year = date.getFullYear()
    let hour = date.getHours()
    let min = date.getMinutes()
    const sec = date.getSeconds()
    const milsec = date.getMilliseconds()
    month = (month < 10 ? '0' : '') + month
    day = (day < 10 ? '0' : '') + day
    hour = (hour < 10 ? '0' : '') + hour
    min = (min < 10 ? '0' : '') + min
    let codigoNux = year + month + day + hour + min + sec + milsec
    codigoNux = codigoNux.toString().substring(2, codigoNux.lenght)
    return codigoNux
  }
}

export default fechasGenerator
