function fecha_corta_ddmmyyyy(date){
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
   month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  return  day + "-" + month + "-" + year;
}

function fecha_corta_yyyymmdd(date){
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
   month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  return  year + "-" + month + "-" + day;
}

function fecha_larga_ddmmyyyyhhmm(date){
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hour = date.getHours();
  let min = date.getMinutes();
  
   month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  return  day + "-" + month + "-" + year + " " +hour +":" + min;
}

function fecha_larga_yyyymmddhhmm(date){
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hour = date.getHours();
  let min = date.getMinutes();
  
   month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  return  year + "-" + month + "-" + day + " " +hour +":" + min;
}

export  { 
  fecha_corta_ddmmyyyy,
  fecha_corta_yyyymmdd,
  fecha_larga_ddmmyyyyhhmm,
  fecha_larga_yyyymmddhhmm
 } ;
