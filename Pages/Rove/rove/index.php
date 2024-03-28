<?php 
header("Content-Type: text/html;charset=utf-8");
session_start();
if (!isset($_SESSION['factum_validation'])) {
    include_once "./Pages/Session/session.php";
}
header('Content-Type: text/html;charset=utf-8');

define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);
define('INCLUDES', ROOT_PATH.'/includes/molecules');
?>
 
<!DOCTYPE html>
<!-- <html lang="es"> -->
<head>
    <meta charset='UTF-8'>
    <meta name='description'>
    <meta name='author' content='Luis1940-bot'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link rel='shortcut icon' type = 'image / x-icon' href='../../../assets/img/favicon.ico'>
    <link rel="stylesheet" href="./estilos/fontawesome.min.css?v=<?php echo(rand()); ?>">
    <link rel="stylesheet" href="./estilos/fontawesome-free-5.12.1-web/fontawesome-free-5.12.1-web/css/all.css?v=<?php echo(rand()); ?>">
    <link href="./estilos/google_fonts.css?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./estilos/css/bootstrap.min.css?v=<?php echo(rand()); ?>">
    <link rel="stylesheet" href="./estilos/chartjs/Chart.css?v=<?php echo(rand()); ?>">
    <link rel="stylesheet" type='text/css' href="./estilos/chartjs/Chart.bundle.min.js?v=<?php echo(rand()); ?>">
    <link rel="stylesheet" href="./estilos/tableros.css?v=<?php echo(rand()); ?>">
    <link rel="stylesheet" href="./estilos/estilo_menu.css?v=<?php echo(rand()); ?>">
    
    <title></title>
</head>
<div class="row">
    <div class="col float left">
        <h6 class="vers small text-left text-secondary" id="version"></h6>
        <h6 class="vers small text-left text-secondary d-none" id="carpeta_principal"></h6>
        <p class="d-none" id="mi_cfg"></p>
    </div>
    <div class=" col float-right">
        <h6 class="titulo small float-right mt-0 text-secondary" id="reloj"></h6>
    </div>
</div>
<noscript>You need to enable JavaScript to run this app.</noscript>
<main class="main" style="background-color:#e3f2fd">
<!-- ENCABEZADO -->
              <div class="container col-xl-11  h-auto w-100" >
                <!-- <div class="row"> -->
                <div class="row sticky-top"><div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="height:20px"></div></div>
                <div class="row sticky-top">
                <div class="col-xs-0 col-sm-0 col-md-0 col-lg-1 col-xl-1  "></div>

                </div>
                <div class="row ">
                <div class="col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1 "></div>
                <div class="col-xs-2 col-sm-1 col-md-1 col-lg-2 col-xl-2 "></div>
              
                </div>
              </div> 
              
            <!-- FIN DE ENCABEZADO -->
            <!-- CUERPO -->

            <p id="tipo_rove" class="d-none"><?php echo $_GET['rove']?></p>
            <p id="tipoDeUsuario" class="d-none"><p>
            <div class="row "><br></div>
            <div class="container col-xs-12 col-sm-12 col-md-11 col-lg-11 col-xl-11  h-auto">
                <nav class="navbar navbar-dark bg-transparent shadow rounded">

                    <button id="refresh" class="btn btn-light  float-left ml-2 shadow bg-success"  type="button" title="Refrescar"><i class="fas fa-sync-alt fa-1x" aria-hidden="true"></i></button>
      
                </nav>
                <div class="row  h-auto w-auto mt-2">
                <p id="OnceChartX" class="d-none">x</p>
                
                
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id="colOcho">
                    
                <div class="col">
                  <div class="row">
                    <nav id="nvV122" class="navbar navbar-expand-sm bg-secondary border navbar-dark h-100 w-100 rounded" >
                        <!-- <form class="form-inline" action="rove.php"> -->
                          <button id="botonFILTRO" class="btn btn-info ml-1 mt-1 shadow" type="submit" title="Filtro" >Fecha</button>
                          <button id="traerDia" class="btn btn-info ml-1 mt-1 shadow" type="submit" title="Diario" ><i class="bi bi-body-text" aria-hidden="true"></i>Diario</button>
                          <div class=" ml-5 d-none">
                            <INPUT TYPE="Radio" id="ton" Name="Calculo" Value="Ton" checked><strong>Tn/Cap</strong>
                            <INPUT TYPE="Radio" id='form' Name="Calculo" Value="Form" class="ml-1"><strong>Fórmula</strong>
                          </div>
                         
                    </nav>
                  </div>
                </div>
                <br>
                    <div class="bg-light mb-3 card rounded-light shadow">
                        <div class="card-body">
                            <div class="col-3 float-left">
                              <p class="fs--1 mb-0">
                            <strong><a id="tableroDeControl" class="text-center"></strong></a>
                            </p>
                            <h6 class="" id="nombreDeTabla" ><?php echo "ROVE ".strtoupper($_GET['rove'])?></h6>
                            <p id="idtablero" class="">0<p>
                            </div>
                            
                            <!-- <p id="grafAcumulado" class="">0<p> -->
                        </div>
                    </div>

                    <div class="col w-100 p-0" >
                      <table id="XXXX" class="table table-bordered h-100 w-100 ml-0 mr-0" >
                        <form>       
                          <thead class="card-head shadow rounded style="font-size:1px;""  >
                            <div class="col">
                              <div class="bg-info ">
                                <tr class="text-center d-none" style="height:10px;">
                                     <th class="">title</th>
                                     <th class="">title</th>
                                     <th class="">title</th>
                                     <th class="">h01</th>
                                     <th class="">h12</th>
                                     <th class="">h23</th>
                                     <th class="">h34</th>
                                     <th class="">h45</th>
                                     <th class="">h56</th>
                                     <th class="">h67</th>
                                     <th class="">h78</th>
                                     <th class="">h89</th>
                                     <th class="">h910</th>
                                     <th class="">h1011</th>
                                     <th class="">h1112</th>
                                     <th class="">h1213</th>
                                     <th class="">h1314</th>
                                     <th class="">h1415</th>
                                     <th class="">h1516</th>
                                     <th class="">h1617</th>
                                     <th class="">h1718</th>
                                     <th class="">h1819</th>
                                     <th class="">h1920</th>
                                     <th class="">h2021</th>
                                     <th class="">h2122</th>
                                     <th class="">h2223</th>
                                     <th class="">h2324</th>
                                  </tr>
                               </div>
                              </div>
                          </thead>
                        <div class="row" >
                          <div class="card-body h-100 w-100 mt-0 pt-0" >
                            <tbody id="bodyDatos" class="boo" >
                                                            
                            </tbody>
                           </div>
                         </div>                
                       </form>
                    </table>
                    <!-- <div class="row"><br></div> -->
                  </div>
                  <div class="row"><br></div>

                </div>
                                            <!-- MODAL     -->
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="frase1 modal fade" id="asignaReporte" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 id="configuracion">Configuración</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    .
                                    <div class="col12">
                                        <div class="row">
                                            <nav id="nvControles" class="navbar navbar-expand-sm bg-light border navbar-dark h-100 w-100 rounded" >
                                                <form class="form-block" action="">
                                                    <button id="botonControl" class="btn btn-success btn-block" type="button" data-toggle="modal" data-target="#asignaReporte" title="Aceptar">ACEPTAR</button>
                                                </form>
                                            </nav>
                                        </div>
                                        
                                    </div>
                                    
                                    <hr>
                                    <label for="fecha_calendarDESDE1" id="indiqueeldia">Indique el día.</label>
                                    <input type="date" class="form-control mr-sm-2"  id="fecha_calendarDESDE"   value=""</>
                                    <label class='d-none'
                                    for="fecha_calendarHASTA1" id="indiquehasta">Indique hasta.</label>
                                    <input type="date" class="form-control mr-sm-2 d-none" id="fecha_calendarHASTA"   value=""</>
                                    
                                    
                                    <br>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   
                </div>
            </div> 
             <!-- FOOTER -->
                    <div class="row" style="height: 20px;">
                        <div class="row fixed-bottom" >
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 bg-secondary text-white text-center">
                                <span class="titulo"> <?php echo $_SERVER['SERVER_NAME']?> </span>
                                <!-- <p>Herramientas desarrolladas por Factum dentro de la metodología PDCA</p> -->
                            </div>
                        </div>
                    </div>
                    <!-- FIN DE FOOTER -->

</main>


<script type="text/javascript">
    window.onload=function(){
        var tipoDeUsuario ="<?php echo $_SESSION['idtipousuario']?>";
        document.getElementById('tipoDeUsuario').innerText=tipoDeUsuario
        var usuario ="<?php echo $_SESSION['nombre']?>";//console.log(usuario)
        const removeAccents = (str) => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        } 
            function readFTBD(file){
              var rawFile = new XMLHttpRequest();
                        rawFile.open("GET", file, false);
                        rawFile.onreadystatechange = function ()
                        {
                            if(rawFile.readyState === 4)
                            {
                                if(rawFile.status === 200 || rawFile.status == 0)
                                {
                                    let allText = rawFile.responseText; 
                                    let content=''; 
                                    allText=allText.split(',');
                                    document.getElementById('carpeta_principal').innerText=allText[1];
                                    
                                };
                            };
                        };
                        rawFile.send(null);
            };
            
    }
    </script>
    <script src="./estilos/jquery.min.js"></script>
    <script src="./estilos/js/bootstrap.min.js"></script>
    <script type="module" src="./rove.js"></script>
    <script src="./rove.js"></script>
    <script type="module"  src="./utils/verObs.js"></script>
    <script type="module"  src="./utils/marquesina.js"></script>
    
    <script src="./estilos/sweetalert2@9.js"></script>
    <script src="./estilos/chartjs/Chart.min.js"></script>
    <script src="./estilos/chartjs/Chart.bundle.js"></script>
    <script src="./estilos/chartjs/Chart.bundle.min.js"></script>
    <script src="./estilos/chartjs/Chart.js"></script>
    
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="frase1 modal fade" id="contenidoEmergente" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="text-center">
                                      <div><h2 id="atencion">Atención</h2></div><br>
                                    <div><i class="fa fa-exclamation-triangle fa-3x text-danger" aria-hidden="true"></i></div>
                                    <br>
                                    <div><h5 id="existeunproblema">Existe un problema con los datos de Inicio y Fin del evento. Verifique el documento.</h5></div>
                                    <br>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="frase1 modal fade" id="informeDelDocumento" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="card modal-header">
                                    <div class="card-body text-left">
                                      <div class="card-title"><h2 id="informedwt">Informe DWT</h2></div><br>
                                    <div><i class="fa fa-info-circle fa-3x text-success" aria-hidden="true" ></i></div>
                                    <br>
                                    <div id="infoDoc" class="card-text">
                                     
                                  </div>
                                    <br>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="frase1 modal fade" id="documents" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="card modal-header">
                                    <div class="card-body text-left">
                                      <div class="card-title"><h2 id="informedwt">Documents Tn</h2></div><br>
                                    <div><i class="fa fa-file fa-3x text-primary" aria-hidden="true" ></i></div>
                                    <br>
                                    <div id="docs" class="card-text">
                                     
                                  </div>
                                    <br>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
     
</body>
</html>