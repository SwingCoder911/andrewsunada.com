<?php 
	include "classes/db.php";
	$db = new BingoDB();

	if(!isset($_POST["list"]) || !isset($_POST["pwd"])){
		echo false;
		return;
	}
	if($_POST["pwd"] != "T@P2016"){
		echo false;
		return;
	}
	$stringified = implode(",", $_POST["list"]);
	//$db->archiveList($stringified);
	echo true;
 ?>