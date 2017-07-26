<?php 
	include "classes/db.php";
	$db = new BingoDB();
	$winners = array();
	foreach($db->getWinners() as $record){
		array_push($winners, $record);
	}
	echo(json_encode($winners));
 ?>