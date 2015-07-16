<?php
if ($_REQUEST['phoneID']){
	//read the file with devices registered
	$str=file_get_contents('registeredDevices.txt');

	//delet current phoneID
	$newStr	= str_replace($_REQUEST['phoneID'], "",$str);

	//write the entire string
	file_put_contents('registeredDevices.txt', $newStr);

	echo file_get_contents('registeredDevices.txt');
}else{
	echo 'jaja';
}