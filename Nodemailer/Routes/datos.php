<?php
header('Content-Type: text/html;charset=utf-8');

$configEmails = [
  '$Host' => 'mail.tenkiweb.com',
  '$Username' => 'alerta.tenki@test.tenkiweb.com',
  '$Password' => '*j143@b3^c1v',
  '$Port' => 25,
  '$Factum' => 'tenkiweb.com/tcontrol'
];
//'$Password' => ']SDGGL}#p.Ba',

$datox = '[{"name":"FECHA","valor":"2025-06-25","detalle":"La fecha cuando se origina el control. ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"HORA","valor":"20:21","detalle":"La hora del momento de la realización. ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"REPORTE DE PRUEBA","valor":"","detalle":"","observacion":"","colSpanName":"4","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"none","displayDetalle":"none","displayObservacion":"none","image":""},{"name":"CONSULTAS","valor":"photo","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"{\"img\": \"consultas.png\", \"width\" : 807, \"height\": 577}","displayObservacion":"","image":""},{"name":"PRIORIDAD, a/b","valor":"Baja","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"FRECUENCIA","valor":15555,"detalle":"","observacion":"sssssssssssssssssssss","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"REVISADO","valor":"<input type=\"checkbox\"  checked disabled>","detalle":"------ ","observacion":"Baja","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"USUARIOS","valor":"Adalberto Márquez Carrera","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"INDIQUE EL TIPO DE USUARIO","valor":"","detalle":"","observacion":"","colSpanName":"4","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"none","displayDetalle":"none","displayObservacion":"none","image":""},{"name":"TIPO DE USUARIO","valor":"Colaborador","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"IMÁGEN","valor":"","detalle":"","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"TEXT TAREA","valor":"valor por defecto. entrada manual.vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv","detalle":"text tarea ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"DETALLE","valor":"26666666666666","detalle":"detalles ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"NOMBRES","valor":"initial","detalle":"nombres x ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"ESTA ES UNA LEYENDA","valor":"","detalle":"","observacion":"","colSpanName":"4","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"none","displayDetalle":"none","displayObservacion":"none","image":""},{"name":"nuevo selector","valor":"Media","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"LOTES","valor":"Adalberto Márquez Carrera ","detalle":" ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CONSULTA POR LOTES","valor":"","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CONSULTA X LOTE","valor":"","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"SUPERVISOR 1","valor":"Validado por Luis 15","detalle":" ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"SUPERVISOR 2","valor":"","detalle":"si es correcto ingrese su clave y valide. ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CHECK 1","valor":"20:22","detalle":" ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CHECK 2","valor":"AHORA","detalle":" ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"DATE","valor":"HOY","detalle":" ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"DATEHOUR","valor":"25.06.2025 20.22","detalle":" ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CMPO P","valor":"uuuuuuuuuuuuuuuuuuu","detalle":"","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"OTRO MAS","valor":"","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CAMPO 25","valor":"","detalle":"FLUJO DE VAPOR DE 5.3KG/CM² A LA TURBINA.. Rango 35 – 45 ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CAMPO PRUEBA","valor":"","detalle":"TON/HR ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"PRUEBA TRES","valor":"","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CAMPO PRUEBA1","valor":"","detalle":"detalle ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"CAMPO PRUEBA","valor":"","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"prueba cuatro xe44jx","valor":0,"detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"PASTILLA TEXTO","valor":"rara","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"papo","valor":0,"detalle":"tata ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"hola","valor":"","detalle":"lalala ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"pr1","valor":0,"detalle":"detalle1 ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"pr2","valor":0,"detalle":"detalle2 ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"pr3","valor":0,"detalle":"detalle3 ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"pr4","valor":0,"detalle":"detalle4 ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"RESULTADO","valor":0,"detalle":"24 HORAS ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"META","valor":0,"detalle":550,"observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"pastilla sel","valor":"Media","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"EXCEDENTE","valor":522,"detalle":">550 ","observacion":"ttttttttttttttt","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"PASTILLA CONSULTA","valor":"Aniceto Azamar Aleman","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"TABLA","valor":"","detalle":"2025-06-12","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"OBSERVACIÓN","valor":"prueba de guardado de cambios","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""}]';

$plantx = '"15"';

$encabezadox = '{"documento":"250625202328296","address":"undefined","fecha":"2025-06-27","hora":"09:36","notificador":"Luis 15","planta":"Alpek-PTAC Cosoleacaque","idPlanta":15,"reporte":"14-REPORTE DE PRUEBA","titulo":"Notificación del sistema de alerta","url":"https://tenkiweb.com/tcontrol","fechaDeAlerta":"Fecha de alerta:","horaDeAlerta":"Hora de alerta:","notifica":"Notifica","sistema":"Entre al sistema y acceda al documento número","irA":"Ir a","concepto":"concepto","relevamiento":"relevamiento","detalle":"detalle","observacion":"observación","subject":"Sistema de Alertas","idLTYreporte":14}';

$nuevoObjeto = 'Array(46) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
​
0: Object { name: "FECHA *", valor: "2025-05-26", detalle: "La fecha cuando se origina el control. ", … }
​
1: Object { name: "HORA *", valor: "18:23", detalle: "La hora del momento de la realización. ", … }
​
2: Object { name: "REPORTE DE PRUEBA ", colSpanName: "4", colSpanValor: "1", … }
​
3: Object { name: "CONSULTAS ", valor: "photo", detalle: "------ ", … }
​
4: Object { name: "PRIORIDAD, A/B ", valor: "Baja", detalle: "------ ", … }
​
5: Object { name: "FRECUENCIA ", valor: 1, colSpanName: "1", … }
​
6: Object { name: "REVISADO ", valor: "<input type="checkbox"  checked disabled>", detalle: "------ ", … }
​
7: Object { name: "USUARIOS ", valor: "Asiel Gómez Rubio", detalle: "------ ", … }
​
8: Object { name: "INDIQUE EL TIPO DE USUARIO ", colSpanName: "4", colSpanValor: "1", … }
​
9: Object { name: "TIPO DE USUARIO ", valor: "Jefe", detalle: "------ ", … }
​
10: Object { name: "IMÁGEN ", valor: "img", colSpanName: "1", … }
​
11: Object { name: "TEXT TAREA ", valor: "valor por defecto. entrada manual. prueba de envio x email", detalle: "text tarea ", … }
​
12: Object { name: "DETALLE ", valor: "2600", detalle: "detalles ", … }
​
13: Object { name: "NOMBRES ", valor: "inicial", detalle: "nombres x ", … }
​
14: Object { name: "ESTA ES UNA LEYENDA ", colSpanName: "4", colSpanValor: "1", … }
​
15: Object { name: "NUEVO SELECTOR ", valor: "Media", detalle: "------ ", … }
​
16: Object { name: "LOTES ", detalle: "consulta varia ", colSpanName: "1", … }
​
17: Object { name: "CONSULTA POR LOTES ", detalle: "------ ", colSpanName: "1", … }
​
18: Object { name: "CONSULTA X LOTE ", detalle: "------ ", colSpanName: "1", … }
​
19: Object { name: "SUPERVISOR 1 ", detalle: " ", colSpanName: "1", … }
​
20: Object { name: "SUPERVISOR 2 ", detalle: "si es correcto ingrese su clave y valide. ", colSpanName: "1", … }
​
21: Object { name: "CHECK 1 ", detalle: " ", colSpanName: "1", … }
​
22: Object { name: "CHECK 2 ", detalle: "------ ", colSpanName: "1", … }
​
23: Object { name: "DATE ", detalle: "------ ", colSpanName: "1", … }
​
24: Object { name: "DATEHOUR ", colSpanName: "1", colSpanValor: "1", … }
​
25: Object { name: "CMPO P ", detalle: "18.24", colSpanName: "1", … }
​
26: Object { name: "OTRO MAS ", detalle: "------ ", colSpanName: "1", … }
​
27: Object { name: "CAMPO 25 ", detalle: "FLUJO DE VAPOR DE 5.3KG/CM² A LA TURBINA.. Rango 35 – 45 ", colSpanName: "1", … }
​
28: Object { name: "CAMPO PRUEBA ", detalle: "TON/HR ", colSpanName: "1", … }
​
29: Object { name: "PRUEBA TRES ", detalle: "------ ", colSpanName: "1", … }
​
30: Object { name: "CAMPO PRUEBA1 ", detalle: "detalle ", colSpanName: "1", … }
​
31: Object { name: "CAMPO PRUEBA ", detalle: "------ ", colSpanName: "1", … }
​
32: Object { name: "PRUEBA CUATRO XE44JX ", detalle: "------ ", colSpanName: "1", … }
​
33: Object { name: "PASTILLA TEXTO ", valor: "hola", detalle: "------ ", … }
​
34: Object { name: "PAPO ", detalle: "tata ", colSpanName: "1", … }
​
35: Object { name: "HOLA ", detalle: "lalala ", colSpanName: "1", … }
​
36: Object { name: "PR1 ", detalle: "detalle1 ", colSpanName: "1", … }
​
37: Object { name: "PR2 ", detalle: "detalle2 ", colSpanName: "1", … }
​
38: Object { name: "PR3 ", detalle: "detalle3 ", colSpanName: "1", … }
​
39: Object { name: "PR4 ", detalle: "detalle4 ", colSpanName: "1", … }
​
40: Object { name: "RESULTADO ", detalle: "24 HORAS ", colSpanName: "1", … }
​
41: Object { name: "META ", detalle: "550 ", colSpanName: "1", … }
​
42: Object { name: "PASTILLA SEL ", valor: "pastillase", detalle: "------ ", … }
​
43: Object { name: "EXCEDENTE ", detalle: ">550 ", colSpanName: "1", … }
​
44: Object { name: "PASTILLA CONSULTA ", valor: "pastillaco", detalle: "------ ", … }
​
45: Object { name: "OBSERVACIÓN ", valor: "prueba de envio", detalle: "------ ", … }';

$encabeza = 'address: ""
​
concepto: "concepto"
​
detalle: "detalle"
​
documento: "250526182442398"
​
fecha: "2025-05-26"
​
fechaDeAlerta: "Fecha de alerta:"
​
hora: "18:24"
​
horaDeAlerta: "Hora de alerta:"
​
idLTYreporte: "14"
​
idPlanta: 15
​
irA: "Ir a"
​
notifica: "Notifica"
​
notificador: "Luis 15"
​
observacion: "observación"
​
planta: "Alpek-PTAC Cosoleacaque"
​
relevamiento: "relevamiento"
​
reporte: "14-REPORTE DE PRUEBA"
​
sistema: "Entre al sistema y acceda al documento número"
​
subject: "Sistema de Alertas"
​
titulo: "Notificación del sistema de alerta"
​
url: "https://tenkiweb.com/tcontrol"';
