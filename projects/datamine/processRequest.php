<?php
require_once("miner.php");
$postalCode = (array_key_exists('postal_code', $_REQUEST)) ? $_REQUEST['postal_code'] : '';
$category = (array_key_exists('category', $_REQUEST)) ? $_REQUEST['category'] : '';
$error = array();

/* Sanity Sanitization */
if($postalCode === ''){
	$error[] = "Missing parameter: Zip Code";
}

if($category === ''){
	$error[] = "Missing parameter: Category";
}

/* Return if any issues */
if(!empty($error)){
	echo json_encode(array("code" => "error", "errors" => $error));
	return;
}

$miner = new Miner();
$result = $miner->processData($postalCode, $category);
$response = json_encode($result);
echo $response;