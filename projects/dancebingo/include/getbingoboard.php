<?php 
	include "classes/db.php";
	$db = new BingoDB();
	$board = array();
	foreach($db->getPieces() as $row ){
		array_push($board, $row);
	}
	echo(json_encode($board));
 ?>