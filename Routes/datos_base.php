<?php
        header("Content-Type: text/html;charset=utf-8");
         $host="190.228.29.59"; 
         $user="fmc_oper2023";
         $password="0uC6jos0bnC8";
         $dbnameL=file_get_contents("ftmbd.cvs", true);
         $Array = explode(",", $dbnameL);
         $dbname=$Array[0];
         $conexion= null;
         $port=3306;
         $chartset="utf-8";

?>