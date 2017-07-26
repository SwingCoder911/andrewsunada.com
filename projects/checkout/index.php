<!DOCTYPE html>
<html>
	<head>
		<title>Sunada Home</title>
		<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
		<script type="text/javascript" src="js/angular.min.js"></script>
		<script type="text/javascript" src="js/underscore.min.js"></script>
		<script type="text/javascript" src="js/checkout.js"></script>
		<link rel="stylesheet" type="text/css" href="css/checkout.css" />
	</head>
	<body ng-app="CheckoutApp" ng-controller="CheckoutCtrl">
		<header>
			<img src="images/checkout.png" />
			<a href="https://github.com/SwingCoder911/projects" class="git-image" target="_blank">
				<img src="images/github.png"/>
			</a>
		</header>
		<nav page></nav>
		<section ng-show="!forms.completed" form-section selected-form="forms.list[navIndex]"></section>
		<section ng-show="forms.completed" class="completed-message">
			<p>Thank you for shopping with Andrew Sunada. Come again soon!</p>
		</section>
	</body>
</html>