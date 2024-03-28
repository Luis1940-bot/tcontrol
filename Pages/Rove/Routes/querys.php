<?php
header('Content-Type: text/html;charset=utf-8');

function obtenerConsulta($query, $desde, $hasta) {
$sql = null;
 switch ($query) {
          case 'docespecialidades':
            $sql = "SELECT 
                        SQL_NO_CACHE
                        fecha,
                        ROUND(hora, 0),
                        nux,
                        idrepo,
                        repo
                    FROM 
                        (
                        SELECT
                            c.valor AS fecha, 
                            HOUR(c7.valor) AS hora,
                            c.nuxpedido AS nux,
                            c.idLTYreporte AS idrepo,
                            LTYreporte.nombre AS repo
                        FROM 
                            LTYregistrocontrol c 
                            INNER JOIN LTYregistrocontrol c7 ON c7.nuxpedido = c.nuxpedido
                            INNER JOIN LTYreporte ON LTYreporte.idLTYreporte = 268
                        WHERE 
                            c.idLTYreporte = 268   
                            AND c.valor >= '".$desde."' 
                            AND c.valor <= '".$hasta."'
                            AND c.desvio = 'tonesp1' 
                            AND c7.desvio = 'tonesp2' 
                        GROUP BY 
                            nux 
                        ORDER BY 
                            c7.valor ASC 
                        ) AS SUBQ;";
            break;
          case 'docfritas_L1':
            $sql = "SELECT 
                        SQL_NO_CACHE
                        fecha,
                        ROUND(hora, 0),
                        nux,
                        idrepo,
                        repo
                    FROM 
                        (
                        SELECT
                            c.valor AS fecha, 
                            HOUR(c7.valor) AS hora,
                            c.nuxpedido AS nux,
                            c.idLTYreporte AS idrepo,
                            LTYR.nombre AS repo
                        FROM 
                            LTYregistrocontrol c 
                            INNER JOIN LTYregistrocontrol c7 ON c7.nuxpedido = c.nuxpedido
                            INNER JOIN LTYreporte LTYR ON LTYR.idLTYreporte = 231
                        WHERE 
                            c.idLTYreporte = 231   
                            AND c.valor >= '".$desde."' 
                            AND c.valor <= '".$hasta."'
                            AND c.desvio = 'tonfril11' 
                            AND c7.desvio = 'tonfril12' 
                        GROUP BY 
                            nux 
                        ORDER BY 
                            c7.valor ASC 
                        ) AS SUBQ;";
            break;

          case 'docfritas_L2':
            $sql = "SELECT 
                        SQL_NO_CACHE
                        fecha,
                        ROUND(hora, 0),
                        nux,
                        idrepo,
                        repo
                    FROM 
                        (
                        SELECT
                            c.valor AS fecha, 
                            HOUR(c7.valor) AS hora,
                            c.nuxpedido AS nux,
                            c.idLTYreporte AS idrepo,
                            LTYreporte.nombre AS repo
                        FROM 
                            LTYregistrocontrol c 
                            INNER JOIN LTYregistrocontrol c7 ON c7.nuxpedido = c.nuxpedido
                            INNER JOIN LTYreporte ON LTYreporte.idLTYreporte = 193
                        WHERE 
                            c.idLTYreporte = 193   
                            AND c.valor >= '".$desde."' 
                            AND c.valor <= '".$hasta."'
                            AND c.desvio = 'tonfir1' 
                            AND c7.desvio = 'tonfir2' 
                        GROUP BY 
                            nux 
                        ORDER BY 
                            c7.valor ASC 
                        ) AS SUBQ;
                    ";

            break;
            
          case 'docpure': 
            $sql = "SELECT 
                        SQL_NO_CACHE
                        fecha,
                        ROUND(hora, 0),
                        nux,
                        idrepo,
                        repo
                    FROM 
                        (
                        SELECT
                            c.valor AS fecha, 
                            HOUR(c7.valor) AS hora,
                            c.nuxpedido AS nux,
                            c.idLTYreporte AS idrepo,
                            LTYreporte.nombre AS repo
                        FROM 
                            LTYregistrocontrol c 
                            INNER JOIN LTYregistrocontrol c7 ON c7.nuxpedido = c.nuxpedido
                            INNER JOIN LTYreporte ON LTYreporte.idLTYreporte = 295
                        WHERE 
                            c.idLTYreporte = 295   
                            AND c.valor >= '".$desde."' 
                            AND c.valor <= '".$hasta."'
                            AND c.desvio = 'tonpur1' 
                            AND c7.desvio = 'tonpur2' 
                        GROUP BY 
                            nux 
                        ORDER BY 
                            c7.valor ASC 
                        ) AS SUBQ;";

            break;

          case 'dwtespecialidades':
            $sql = "SELECT 
                        SQL_NO_CACHE
                        num_reporte,
                        'ESPECIALIDADES',
                        name_reporte,
                        num_control,
                        name_control,
                        horas,
                        obs,
                        nux,
                        orden_control
                        -- ,IFNULL(TIPO_MANTTO,'') AS TIPO_MANTTO
                    FROM
                        (
                        SELECT 
                            m.idLTYreporte AS num_reporte,
                            m1.valor AS horas,
                            m1.idLTYcontrol AS num_control,
                            LTYC.nombre AS name_control,
                            LTYC.orden AS orden_control,
                            m1.observacion AS obs,
                            m.nuxpedido AS nux,
                            LTYR.nombre AS name_reporte
                            -- ,(SELECT m2.valor
                            --   FROM LTYregistrocontrol m2
                            --   WHERE m2.nuxpedido = m1.nuxpedido 
                            --   AND m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO
                        FROM 
                            LTYregistrocontrol m 
                            INNER JOIN LTYregistrocontrol m1 ON m1.nuxpedido = m.nuxpedido
                            LEFT JOIN LTYcontrol LTYC ON LTYC.idLTYcontrol = m1.idLTYcontrol
                            INNER JOIN LTYreporte LTYR ON LTYR.idLTYreporte = m.idLTYreporte
                        WHERE 
                            (
                                (m.idLTYreporte BETWEEN 141 AND 142) 
                                OR (m.idLTYreporte BETWEEN 145 AND 146) 
                                OR (m.idLTYreporte BETWEEN 159 AND 160) 
                                OR (m.idLTYreporte BETWEEN 269 AND 270) 
                                OR (m.idLTYreporte BETWEEN 272 AND 285)
                                OR m.idLTYreporte = 225
                            ) 
                            AND (
                                (m1.idLTYreporte BETWEEN 141 AND 142) 
                                OR (m1.idLTYreporte BETWEEN 145 AND 146) 
                                OR (m1.idLTYreporte BETWEEN 159 AND 160) 
                                OR (m1.idLTYreporte BETWEEN 269 AND 270) 
                                OR (m1.idLTYreporte BETWEEN 272 AND 285)
                                OR m1.idLTYreporte = 225
                            )
                            AND m.tipodedato = 'd' 
                            AND m.valor >= '".$desde."' 
                            AND m.valor <= '".$hasta."'
                            AND m1.tipodedato IN ('h', 'subt', 'r', 's', 'sd')
                        ORDER BY 
                            num_reporte ASC, 
                            nux ASC,
                            orden_control ASC  
                    ) AS SUBQ;
                    ";
            break;

            
          case 'dwtfritas_L1':
            $sql = "SELECT 
                        SQL_NO_CACHE
                        num_reporte,
                        'FRITAS L1',
                        name_reporte,
                        num_control,
                        name_control,
                        horas,
                        obs,
                        nux,
                        orden_control
                        -- ,IFNULL(TIPO_MANTTO,'') AS TIPO_MANTTO
                    FROM
                        (
                        SELECT 
                            m.idLTYreporte AS num_reporte,
                            m1.valor AS horas,
                            m1.idLTYcontrol AS num_control,
                            LTYC.nombre AS name_control,
                            LTYC.orden AS orden_control,
                            m1.observacion AS obs,
                            m.nuxpedido AS nux,
                            LTYR.nombre AS name_reporte
                            -- ,(SELECT m2.valor
                            --   FROM LTYregistrocontrol m2
                            --   WHERE m2.nuxpedido = m1.nuxpedido 
                            --   AND m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO
                        FROM 
                            LTYregistrocontrol m 
                            INNER JOIN LTYregistrocontrol m1 ON m1.nuxpedido = m.nuxpedido
                            LEFT JOIN LTYcontrol LTYC ON LTYC.idLTYcontrol = m1.idLTYcontrol
                            INNER JOIN LTYreporte LTYR ON LTYR.idLTYreporte = m.idLTYreporte
                        WHERE 
                            (
                                (m.idLTYreporte BETWEEN 232 AND 242) 
                                OR (m.idLTYreporte BETWEEN 257 AND 261) 
                                OR (m.idLTYreporte BETWEEN 263 AND 267) 
                                OR m.idLTYreporte = 225
                            ) 
                            AND (
                                (m1.idLTYreporte BETWEEN 232 AND 242) 
                                OR (m1.idLTYreporte BETWEEN 257 AND 261) 
                                OR (m1.idLTYreporte BETWEEN 263 AND 267) 
                                OR m1.idLTYreporte = 225
                            )
                            AND m.tipodedato = 'd' 
                            AND m.valor >= '".$desde."' 
                            AND m.valor <= '".$hasta."'
                            AND m1.tipodedato IN ('h', 'subt', 'r', 's', 'sd')
                        ORDER BY 
                            num_reporte ASC, 
                            nux ASC,
                            orden_control ASC  
                    ) AS SUBQ;
                    ";

            break;

          case 'dwtfritas_L2':
            $sql = "SELECT 
                        SQL_NO_CACHE
                        num_reporte,
                        'FRITAS L2',
                        name_reporte,
                        num_control,
                        name_control,
                        horas,
                        obs,
                        nux,
                        orden_control
                        -- ,IFNULL(TIPO_MANTTO,'') AS TIPO_MANTTO
                    FROM
                        (
                        SELECT 
                            m.idLTYreporte AS num_reporte,
                            m1.valor AS horas,
                            m1.idLTYcontrol AS num_control,
                            LTYC.nombre AS name_control,
                            LTYC.orden AS orden_control,
                            m1.observacion AS obs,
                            m.nuxpedido AS nux,
                            LTYR.nombre AS name_reporte
                            -- ,(SELECT m2.valor
                            --   FROM LTYregistrocontrol m2
                            --   WHERE m2.nuxpedido = m1.nuxpedido 
                            --   AND m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO
                        FROM 
                            LTYregistrocontrol m 
                            INNER JOIN LTYregistrocontrol m1 ON m1.nuxpedido = m.nuxpedido
                            INNER JOIN LTYcontrol LTYC ON LTYC.idLTYcontrol = m1.idLTYcontrol
                            INNER JOIN LTYreporte LTYR ON LTYR.idLTYreporte = m.idLTYreporte
                        WHERE 
                            (m.idLTYreporte BETWEEN 195 AND 201 
                            OR m.idLTYreporte BETWEEN 206 AND 213 
                            OR m.idLTYreporte BETWEEN 220 AND 230) 
                            AND (m1.idLTYreporte BETWEEN 195 AND 201 
                            OR m1.idLTYreporte BETWEEN 206 AND 213 
                            OR m1.idLTYreporte BETWEEN 220 AND 230)
                            AND m.tipodedato = 'd' 
                            AND m.valor >= '".$desde."' 
                            AND m.valor <= '".$hasta."'
                            AND (m1.tipodedato IN ('h', 'subt', 'r', 's', 'sd'))
                        ORDER BY 
                            num_reporte ASC, 
                            nux ASC,
                            orden_control ASC  
                    ) AS SUBQ;
                    ";
            break;

          case 'dwtpure':
            $sql = "SELECT 
                        SQL_NO_CACHE
                        num_reporte,
                        'PURÉ',
                        name_reporte,
                        num_control,
                        name_control,
                        horas,
                        obs,
                        nux,
                        orden_control
                        -- ,IFNULL(TIPO_MANTTO,'') AS TIPO_MANTTO
                    FROM
                        (
                        SELECT 
                            m.idLTYreporte AS num_reporte,
                            m1.valor AS horas,
                            m1.idLTYcontrol AS num_control,
                            LTYC.nombre AS name_control,
                            LTYC.orden AS orden_control,
                            m1.observacion AS obs,
                            m.nuxpedido AS nux,
                            LTYR.nombre AS name_reporte
                            -- ,(SELECT m2.valor
                            --   FROM LTYregistrocontrol m2
                            --   WHERE m2.nuxpedido = m1.nuxpedido 
                            --   AND m2.valor IN ('MECÁNICO','ELÉCTRICO','SERVICIOS','EMPAQUE')) AS TIPO_MANTTO
                        FROM 
                            LTYregistrocontrol m 
                            INNER JOIN LTYregistrocontrol m1 ON m1.nuxpedido = m.nuxpedido
                            LEFT JOIN LTYcontrol LTYC ON LTYC.idLTYcontrol = m1.idLTYcontrol
                            INNER JOIN LTYreporte LTYR ON LTYR.idLTYreporte = m.idLTYreporte
                        WHERE 
                            (
                                (m.idLTYreporte BETWEEN 216 AND 219) 
                                OR (m.idLTYreporte BETWEEN 286 AND 293) 
                                OR m.idLTYreporte = 271
                            ) 
                            AND (
                                (m1.idLTYreporte BETWEEN 216 AND 219) 
                                OR (m1.idLTYreporte BETWEEN 286 AND 293) 
                                OR m1.idLTYreporte = 271
                            )
                            AND m.tipodedato = 'd' 
                            AND m.valor >= '".$desde."' 
                            AND m.valor <= '".$hasta."'
                            AND m1.tipodedato IN ('h', 'subt', 'r', 's', 'sd')
                        ORDER BY 
                            num_reporte ASC, 
                            nux ASC,
                            orden_control ASC  
                    ) AS SUBQ;
                    ";
            break;

          case 'estespecialidades':
            $sql = "SELECT 
                        SQL_NO_CACHE fecha,
                        IFNULL(mp, '-') AS mp,
                        AVG(hrum) AS hrum,
                        AVG(cap) AS cap,
                        AVG(lr) AS lr,
                        AVG(fc) AS fc,
                        SUM(kilos) AS kilos,
                        HOUR(hora) AS hora
                    FROM (
                        SELECT
                            c.valor AS fecha,
                            (SELECT LTYregistrocontrol.valor 
                            FROM LTYregistrocontrol 
                            WHERE LTYregistrocontrol.nuxpedido = c.nuxpedido
                            AND LTYregistrocontrol.idLTYreporte = 268 
                            AND LTYregistrocontrol.desvio = 'tonesp4') AS mp,
                            c2.valor AS hrum,
                            c3.valor AS cap,
                            c4.valor AS lr,
                            c5.valor AS fc,
                            c6.valor AS kilos,
                            c7.valor AS hora
                        FROM 
                            LTYregistrocontrol c
                            INNER JOIN LTYregistrocontrol c2 ON c2.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c3 ON c3.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c4 ON c4.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c5 ON c5.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c6 ON c6.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c7 ON c7.nuxpedido = c.nuxpedido
                        WHERE 
                            c.idLTYreporte = 268
                            AND c.valor >= '".$desde."'
                            AND c.valor <= '".$hasta."'
                            AND c.desvio = 'tonesp1' 
                            AND c2.idLTYreporte = 268 
                            AND c2.desvio = 'tonesp8' 
                            AND c3.idLTYreporte = 268 
                            AND c3.desvio = 'tonesp9' 
                            AND c4.idLTYreporte = 268 
                            AND c4.desvio = 'tonesp10' 
                            AND c5.idLTYreporte = 268 
                            AND c5.desvio = 'tonesp11' 
                            AND c6.idLTYreporte = 268 
                            AND c6.desvio = 'tonesp12' 
                            AND c7.idLTYreporte = 268 
                            AND c7.desvio = 'tonesp2'
                    ) AS SUBQ
                    GROUP BY HOUR(hora) 
                    ORDER BY hora ASC;
                    ";
            break;

          case 'estfritas_L1':
            $sql = "SELECT 
                        SQL_NO_CACHE fecha,
                        IFNULL(mp, '-') AS mp,
                        ROUND(hrum, 0) AS hrum,
                        ROUND(cap, 1) AS cap,
                        ROUND(lr, 0) AS lr,
                        ROUND(fc, 1) AS fc,
                        ROUND(kilos, 0) AS kilos,
                        ROUND(hora, 0) AS hora
                    FROM 
                        (
                        SELECT
                            c.valor AS fecha, 
                            (SELECT LTYregistrocontrol.valor 
                            FROM LTYregistrocontrol  
                            WHERE LTYregistrocontrol.nuxpedido = c.nuxpedido
                            AND LTYregistrocontrol.idLTYreporte = 231 
                            AND LTYregistrocontrol.desvio = 'tonfril14') AS mp,
                            AVG(c2.valor) AS hrum, 
                            AVG(c3.valor) AS cap, 
                            AVG(c4.valor) AS lr, 
                            AVG(c5.valor) AS fc, 
                            SUM(c6.valor) AS kilos, 
                            HOUR(c7.valor) AS hora
                        FROM 
                            LTYregistrocontrol c
                            INNER JOIN LTYregistrocontrol c2 ON c2.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c3 ON c3.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c4 ON c4.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c5 ON c5.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c6 ON c6.nuxpedido = c.nuxpedido
                            INNER JOIN LTYregistrocontrol c7 ON c7.nuxpedido = c.nuxpedido
                        WHERE 
                            c.idLTYreporte = 231  
                            AND c.valor >= '".$desde."' 
                            AND c.valor <= '".$hasta."'
                            AND c.desvio = 'tonfril11' 
                            AND c2.idLTYreporte = 231 
                            AND c2.desvio = 'tonfril18' 
                            AND c3.idLTYreporte = 231 
                            AND c3.desvio = 'tonfril19' 
                            AND c4.idLTYreporte = 231 
                            AND c4.desvio = 'tonfril110' 
                            AND c5.idLTYreporte = 231 
                            AND c5.desvio = 'tonfril111' 
                            AND c6.idLTYreporte = 231 
                            AND c6.desvio = 'tonfril112' 
                            AND c7.idLTYreporte = 231 
                            AND c7.desvio = 'tonfril12' 
                        GROUP BY HOUR(c7.valor) 
                        ORDER BY c7.valor ASC 
                    ) AS SUBQ;
                    ";
            break;

          case 'estfritas_L2':
            $sql = "SELECT 
                        SQL_NO_CACHE fecha,
                        mp,
                        ROUND(hrum, 0) AS hrum,
                        ROUND(cap, 1) AS cap,
                        ROUND(lr, 0) AS lr,
                        ROUND(fc, 1) AS fc,
                        ROUND(kg, 0) AS kg,
                        ROUND(HOUR(hora), 0) AS hora
                    FROM 
                        ( 
                        SELECT
                            c.valor AS fecha,
                            c1.valor AS hora,
                            c2.valor AS kg,
                            AVG(c3.valor) AS hrum,
                            AVG(c4.valor) AS cap,
                            AVG(c5.valor) AS lr,
                            AVG(c6.valor) AS fc,
                            IF(LTYregistrocontrol.idLTYreporte = 193 AND LTYregistrocontrol.desvio = 'tonfir5', LTYregistrocontrol.valor, '-') AS mp
                        FROM 
                            LTYregistrocontrol c
                            INNER JOIN LTYregistrocontrol c1 ON c1.nuxpedido = c.nuxpedido AND c1.desvio = 'tonfir2'
                            INNER JOIN LTYregistrocontrol c2 ON c2.nuxpedido = c.nuxpedido AND c2.desvio = 'tonfir13'
                            INNER JOIN LTYregistrocontrol c3 ON c3.nuxpedido = c.nuxpedido AND c3.desvio = 'tonfir9'
                            INNER JOIN LTYregistrocontrol c4 ON c4.nuxpedido = c.nuxpedido AND c4.desvio = 'tonfir10'
                            INNER JOIN LTYregistrocontrol c5 ON c5.nuxpedido = c.nuxpedido AND c5.desvio = 'tonfir11'
                            INNER JOIN LTYregistrocontrol c6 ON c6.nuxpedido = c.nuxpedido AND c6.desvio = 'tonfir12'
                            LEFT JOIN LTYregistrocontrol ON LTYregistrocontrol.nuxpedido = c6.nuxpedido 
                        WHERE 
                            c.idLTYreporte = 193 
                            AND c.desvio = 'tonfir1' 
                            AND c.valor >= '".$desde."' 
                            AND c.valor <= '".$hasta."'
                        GROUP BY c1.valor
                        ORDER BY c1.valor ASC 
                        ) AS SUBQ;";
;            break;

          case 'estpure':
            $sql = "SELECT SQL_NO_CACHE
                        fecha,
                        IFNULL(mp, '-') AS mp,
                        ROUND(hrum, 0) AS hrum,
                        ROUND(cap, 1) AS cap,
                        ROUND(lr, 0) AS lr,
                        ROUND(fc, 1) AS fc,
                        ROUND(kg, 0) AS kg,
                        ROUND(HOUR(hora), 0) AS hora
                    FROM 
                        (
                        SELECT
                            c.valor AS fecha,
                            c1.valor AS hora,
                            c2.valor AS kg,
                            AVG(c3.valor) AS hrum,
                            AVG(c4.valor) AS cap,
                            AVG(c5.valor) AS lr,
                            AVG(c6.valor) AS fc,
                            IF(LTY.idLTYreporte = 295 AND LTY.desvio = 'tonpur4', LTY.valor, '-') AS mp
                        FROM 
                            LTYregistrocontrol c
                            INNER JOIN LTYregistrocontrol c1 ON c1.nuxpedido = c.nuxpedido AND c1.desvio = 'tonpur2'
                            INNER JOIN LTYregistrocontrol c2 ON c2.nuxpedido = c.nuxpedido AND c2.desvio = 'tonpur12'
                            INNER JOIN LTYregistrocontrol c3 ON c3.nuxpedido = c.nuxpedido AND c3.desvio = 'tonpur8'
                            INNER JOIN LTYregistrocontrol c4 ON c4.nuxpedido = c.nuxpedido AND c4.desvio = 'tonpur9'
                            INNER JOIN LTYregistrocontrol c5 ON c5.nuxpedido = c.nuxpedido AND c5.desvio = 'tonpur10'
                            INNER JOIN LTYregistrocontrol c6 ON c6.nuxpedido = c.nuxpedido AND c6.desvio = 'tonpur11'
                            LEFT JOIN LTYregistrocontrol LTY ON LTY.nuxpedido = c.nuxpedido AND LTY.idLTYreporte = 295 AND LTY.desvio = 'tonpur4'
                        WHERE 
                            c.idLTYreporte = 295 
                            AND c.desvio = 'tonpur1' 
                            AND c.valor >= '".$desde."' 
                            AND c.valor <= '".$hasta."' /*fecha*/
                        GROUP BY 
                            c1.valor
                        ORDER BY 
                            c1.valor ASC 
                        ) AS SUBQ;
                    ";
            break;
          default:
            $response = array('success' => false);
            return  json_encode($response);
            break;
        } 
        return $sql;
}

?>