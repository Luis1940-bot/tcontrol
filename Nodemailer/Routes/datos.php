<?php
header('Content-Type: text/html;charset=utf-8');

$configEmails = [
  '$Host' => 'mail.tenkiweb.com',
  '$Username' => 'alerta.tenki@tenkiweb.com',
  '$Password' => ']SDGGL}#p.Ba',
  '$Port' => 25,
  '$Factum' => 'tenkiweb.com/tcontrol'
];


$datox ='[{"name":"FECHA *","valor":"2024-07-15","detalle":"La fecha cuando se origina el control. ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"HORA *","valor":"11:28","detalle":"La hora del momento de la realización. ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"REPORTE DE PRUEBA ","valor":"","detalle":"","observacion":"","colSpanName":"4","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"none","displayDetalle":"none","displayObservacion":"none","image":""},{"name":"CONSULTAS ","valor":"photo","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"{\\"img\\": \\"consultas.png\\", \\"width\\" : 300, \\"height\\": 100}","displayObservacion":"","image":""},{"name":"PRIORIDAD ","valor":"Baja","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"FRECUENCIA ","valor":1,"detalle":"colocar las veces que ocurre el evento. ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"USUARIOS ","valor":"Luis Gimenez","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"REVISADO ","valor":"<input type=\\"checkbox\\"  checked disabled>","detalle":"------ ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"IMÁGEN ","valor":"","detalle":"","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""},{"name":"OBSERVACIÓN ","valor":"777777777777777","detalle":" ","observacion":"","colSpanName":"1","colSpanValor":"1","colSpanDetalle":"1","colSpanObservacion":"1","displayName":"","displayValor":"","displayDetalle":"","displayObservacion":"","image":""}]';

$plantx = '"15"';

$encabezadox ='{"documento":"240715162900928","address":"luisfactum@gmail.com","fecha":"2024-07-15","hora":"11:29","notificador":"Luis Gimenez","planta":"Alpek-PTAC Cosoleacaque","idPlanta":15,"reporte":"REPORFTE DE PRUEBA","titulo":"Notificação do sistema de alerta","url":"https://tenkiweb.com/tcontrol","fechaDeAlerta":"Data do alerta:","horaDeAlerta":"Tempo de alerta:","notifica":"Notificar","sistema":"Entre no sistema e acesse o número do documento","irA":"Vai","concepto":"Conceito","relevamiento":"Enquete","detalle":"Detalhe","observacion":"Observação","subject":"Sistema de Alerta","idLTYreporte":"14"}';

?>