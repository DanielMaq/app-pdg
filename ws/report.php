<?php

$data['campaignID'] = $_REQUEST['campID'];

if ( isset($_REQUEST['from']) && $_REQUEST['from'] !== '0' ) {
    $from = date('Y-m-d 00:00:00', strtotime(str_replace('/', '-', $_REQUEST['from'])));
    $data['desde'] = $from;
}

if ( isset($_REQUEST['to']) && $_REQUEST['to'] !== '0' ) {
    $to = date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_REQUEST['to'])));
    $data['hasta'] = $to;
}

$service = 'report';

include_once('ws.php');
