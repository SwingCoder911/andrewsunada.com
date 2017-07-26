<!DOCTYPE html>
<html>
	<head>
		<title>Google Miner</title>
		<link rel="stylesheet" type="text/css" href="css/datamine.css" />
		<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
		<script type="text/javascript" src="js/jquery-ui.min.js"></script>
		<script type="text/javascript" src="js/nesteddropdown.js"></script>
		<script type="text/javascript" src="js/datamine.js"></script>
	</head>
	<body>
		<div class="mining-form initial">
			<p class="title">Begin Mining!</p>
			<input class="field postal" name="postal_code" value="" placeholder="Zip Code: "/>
			<input class="field category" name="category" value="" placeholder="Category:" />
			<button class="action generate">Process</button>
			<img class="loading-bar" src="images/ajax-loading-bar.gif" />
		</div>
		<div class="export initial">
			<a href="export.php?scope=today">Export Today's Data</a>
			<a href="export.php">Export All Data</a>
		</div>
		<div class="center messages">
		</div>
		<div class="center results-container">

		</div>
	</body>
</html>