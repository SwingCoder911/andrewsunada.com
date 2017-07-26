<?php
require_once('miner.php');
$scope = (array_key_exists('scope', $_REQUEST)) ? $_REQUEST['scope'] : '';
$dataMiner = new Miner();
if($scope === 'today'){
	$records = $dataMiner->getTodaysRecords();
}else{
	$records = $dataMiner->getAllRecords();
}

function array2csv($array){
	if (count($array) == 0) {
		return null;
	}
	ob_start();
	$df = fopen("php://output", 'w');
	$tmpheaders = array_keys(reset($array));
	$headers = array();
	foreach($tmpheaders as $string){
		$headers[] = ucwords(str_replace("_", " ", $string));
	}
	fputcsv($df, $headers);
	foreach ($array as $row) {
		fputcsv($df, $row);
	}
	fclose($df);
	return ob_get_clean();
}

function download_send_headers($filename) {
    // disable caching
    $now = gmdate("D, d M Y H:i:s");
    header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
    header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
    header("Last-Modified: {$now} GMT");

    // force download
    header("Content-Type: application/force-download");
    header("Content-Type: application/octet-stream");
    header("Content-Type: application/download");

    // disposition / encoding on response body
    header("Content-Disposition: attachment;filename={$filename}");
    header("Content-Transfer-Encoding: binary");
}

download_send_headers("data_export_" . date("Y-m-d") . ".csv");
echo array2csv($records);
die();