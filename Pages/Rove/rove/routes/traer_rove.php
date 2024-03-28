<?php
// echo 'prueba1'.'<br>---------------------------------------<br>';
header("Content-Type: text/html;charset=utf-8");
     
        $variable=$_GET['q'];//'controlesDia,2020-04-26,36'
        $new=$_GET['new'];   
        $sql='';
        
        
        $porciones = explode(",", $variable);

        switch ($porciones[0]) {
            case 'xxxxxx':
                // $sql="SELECT  LTYreporte.nombre, LTYreporte.idLTYreporte, LTYreporte.detalle FROM LTYreporte  WHERE LTYreporte.activo='s' ORDER BY LTYreporte.nombre ASC;";
                $sql="";

                break;
            

            case 'trae_Rove':
              $desde=$porciones[1]; 
              $hasta=$porciones[2];
              $filtro=urldecode($porciones[3]);
              $sql="SELECT SQL_NO_CACHE /*trae_Rove*/
                          m.idLTYreporte  AS ID
                          ,RIGHT(LTYreporte.nombre,3) AS especialidad
                          ,m.horaautomatica AS horaa
                          ,DATE_FORMAT(m2.valor,'%Y-%m-%d') AS fecha
                          ,HOUR(m1.valor) AS hora
                          ,SUM(m.valor) AS kg
                          ,LTYcontrol.valor_defecto AS estandar
                          ,COUNT(m.nuxpedido) AS veces
                          ,(LTYcontrol.valor_defecto*COUNT(m.nuxpedido)) AS est
                          ,ROUND((SUM(m.valor)/(
                          SELECT 
                          rq.valor 
                          FROM LTYregistrocontrol rr, LTYregistrocontrol rw, LTYregistrocontrol rq
                          WHERE rr.idLTYreporte=165 AND rq.idLTYreporte=165 AND rw.idLTYreporte=165
                          AND rq.nuxpedido=rr.nuxpedido AND rw.nuxpedido=rr.nuxpedido
                          AND rw.desvio='est6' AND rw.valor='TARGET BATCH'
                          AND rr.desvio='est5' AND rr.valorS = m.idLTYreporte
                          AND rq.desvio='est7'
                          LIMIT 1
                          ))*100,0) AS productividad
                          ,(
                              SELECT 
                            rq.valor 
                            FROM LTYregistrocontrol rr, LTYregistrocontrol rq
                            WHERE rr.idLTYreporte=165 AND rq.idLTYreporte=165 
                            AND rq.nuxpedido=rr.nuxpedido
                            AND rr.desvio='est5' AND rr.valorS = m.idLTYreporte
                            AND rq.desvio='est7'
                            LIMIT 1
                            ) AS target
                            ,(
                              SELECT 
                            rq.observacion 
                            FROM LTYregistrocontrol rr, LTYregistrocontrol rq
                            WHERE rr.idLTYreporte=165 AND rq.idLTYreporte=165 
                            AND rq.nuxpedido=rr.nuxpedido
                            AND rr.desvio='est5' AND rr.valorS = m.idLTYreporte
                            AND rq.desvio='est7'
                            LIMIT 1
                          ) AS um
                          ,
                          (
                          SELECT 
                          rq.valor 
                          FROM LTYregistrocontrol rr, LTYregistrocontrol rw, LTYregistrocontrol rq
                          WHERE rr.idLTYreporte=165 AND rq.idLTYreporte=165 AND rw.idLTYreporte=165
                          AND rq.nuxpedido=rr.nuxpedido AND rw.nuxpedido=rr.nuxpedido
                          AND rw.desvio='est6' AND rw.valor='TARGET LÃNEA'
                          AND rr.desvio='est5' AND rr.valorS = m.idLTYreporte
                          AND rq.desvio='est7'
                          LIMIT 1
                          ) AS STD
                          FROM LTYregistrocontrol m, LTYregistrocontrol m1, LTYregistrocontrol m2
                          INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=m2.idLTYreporte
                          INNER JOIN LTYcontrol ON LTYcontrol.idLTYreporte=m2.idLTYreporte
                          WHERE m1.nuxpedido=m.nuxpedido AND m2.nuxpedido=m.nuxpedido AND LTYcontrol.control=m.desvio AND 
                          ".$filtro."
                          AND (m.desvio='altbatesp3' OR m.desvio='altbatnoiredsal3' OR m.desvio='altbatnoijamque3' OR m.desvio='altbatnoifinhie3' 
                          OR m.desvio='altbatnoimarbla3' OR m.desvio='altbatsmi3' OR m.desvio='altbatmin3' OR m.desvio='altbatemo3'
                          OR m.desvio='altbataro3')
                          AND (m1.desvio='altbatesp2' OR m1.desvio='altbatnoiredsal2' OR m1.desvio='altbatnoijamque2' OR m1.desvio='altbatnoifinhie2' 
                          OR m1.desvio='altbatnoimarbla2' OR m1.desvio='altbatsmi2' OR m1.desvio='altbatmin2' OR m1.desvio='altbatemo2'
                          OR m1.desvio='altbataro2')
                          AND (m2.desvio='altbatesp1' OR m2.desvio='altbatnoiredsal1' OR m2.desvio='altbatnoijamque1' OR m2.desvio='altbatnoifinhie1' 
                          OR m2.desvio='altbatnoimarbla1' OR m2.desvio='altbatsmi1' OR m2.desvio='altbatmin1' OR m2.desvio='altbatemo1'
                          OR m2.desvio='altbataro1')
                          AND DATE_FORMAT(m2.valor,'%Y-%m-%d')>='".$desde."' AND DATE_FORMAT(m2.valor,'%Y-%m-%d')<='".$hasta."'
                          GROUP BY HOUR(m1.valor)
                          ORDER BY DATE_FORMAT(m2.valor,'%Y-%m-%d') ASC, HOUR(m1.valor) ASC;";
              break;

            case 'trae_Rove_Fritas':

                break;
            case 'cargar_CTRL_ROVE_especialidades':
                $sql="SELECT SQL_NO_CACHE
                          LTYreporte.nombre
                          ,r.idLTYcontrol
                          ,r.control
                          ,r.nombre
                          ,r.tipodato
                          ,r.idLTYreporte
                          FROM LTYcontrol r
                          INNER JOIN LTYreporte ON r.idLTYreporte=LTYreporte.idLTYreporte
                          WHERE r.idLTYreporte=164 OR (r.idLTYreporte>=141 AND r.idLTYreporte<=160)
                          AND r.activo='s' AND (r.tipodato='subt' OR r.tipodato='b')
                          ORDER BY r.idLTYreporte ASC, r.orden ASC;";
                break;

            case 'cargar_DWT_ROVE':
                  $sql="SELECT SQL_NO_CACHE
                              LTYreporte.nombre
                              ,c.idLTYcontrol
                              ,c.control
                              ,c.nombre
                              ,c.tipodato
                              ,c.idLTYreporte
                              FROM LTYcontrol c
                              INNER JOIN LTYreporte ON c.idLTYreporte=LTYreporte.idLTYreporte
                              WHERE c.idLTYreporte=164 OR (c.idLTYreporte>=141 AND c.idLTYreporte<=160)
                              AND c.activo='s'
                              ORDER BY c.idLTYreporte ASC, c.orden ASC;";
                  break;
            case 'cargar_DWT_ROVE_especialidades':
                    $desde=$porciones[1]; 
                    $hasta=$porciones[2];
                     $filtro=urldecode($porciones[3]);
                    $sql="SELECT SQL_NO_CACHE
                              r1.nuxpedido AS nux
                              ,r1.idLTYreporte AS idreporte
                              ,r.valor AS fecha
                              ,r1.desvio AS desvio
                              ,c.orden AS orden
                              ,c.nombre AS control
                              ,(SELECT t.valor FROM LTYregistrocontrol t WHERE t.desvio=r1.desvio AND t.nuxpedido=r1.nuxpedido
                              ) AS valorX
                              ,r1.tipodedato AS tipodedato
                              ,if(LEFT(c.nombre,3)='INI','INI',if(LEFT(c.nombre,3)='FIN','FIN','')) AS ini_fin
                              ,r1.observacion AS observacion
                              ,p.nombre AS reporte
                              ,p.rotulo3 AS sector
                              FROM LTYregistrocontrol r
                              INNER JOIN LTYregistrocontrol r1 ON r1.nuxpedido=r.nuxpedido
                              INNER JOIN LTYcontrol c ON c.control=r1.desvio
                              INNER JOIN LTYreporte p ON p.idLTYreporte=r1.idLTYreporte
                              WHERE 
                              ".$filtro."
                              AND r.tipodedato='d'
                              AND r.valor>='".$desde."' AND r.valor<='".$hasta."'
                              ORDER BY r1.nuxpedido ASC, c.orden ASC;";
                    break;

            case 'estand_CTRL':
                      $sql="SELECT SQL_NO_CACHE c.idLTYreporte, c.valor, c1.valor
                                FROM LTYregistrocontrol c, LTYregistrocontrol c1  
                                WHERE c.idLTYreporte=165 AND c1.idLTYreporte=165 AND c1.nuxpedido=c.nuxpedido
                                AND c.desvio='est10' AND c1.desvio='est7' GROUP BY c.nuxpedido;";
                    break;
            case 'estfritas_L2':
                          //?estandares
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT 
                              fecha
                              ,mp
                              ,round(hrum,0)
                              ,round(cap,1)
                              ,round(lr,0)
                              ,round(fc,1)
                              ,round(kg,0)
                              ,round(HOUR(hora),0)
                              FROM 
                              ( 
                              SELECT
                              c.valor AS fecha
                              ,c1.valor AS hora
                              ,c2.valor AS kg
                              ,avg(c3.valor) AS hrum
                              ,avg(c4.valor) AS cap
                              ,avg(c5.valor) AS lr
                              ,avg(c6.valor) AS fc
                              ,if(LTYregistrocontrol.idLTYreporte=193 AND LTYregistrocontrol.desvio='tonfir5',LTYregistrocontrol.valor,'-') AS mp
                              FROM LTYregistrocontrol c,LTYregistrocontrol c1,LTYregistrocontrol c2
                              ,LTYregistrocontrol c3,LTYregistrocontrol c4,LTYregistrocontrol c5
                              ,LTYregistrocontrol c6
                              INNER JOIN LTYregistrocontrol ON LTYregistrocontrol.nuxpedido=c6.nuxpedido 
                              WHERE 
                              c.idLTYreporte=193 AND 
                              c.desvio='tonfir1' AND c.valor>='".$desde."' AND c.valor<='".$hasta."'
                              AND c1.nuxpedido=c.nuxpedido
                              AND c1.desvio='tonfir2'
                              AND c2.nuxpedido=c.nuxpedido
                              AND c2.desvio='tonfir13'
                              AND c3.nuxpedido=c.nuxpedido
                              AND c3.desvio='tonfir9'
                              AND c4.nuxpedido=c.nuxpedido
                              AND c4.desvio='tonfir10'
                              AND c5.nuxpedido=c.nuxpedido
                              AND c5.desvio='tonfir11'
                              AND c6.nuxpedido=c.nuxpedido
                              AND c6.desvio='tonfir12'


                              GROUP BY c1.valor
                              ORDER BY c1.valor ASC 

                              ) AS SUBQ";
                        break;

            case 'estfritas_L1':
                          //?estandares
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT SQL_NO_CACHE
                          fecha
                          ,IFNULL(mp,'-')
                          ,ROUND(hrum,0)
                          ,ROUND(cap,1)
                          ,ROUND(lr,0)
                          ,ROUND(fc,1)
                          ,ROUND(kilos,0)
                          ,ROUND(hora,0)
                          FROM 
                          (
                          SELECT
                          c.valor AS fecha, 
                          (SELECT LTYregistrocontrol.valor FROM LTYregistrocontrol  WHERE LTYregistrocontrol.nuxpedido=c.nuxpedido
                          AND LTYregistrocontrol.idLTYreporte=231 AND LTYregistrocontrol.desvio='tonfril14') AS mp
                          ,AVG(c2.valor) AS hrum, 
                          AVG(c3.valor) AS cap, AVG(c4.valor) AS lr, AVG(c5.valor) AS fc, 
                          SUM(c6.valor) AS kilos, HOUR(c7.valor) AS hora
                          FROM LTYregistrocontrol c,LTYregistrocontrol c2 
                          ,LTYregistrocontrol c3,LTYregistrocontrol c4,LTYregistrocontrol c5
                          ,LTYregistrocontrol c6,LTYregistrocontrol c7
                          WHERE c.idLTYreporte=231  AND c2.idLTYreporte=231 AND c3.idLTYreporte=231
                          AND c4.idLTYreporte=231 AND c5.idLTYreporte=231 AND c6.idLTYreporte=231
                          AND c.valor>='".$desde."' AND c.valor<='".$hasta."'
                          AND c2.nuxpedido=c.nuxpedido AND c3.nuxpedido=c.nuxpedido
                          AND c4.nuxpedido=c.nuxpedido AND c5.nuxpedido=c.nuxpedido AND c6.nuxpedido=c.nuxpedido AND c7.nuxpedido=c.nuxpedido
                          AND c.desvio='tonfril11' 
                          AND c2.desvio='tonfril18' AND c3.desvio='tonfril19' AND c4.desvio='tonfril110' 
                          AND c5.desvio='tonfril111' AND c6.desvio='tonfril112' AND c7.desvio='tonfril12' GROUP BY HOUR(c7.valor) ORDER BY c7.valor ASC 
                          )as SUBQ;";
                        break;
            case 'estespecialidades':
                    //?estandares
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT SQL_NO_CACHE
                          fecha
                          ,IFNULL(mp,'-')
                          ,hrum
                          ,cap
                          ,lr
                          ,fc
                          ,kilos
                          ,hora
                          FROM 
                          (
                          SELECT
                          c.valor AS fecha, 
                          (SELECT LTYregistrocontrol.valor FROM LTYregistrocontrol  WHERE LTYregistrocontrol.nuxpedido=c.nuxpedido
                          AND LTYregistrocontrol.idLTYreporte=268 AND LTYregistrocontrol.desvio='tonesp4') AS mp
                          ,AVG(c2.valor) AS hrum, 
                          AVG(c3.valor) AS cap, AVG(c4.valor) AS lr, AVG(c5.valor) AS fc, 
                          SUM(c6.valor) AS kilos, HOUR(c7.valor) AS hora
                          FROM LTYregistrocontrol c,LTYregistrocontrol c2 
                          ,LTYregistrocontrol c3,LTYregistrocontrol c4,LTYregistrocontrol c5
                          ,LTYregistrocontrol c6,LTYregistrocontrol c7
                          WHERE c.idLTYreporte=268  AND c2.idLTYreporte=268 AND c3.idLTYreporte=268
                          AND c4.idLTYreporte=268 AND c5.idLTYreporte=268 AND c6.idLTYreporte=268
                          AND c.valor>='".$desde."' AND c.valor<='".$hasta."'
                          AND c2.nuxpedido=c.nuxpedido AND c3.nuxpedido=c.nuxpedido
                          AND c4.nuxpedido=c.nuxpedido AND c5.nuxpedido=c.nuxpedido AND c6.nuxpedido=c.nuxpedido AND c7.nuxpedido=c.nuxpedido
                          AND c.desvio='tonesp1' 
                          AND c2.desvio='tonesp8' AND c3.desvio='tonesp9' AND c4.desvio='tonesp10' 
                          AND c5.desvio='tonesp11' AND c6.desvio='tonesp12' AND c7.desvio='tonesp2' GROUP BY HOUR(c7.valor) ORDER BY c7.valor ASC 
                          )as SUBQ;";
              break;
            case 'estpure':
                    //?estandares
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT 
                                    fecha
                                    ,mp
                                    ,round(hrum,0)
                                    ,round(cap,1)
                                    ,round(lr,0)
                                    ,round(fc,1)
                                    ,round(kg,0)
                                    ,round(HOUR(hora),0)
                                    FROM 
                                    ( 
                                    SELECT
                                    c.valor AS fecha
                                    ,c1.valor AS hora
                                    ,c2.valor AS kg
                                    ,avg(c3.valor) AS hrum
                                    ,avg(c4.valor) AS cap
                                    ,avg(c5.valor) AS lr
                                    ,avg(c6.valor) AS fc
                                    ,if(LTYregistrocontrol.idLTYreporte=295 AND LTYregistrocontrol.desvio='tonpur4',LTYregistrocontrol.valor,'-') AS mp
                                    FROM LTYregistrocontrol c,LTYregistrocontrol c1,LTYregistrocontrol c2
                                    ,LTYregistrocontrol c3,LTYregistrocontrol c4,LTYregistrocontrol c5
                                    ,LTYregistrocontrol c6
                                    INNER JOIN LTYregistrocontrol ON LTYregistrocontrol.nuxpedido=c6.nuxpedido 
                                    WHERE 
                                    c.idLTYreporte=295 AND 
                                    c.desvio='tonpur1' AND c.valor>='".$desde."' AND c.valor<='".$hasta."'/*fecha*/
                                    AND c1.nuxpedido=c.nuxpedido
                                    AND c1.desvio='tonpur2'/*hora*/
                                    AND c2.nuxpedido=c.nuxpedido
                                    AND c2.desvio='tonpur12'/*kilos*/
                                    AND c3.nuxpedido=c.nuxpedido
                                    AND c3.desvio='tonpur8'/*hrum*/
                                    AND c4.nuxpedido=c.nuxpedido
                                    AND c4.desvio='tonpur9'/*cap*/
                                    AND c5.nuxpedido=c.nuxpedido
                                    AND c5.desvio='tonpur10'/*lr*/
                                    AND c6.nuxpedido=c.nuxpedido
                                    AND c6.desvio='tonpur11'/*fc*/


                                    GROUP BY c1.valor
                                    ORDER BY c1.valor ASC 

                                    ) AS SUBQ;";
              break;
            case 'dwtfritas_L2':
                          //?cabeceras
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT SQL_NO_CACHE
                                num_reporte
                                ,'FRITAS L2'
                                ,name_reporte
                                ,num_control
                                ,name_control
                                ,horas
                                ,obs
                                ,nux
                                ,orden_control
                               /* ,IFNULL(TIPO_MANTTO,'') */
                                FROM
                                (
                                SELECT 
                                m.idLTYreporte AS num_reporte
                                ,m1.valor AS horas
                                ,m1.idLTYcontrol AS num_control
                                ,(SELECT LTYcontrol.nombre FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control) AS name_control
                                ,(SELECT LTYcontrol.orden FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control) AS orden_control
                                ,m1.observacion AS obs
                                ,m.nuxpedido AS nux
                                ,(SELECT LTYreporte.nombre FROM LTYreporte WHERE LTYreporte.idLTYreporte=num_reporte) AS name_reporte
                               /* ,(SELECT m2.valor
											FROM LTYregistrocontrol m2
											WHERE m2.nuxpedido=m1.nuxpedido AND  m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO*/
                                FROM LTYregistrocontrol m, LTYregistrocontrol m1
                                WHERE 
                                (m.idLTYreporte>=195 AND m.idLTYreporte<=201 OR m.idLTYreporte>=206 AND m.idLTYreporte<=213 OR m.idLTYreporte>=220 AND m.idLTYreporte<=230) 
										            AND (m1.idLTYreporte>=195 AND m1.idLTYreporte<=201 OR m1.idLTYreporte>=206 AND m1.idLTYreporte<=213 OR m1.idLTYreporte>=220 AND m1.idLTYreporte<=230)
                                AND m1.nuxpedido=m.nuxpedido
                                AND m.tipodedato='d' AND m.valor>='".$desde."' AND m.valor<='".$hasta."'
                                AND (m1.tipodedato='h' OR m1.tipodedato='subt' OR m1.tipodedato='r' OR m1.tipodedato='s' OR m1.tipodedato='sd')
                                ORDER BY   num_reporte ASC, nux ASC,orden_control ASC  
                                ) as SUBQ";//,num_control ASC

                          break;
                            
            case 'dwtfritas_L1':
                  //?cabeceras
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT SQL_NO_CACHE
                                num_reporte
                                ,'FRITAS L1'
                                ,name_reporte
                                ,num_control
                                ,name_control
                                ,horas
                                ,obs
                                ,nux
                                ,orden_control
                               /* ,IFNULL(TIPO_MANTTO,'')*/
                                FROM
                                (
                                SELECT 
                                m.idLTYreporte AS num_reporte
                                ,m1.valor AS horas
                                ,m1.idLTYcontrol AS num_control
                                ,(SELECT LTYcontrol.nombre FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control) AS name_control
                                ,(SELECT LTYcontrol.orden FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control ORDER BY LTYcontrol.orden ASC) AS orden_control
                                ,m1.observacion AS obs
                                ,m.nuxpedido AS nux
                                ,(SELECT LTYreporte.nombre FROM LTYreporte WHERE LTYreporte.idLTYreporte=num_reporte) AS name_reporte
                               /* ,(SELECT m2.valor
                                FROM LTYregistrocontrol m2
                                WHERE m2.nuxpedido=m1.nuxpedido AND  m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO*/
                                FROM LTYregistrocontrol m, LTYregistrocontrol m1
                                WHERE 
                                (m.idLTYreporte>=232 AND m.idLTYreporte<=242 OR m.idLTYreporte>=257 AND m.idLTYreporte<=261 OR m.idLTYreporte>=263 AND m.idLTYreporte<=267 OR m.idLTYreporte=225) AND 
										            (m1.idLTYreporte>=232 AND m1.idLTYreporte<=242 OR m1.idLTYreporte>=257 AND m1.idLTYreporte<=261 OR m1.idLTYreporte>=263 AND m1.idLTYreporte<=267 OR m1.idLTYreporte=225)
                                AND m1.nuxpedido=m.nuxpedido
                                AND m.tipodedato='d' AND m.valor>='".$desde."' AND m.valor<='".$hasta."'
                                AND (m1.tipodedato='h' OR m1.tipodedato='subt' OR m1.tipodedato='r'  OR m1.tipodedato='s'  OR m1.tipodedato='sd')
                                ORDER BY   num_reporte ASC, nux ASC,orden_control ASC  
                                ) as SUBQ;";//,num_control ASC
                break;

            case 'dwtespecialidades':
                          //?cabeceras
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT SQL_NO_CACHE
                                num_reporte
                                ,'ESPECIALIDADES'
                                ,name_reporte
                                ,num_control
                                ,name_control
                                ,horas
                                ,obs
                                ,nux
                                ,orden_control
                               /* ,IFNULL(TIPO_MANTTO,'')*/
                                FROM
                                (
                                SELECT 
                                m.idLTYreporte AS num_reporte
                                ,m1.valor AS horas
                                ,m1.idLTYcontrol AS num_control
                                ,(SELECT LTYcontrol.nombre FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control) AS name_control
                                ,(SELECT LTYcontrol.orden FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control) AS orden_control
                                ,m1.observacion AS obs
                                ,m.nuxpedido AS nux
                                ,(SELECT LTYreporte.nombre FROM LTYreporte WHERE LTYreporte.idLTYreporte=num_reporte) AS name_reporte
                               /* ,(SELECT m2.valor
                                FROM LTYregistrocontrol m2
                                WHERE m2.nuxpedido=m1.nuxpedido AND  m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO*/
                                FROM LTYregistrocontrol m, LTYregistrocontrol m1
                                WHERE 
                                (m.idLTYreporte>=141 AND m.idLTYreporte<=142 OR m.idLTYreporte>=145 AND m.idLTYreporte<=146 
										            OR m.idLTYreporte>=159 AND m.idLTYreporte<=160 OR m.idLTYreporte>=269 AND m.idLTYreporte<=270 
										            OR m.idLTYreporte>=272 AND m.idLTYreporte<=285
										            OR m.idLTYreporte=225) AND 
                                (m1.idLTYreporte>=141 AND m1.idLTYreporte<=142 OR m1.idLTYreporte>=145 AND m1.idLTYreporte<=146 
                                OR m1.idLTYreporte>=159 AND m1.idLTYreporte<=160 OR m1.idLTYreporte>=269 AND m1.idLTYreporte<=270
                                OR m1.idLTYreporte>=272 AND m1.idLTYreporte<=285
                                OR m1.idLTYreporte=225)
                                AND m1.nuxpedido=m.nuxpedido
                                AND m.tipodedato='d' AND m.valor>='".$desde."' AND m.valor<='".$hasta."'
                                AND (m1.tipodedato='h' OR m1.tipodedato='subt' OR m1.tipodedato='r'  OR m1.tipodedato='s'  OR m1.tipodedato='sd')
                                ORDER BY   num_reporte ASC, nux ASC,orden_control ASC  
                                ) as SUBQ";
              break;

            case 'dwtpure':
                  //?cabeceras
                          $desde=$porciones[1]; 
                          $hasta=$porciones[1];
                          $sql="SELECT SQL_NO_CACHE
                                num_reporte
                                ,'PURÉ'
                                ,name_reporte
                                ,num_control
                                ,name_control
                                ,horas
                                ,obs
                                ,nux
                                ,orden_control
                               /* ,IFNULL(TIPO_MANTTO,'')*/
                                FROM
                                (
                                SELECT 
                                m.idLTYreporte AS num_reporte
                                ,m1.valor AS horas
                                ,m1.idLTYcontrol AS num_control
                                ,(SELECT LTYcontrol.nombre FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control) AS name_control
                                ,(SELECT LTYcontrol.orden FROM LTYcontrol WHERE LTYcontrol.idLTYcontrol=num_control) AS orden_control
                                ,m1.observacion AS obs
                                ,m.nuxpedido AS nux
                                ,(SELECT LTYreporte.nombre FROM LTYreporte WHERE LTYreporte.idLTYreporte=num_reporte) AS name_reporte
                               /* ,(SELECT m2.valor
                                  FROM LTYregistrocontrol m2
                                  WHERE m2.nuxpedido=m1.nuxpedido AND  m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO*/
                                FROM LTYregistrocontrol m, LTYregistrocontrol m1
                                WHERE 
                                (m.idLTYreporte>=216 AND m.idLTYreporte<=219 OR m.idLTYreporte>=286 AND m.idLTYreporte<=293 
                                OR m.idLTYreporte=271) AND 
                                (m1.idLTYreporte>=216 AND m1.idLTYreporte<=219 OR m1.idLTYreporte>=286 AND m1.idLTYreporte<=293 
                                OR m1.idLTYreporte=271)
                                AND m1.nuxpedido=m.nuxpedido
                                AND m.tipodedato='d' AND m.valor>='".$desde."' AND m.valor<='".$hasta."'
                                AND (m1.tipodedato='h' OR m1.tipodedato='subt' OR m1.tipodedato='r'  OR m1.tipodedato='s'  OR m1.tipodedato='sd')
                                ORDER BY   num_reporte ASC, nux ASC,orden_control ASC  
                                ) as SUBQ";//,num_control ASC
              break;
            case 'docfritas_L1':
                      $desde=$porciones[1]; 
                      $hasta=$porciones[1];
                      $sql="SELECT SQL_NO_CACHE
                          fecha
                          ,ROUND(hora,0)
                          ,nux
                          ,idrepo
                          ,repo
                          FROM 
                          (
                          SELECT
                          c.valor AS fecha, 
                          HOUR(c7.valor) AS hora
                          ,c.nuxpedido AS nux
                          ,c.idLTYreporte AS idrepo
                          ,LTYreporte.nombre AS repo
                          FROM LTYregistrocontrol c 
                          ,LTYregistrocontrol c7
                          INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=231
                          WHERE c.idLTYreporte=231   
                          AND c.valor>='".$desde."' AND c.valor<='".$hasta."'
                          AND c7.nuxpedido=c.nuxpedido
                          AND c.desvio='tonfril11' 
                          AND c7.desvio='tonfril12' GROUP BY (nux) ORDER BY c7.valor ASC 
                          )as SUBQ;";
                    break;
                    case 'docfritas_L2':
                      $desde=$porciones[1]; 
                      $hasta=$porciones[1];
                      $sql="SELECT SQL_NO_CACHE
                          fecha
                          ,ROUND(hora,0)
                          ,nux
                          ,idrepo
                          ,repo
                          FROM 
                          (
                          SELECT
                          c.valor AS fecha, 
                          HOUR(c7.valor) AS hora
                          ,c.nuxpedido AS nux
                          ,c.idLTYreporte AS idrepo
                          ,LTYreporte.nombre AS repo
                          FROM LTYregistrocontrol c 
                          ,LTYregistrocontrol c7
                          INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=193
                          WHERE c.idLTYreporte=193   
                          AND c.valor>='".$desde."' AND c.valor<='".$hasta."'
                          AND c7.nuxpedido=c.nuxpedido
                          AND c.desvio='tonfir1' 
                          AND c7.desvio='tonfir2' GROUP BY (nux) ORDER BY c7.valor ASC 
                          )as SUBQ;";
                    break;
                  case 'docespecialidades':
                      $desde=$porciones[1]; 
                      $hasta=$porciones[1];
                      $sql="SELECT SQL_NO_CACHE
                          fecha
                          ,ROUND(hora,0)
                          ,nux
                          ,idrepo
                          ,repo
                          FROM 
                          (
                          SELECT
                          c.valor AS fecha, 
                          HOUR(c7.valor) AS hora
                          ,c.nuxpedido AS nux
                          ,c.idLTYreporte AS idrepo
                          ,LTYreporte.nombre AS repo
                          FROM LTYregistrocontrol c 
                          ,LTYregistrocontrol c7
                          INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=268
                          WHERE c.idLTYreporte=268   
                          AND c.valor>='".$desde."' AND c.valor<='".$hasta."'
                          AND c7.nuxpedido=c.nuxpedido
                          AND c.desvio='tonesp1' 
                          AND c7.desvio='tonesp2' GROUP BY (nux) ORDER BY c7.valor ASC 
                          )as SUBQ;";
                    break;
                  case 'docpure':
                      $desde=$porciones[1]; 
                      $hasta=$porciones[1];
                      $sql="SELECT SQL_NO_CACHE
                          fecha
                          ,ROUND(hora,0)
                          ,nux
                          ,idrepo
                          ,repo
                          FROM 
                          (
                          SELECT
                          c.valor AS fecha, 
                          HOUR(c7.valor) AS hora
                          ,c.nuxpedido AS nux
                          ,c.idLTYreporte AS idrepo
                          ,LTYreporte.nombre AS repo
                          FROM LTYregistrocontrol c 
                          ,LTYregistrocontrol c7
                          INNER JOIN LTYreporte ON LTYreporte.idLTYreporte=295
                          WHERE c.idLTYreporte=295   
                          AND c.valor>='".$desde."' AND c.valor<='".$hasta."'
                          AND c7.nuxpedido=c.nuxpedido
                          AND c.desvio='tonpur1' 
                          AND c7.desvio='tonpur2' GROUP BY (nux) ORDER BY c7.valor ASC 
                          )as SUBQ;";
                    break;
            default:
                # code...
                break;
        }

        
        // echo $sql.'<br>'; 
        include_once '..//../datos_base.php';
        // $q = $_GET['q'];
        $pdo = new PDO("mysql:host={$host};dbname={$dbname};port={$port};chartset={$chartset}",$user,$password);

        try {
        
            // $con='';
            $con = mysqli_connect($host,$user,$password,$dbname);
            if (!$con) {
                // die('Could not connect: ' . mysqli_error($con));
            };
            
            mysqli_query ($con,"SET NAMES 'utf8'");
            mysqli_select_db($con,$dbname);
            
          
            $result = mysqli_query($con,$sql);
            
            $arr_customers = array();
            
            $cantidadcampos = mysqli_num_fields($result);
            
            $contador = 0;
            while($row=mysqli_fetch_array($result)) {
                
                //******************************************** */
                for ($x = 0; $x <= $cantidadcampos-1; $x++) {
                
                    $sincorchetes=$row[$x];
                    
                    $arr_customers[$contador][$x] = $row[$x];
                }
                $contador++;
            }
            $arr_customers = str_replace("[","",$arr_customers);
            $arr_customers = str_replace("]","",$arr_customers);
            $arr_customers = str_replace("(","",$arr_customers);
            $arr_customers = str_replace(")","",$arr_customers);

          

            $json = json_encode($arr_customers);
            // MANDA EL JSON.
            echo $json;
        
            mysqli_close($con);
            $pdo=null;
            
        } catch (\PDOException $e) {
            print "Error!: ".$e->getMessage()."<br>";
            die();
        }
   
?>