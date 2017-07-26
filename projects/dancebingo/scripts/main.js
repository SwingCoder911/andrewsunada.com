(function(){
	"use strict";
	var app = angular.module('DanceBingo', []);
	app.controller("BingoController", function($scope, $http){
	 	var fillGrid = function(values){
	 		values.sort(function(a, b){
	 			if(a.id < (Math.random() * 100)){
	 				return 1;
	 			}
	 			if(b.id < (Math.random() * 100)){
	 				return -1;
	 			}
	 			return 0;
	 		});
	 		values.splice(12, 0, {text: "FREE SPOT!", id: (Math.random() * 100)});
	 		for(var i = 0; i < 5; i++){
	 			for(var k = 0; k < 5; k++){
	 				$scope.selectedGrid[i][k] = values[(i * 5) + k].text;
	 			}
	 		}
	 	},
	 	initGrid = function(){
			$scope.loaders.board = true;
	 		$http.get("/projects/dancebingo/include/getbingoboard.php")
	 		.then(function(response){
	 			$scope.loaders.board = false;
	 			fillGrid(response.data);
	 		});
	 	},
	 	init = function(){
	 		initGrid();
	 		$scope.loadScoreboard();
	 	};

	 	$scope.selectedCells = [];
	 	$scope.Bingos = {
	 		"X": [
	 			[0,0,0,0,0],
	 			[0,0,0,0,0],
	 			[0,0,0,0,0],
	 			[0,0,0,0,0],
	 			[0,0,0,0,0]
	 		],
	 		"Y": [
	 			[0,0,0,0,0],
	 			[0,0,0,0,0],
	 			[0,0,0,0,0],
	 			[0,0,0,0,0],
	 			[0,0,0,0,0]
	 		],
	 		'diagonal': {
	 			'ul|br': [0,0,0,0,0],
	 			"bl|ur": [0,0,0,0,0]
	 		}
	 	};
		$scope.selectedGrid = [
	 		[],
	 		[],
	 		[],
	 		[],
	 		[]
	 	];
	 	$scope.winners = [];
	 	$scope.currentBingoPattern = [];
	 	$scope.user = {
	 		name: "",
	 		location: ""
	 	};
	 	$scope.refresh = {
	 		pwd: "",
	 		error: false
	 	};
	 	$scope.loaders = {
	 		board: false,
	 		winners: false
	 	}
	 	$scope.selectCell = function(xVal, yVal){
	 		var idx = -1, switcher;
	 		if($scope.hasBingo()){
	 			return false;
	 		}
	 		angular.forEach($scope.selectedCells, function(coord, i){
	 			if(coord.x == xVal && coord.y == yVal){
	 				idx = i;
	 			}
	 		});
	 		if(idx === -1){
	 			$scope.selectedCells.push({x: xVal, y: yVal});
	 			switcher = 1;
	 		}else{
	 			$scope.selectedCells.splice(idx, 1);
	 			switcher = 0;
	 		}
	 		$scope.Bingos["X"][xVal][yVal] = switcher;
			$scope.Bingos["Y"][yVal][xVal] = switcher;
			if(xVal == yVal){
				$scope.Bingos['diagonal']['ul|br'][xVal] = switcher;
 			}
 			if(xVal + yVal == 4){
 				$scope.Bingos['diagonal']['bl|ur'][xVal] = switcher;
 			}	 		
	 	};
	 	$scope.isCellSelected = function(xVal, yVal){
	 		var selected = false;
	 		angular.forEach($scope.selectedCells, function(coord, i){
	 			if(coord.x == xVal && coord.y == yVal){
	 				selected = true;
	 			}
	 		});
	 		return selected;
	 	}
	 	$scope.hasBingo = function(){
	 		var bingo = false, bingoCheck, dPattern;
	 		angular.forEach($scope.Bingos["X"], function(row, i){
	 			var _pattern = [];
	 			var check = row.filter(function(val, k){
	 				_pattern.push({x: i, y: k});
	 				return val == 0;
	 			});
	 			if(check.length == 0){
	 				bingo = true;
	 				$scope.currentBingoPattern = _pattern; 
	 			}
	 		});
	 		
	 		if(bingo){
	 			return true;
	 		}
	 		angular.forEach($scope.Bingos["Y"], function(row, k){
	 			var _pattern = [];
	 			var check = row.filter(function(val, i){
	 				_pattern.push({x: i, y: k});
	 				return val == 0;
	 			});
	 			if(check.length == 0){
	 				bingo = true;
	 				$scope.currentBingoPattern = _pattern; 
	 			}
	 		});
	 		
	 		if(bingo){	 			
	 			return true;
	 		}
	 		dPattern = [];
	 		bingoCheck = $scope.Bingos.diagonal["ul|br"].filter(function(val, i){
	 			dPattern.push({x: i, y: i});
	 			return val == 0;
	 		});

	 		if(bingoCheck.length == 0){
	 			$scope.currentBingoPattern = dPattern; 
	 			return true;
	 		}
	 		dPattern = [];
	 		bingoCheck = $scope.Bingos.diagonal["bl|ur"].filter(function(val, i){
	 			dPattern.push({x: i, y: (4 - i)});
	 			return val == 0;
	 		});

	 		if(bingoCheck.length == 0){
	 			$scope.currentBingoPattern = dPattern; 
	 			return true;
	 		}
	 		$scope.currentBingoPattern = [];
	 		return false;
	 	};
	 	$scope.recordBingo = function(){
	 		var patternSet = [], params;
	 		$('.cell.bingo').each(function(){
	 			patternSet.push($(this).text().trim());
	 		});
	 		params = $.extend(true, $scope.user, {bingo: patternSet});
	 		$http({
	 			method: "POST",
	 			url: "/projects/dancebingo/include/recordbingo.php",
	 			data: $.param(params),
	 			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	 		}).success(function(response){
	 			//console.log(response);
	 		});
	 		$scope.user.name = "";
	 		$scope.user.location = "";
	 		$scope.resetBoard();
	 	};
	 	$scope.resetBoard = function(){
	 		angular.forEach($scope.Bingos.X, function(set, i){
	 			for(var k = 0, len = set.length; k < len; k++){
	 				set[k] = 0;
	 			}
	 		});
	 		angular.forEach($scope.Bingos.Y, function(set, i){
	 			for(var k = 0, len = set.length; k < len; k++){
	 				set[k] = 0;
	 			}
	 		});
	 		for(var k = 0, len = $scope.Bingos.diagonal["ul|br"].length; k < len; k++){
	 			$scope.Bingos.diagonal["ul|br"][k] = 0;
	 		}
	 		for(var k = 0, len = $scope.Bingos.diagonal["bl|ur"].length; k < len; k++){
	 			$scope.Bingos.diagonal["bl|ur"][k] = 0;
	 		}
	 		$scope.selectedCells = [];
	 		initGrid();
	 	}
	 	$scope.loadScoreboard = function(){
	 		$scope.loaders.winners = true;
			$http.get("/projects/dancebingo/include/getwinners.php")
			.then(function(response){
				var returnedList = response.data;
				for(var i = 0, len = returnedList.length; i < len; i++){
					if(returnedList[i].pattern == ""){
						continue;
					}
					returnedList[i].pattern = JSON.parse(returnedList[i].pattern);
				}
				$scope.loaders.winners = false;
				$scope.winners = response.data;
			});
	 	};
	 	$scope.isPartOfBingo = function(xVal, yVal){
	 		for(var i = 0, len = $scope.currentBingoPattern.length; i < len; i++){
	 			if($scope.currentBingoPattern[i].x == xVal && $scope.currentBingoPattern[i].y == yVal){
	 				return true;
	 			}
	 		}
	 		return false;
	 	};
	 	$scope.attemptRefresh = function(){
	 		var winners = $scope.winners.map(function(winner){
	 			return winner.id;
	 		});
	 		var params = $.extend(true, $scope.refresh, {list: winners }) ;
	 		$http({
	 			method: "POST",
	 			url: "/projects/dancebingo/include/archivelist.php",
	 			data: $.param(params),
	 			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	 		}).success(function(response){
	 			if(response == 1){
		 			$('#refresh-modal').modal('hide');
		 			$scope.loadScoreboard();	
	 			}else{
	 				$scope.refresh.error = true;
	 			}	 			
	 		});
	 	};

	 	$("#refresh-modal").on("hidden.bs.modal", function(){
	 		$scope.refresh.error = false;
	 	});
	 	init();
	 });
})();