<?php
require_once("./controller.php");
$controller = new Controller();
echo json_encode($controller->run());
?>
