<?php

$data = array(
    'userID' =>  $_REQUEST['uID'],
    'contactID' => $_REQUEST['contactID'],
    'subject' => $_REQUEST['subject'],
    'name' => $_REQUEST['name'],
    'message' => $_REQUEST['message'],
);

$service = 'Contacts';
$requesttype = 'SET';

include_once('ws.php');