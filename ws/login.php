<?php

$data = array(
    'email'    => $_REQUEST['email'],
    'password' =>  $_REQUEST['password']
);

$service = 'login';

include_once('ws.php');