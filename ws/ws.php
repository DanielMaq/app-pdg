<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$ch = curl_init('http://gpoadmin.adverit.com/api/ws/'.$service);

$type = (isset($requesttype) ? $requesttype : 'GET');

$opts = array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER    => array('Content-Type: application/json; charset=UTF-8'),
    CURLOPT_CUSTOMREQUEST => $type,
    CURLOPT_POSTFIELDS    => json_encode($data)
);

curl_setopt_array($ch, $opts);
curl_setopt($ch, CURLOPT_USERPWD, '4rUSER:4rPASS'); //USER Y PASS para la api

$return['data']   = json_decode(curl_exec($ch));
$return['status'] = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

print_r(json_encode($return));