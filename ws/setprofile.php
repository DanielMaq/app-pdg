<?php

$data = array(
    'userID' =>  $_REQUEST['uID'],
    'email' =>  $_REQUEST['email'],
    'nombre_apellido' =>  $_REQUEST['nombre_apellido'],
    'razon_social' =>  $_REQUEST['razon_social'],
    'telefono' =>  $_REQUEST['telefono'],
    'telefono_alternativo' =>  $_REQUEST['telefono_alternativo'],
    'telefono_celular' =>  $_REQUEST['telefono_celular']
);

$service = 'Profile';
$requesttype = 'SET';

include_once('ws.php');

