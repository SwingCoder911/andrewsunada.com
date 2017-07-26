(function(){
	/*
	 * Don't forget required!
	*/
	var checkoutApp = angular.module('CheckoutApp', []);
	directives = {
		page: function(){
			return{
				link: function(scope, elem, attrs){

				},
				templateUrl: "templates/nav.html"
			};
		},
		formSection: function(){
			return{
				scope:{
					selectedForm: '='
				},
				link: function(scope, elem, attrs){

				},
				templateUrl: "templates/form.html"
			};
		},
		formRow: function(){
			return{
				link: function(scope, elem, attrs){
					//Set width
					var widthMultiplier = 6;
					if(undefined !== scope.row.cells){
						widthMultiplier = scope.row.cells;
					}
					scope.widthClass = "column" + widthMultiplier;
					if((scope.row.type === 'button') || (scope.row.type === 'submit') || (scope.row.type === 'final-submit')){
						scope.buttonAction = scope.row.onaction;
					}
					if(undefined !== scope.row.onchange){
						scope.$watch('row.value', function(){
							scope.row.onchange();
						});
					}
				},
				templateUrl: "templates/form_row.html"
			};
		}
	},
	controllers={
		CheckoutCtrl: function($scope){
			var billing = 0, shippinginfo = 1, shippingmethod = 2, paymentinfo = 3;
			var onSameAsBillingChecked = function(){
				var form = $scope.forms.list[shippinginfo];
				var checkbox = form[0];
				if(checkbox.value === true){
					angular.forEach($scope.forms.list[shippinginfo], function(row, idx){
						if(idx === 0){ return;}
						row.value = $scope.forms.list[billing][idx -1].value;
					});
					angular.forEach($scope.forms.list[shippinginfo], function(row, idx){
						if(idx === 0){ return;}
						row.disabled = true;
					});
				}else{
					angular.forEach($scope.forms.list[shippinginfo], function(row, idx){
						if(idx === 0){ return;}
						row.disabled = false;
					});
				}

			},
			onContinueClicked = function(form){
				form.$submitted = true;
				if(!form.$valid){ return;}
				form.$submitted = false;
				$scope.navIndex++;
			},
			onPurchaseClicked = function(form){
				form.$submitted = true;
				if(!form.$valid){ return;}
				$scope.forms.completed = true;
			},
			onShippingClicked = function(idx){
				var form = $scope.forms.list[shippingmethod];
				angular.forEach(form, function(row, idx){
					row.selected = false;
				});
				form[idx].selected = true;
			};
			$scope.navIndex = 0;
			$scope.nav = {
				list: [
				"Billing Information",
				"Shipping Information",
				"Shipping Method",
				"Payment Information"
				],
				selected: ""
			};
			$scope.forms = {
				list:[
					[
						{label: 'First Name', name: 'firstname', type: 'input', value: '', required: true},
						{label: 'Last Name', name: 'lastname', type: 'input', value: '', required: true},
						{label: 'Company', name: 'company', type: 'input', value: '', required: false},
						{label: 'Email', name: 'email', type: 'email', value: '', required: true},
						{label: 'Address', name: 'address', type: 'input', value: '', required: true},
						{label: 'City', name: 'city', type: 'input', value: '', required: true},
						{label: 'State/Province', name: 'state', type: 'input', value: '', required: true},
						{label: 'Zip/Postal Code', name: 'zipcode', type: 'input', value: '', required: true},
						{label: 'Country', name: 'country', type: 'input', value: '', required: true},
						{label: 'Phone', name: 'phone', type: 'input', value: '', required: true},
						{label: 'Continue', type: 'submit', onaction: onContinueClicked}
					],
					[
						{label: 'Same as Billing', type: 'checkbox', value: '', required: false, onchange: onSameAsBillingChecked, cells: 1},
						{label: 'First Name', name: 'firstname', type: 'input', value: '', required: true},
						{label: 'Last Name', name: 'lastname', type: 'input', value: '', required: true},
						{label: 'Company', name: 'company', type: 'input', value: '', required: false},
						{label: 'Email', name: 'email', type: 'email', value: '', required: true},
						{label: 'Address', name: 'address', type: 'input', value: '', required: true},
						{label: 'City', name: 'city', type: 'input', value: '', required: true},
						{label: 'State/Province', name: 'state', type: 'input', value: '', required: true},
						{label: 'Zip/Postal Code', name: 'zipcode', type: 'input', value: '', required: true},
						{label: 'Country', name: 'country', type: 'input', value: '', required: true},
						{label: 'Phone', name: 'phone', type: 'input', value: '', required: true},
						{label: 'Continue', type: 'submit', onaction: onContinueClicked}
					],
					[
						{label: 'Ground', type: 'button', value: '', required: false, selected: true, onaction: onShippingClicked, price: '+ $0.00 shipping'},
						{label: 'Air', type: 'button', value: '', required: false, selected: false, onaction: onShippingClicked, price: '+ $3.00 shipping'},
						{label: 'Griffon', type: 'button', value: '', required: false, selected: false, onaction: onShippingClicked, price: '+ $25.00 shipping'},
						{label: 'Continue', type: 'submit', onaction: onContinueClicked}
					],
					[
						{label: 'Payment Type', name: 'paymenttype', type: 'dropdown', value: '', required: true, list: ['Visa', 'Mastercard', 'Chuck Norris']},
						{label: 'Full Name', name: 'fullname', type: 'input', value: '', required: true},
						{label: 'Card Number', name: 'cardnumber', type: 'input', value: '', required: true},
						{label: false, type: 'input-list', cells: 1, list: [
							{label: 'Month', name: 'expmonth', value: '', required: true, placeholder: 'MM', type: 'number'},
							{label: 'Year', name: 'expyear', value: '', required: true, placeholder: 'YY', type: 'number'},
							]},
						{label: 'CVC', name: 'cvc', type: 'input', value: '', required: true, cells: 1},
						{label: 'Purchase', type: 'final-submit', onaction: onPurchaseClicked}
					],
				],
				selected: false,
				completed: false
			};
			$scope.forms.selected = 0;
			$scope.nav.selected = 0;
			$scope.$watch('navIndex', function(){
				$scope.forms.selected = $scope.navIndex;
				$scope.nav.selected = $scope.navIndex;
			});
		}
	};
	checkoutApp.directive(directives);
	checkoutApp.controller(controllers);
}());