<?php

$data['campaignID'] = $_REQUEST['campID'];

if ( isset($_REQUEST['from']) && $_REQUEST['from'] ==! '0' ){
    $data['desde'] = $_REQUEST['from'];
}

if ( isset($_REQUEST['to']) && $_REQUEST['to'] ==! '0' ){
    $data['hasta'] = $_REQUEST['to'];
}

$service = 'report';

include_once('ws.php');
