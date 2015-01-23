<?php

$data = array(
    'userID' => $_REQUEST['uID']
);

if ( isset($_REQUEST['campID']) && $_REQUEST['campID'] ==! '0' ){
    $data['campaignID'] = $_REQUEST['campID'];
}

if ( isset($_REQUEST['page']) && $_REQUEST['page'] ==! '0' ){
    $data['page'] = $_REQUEST['page'];
}

$service = 'Contacts';

include_once('ws.php');