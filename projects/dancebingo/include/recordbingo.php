<?php 
	include "classes/db.php";
	$db = new BingoDB();

	if(!isset($_POST["name"]) || !isset($_POST["location"]) || !isset($_POST["bingo"])){
		echo "Empty";
		return;
	}
	$name = $_POST["name"];
	$location = $_POST["location"];
	$bingo = json_encode($_POST["bingo"]);
	$db->recordBingo($name, $location, $bingo);
 ?>