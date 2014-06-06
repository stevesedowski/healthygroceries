// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require angular
//= require angular-resource
//= require jquery
//= require angular-animate
//= require jquery_ujs
//= require turbolinks
//= require_tree .
// lets create an angularjs module!!
var app = angular.module('groceryApp', ['ngResource', 'ngAnimate']);



app.config(function ($httpProvider) {
  // CSRF
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});

//create  a factory. i.e. service:
app.factory('Grocery', function($resource) {
	return $resource("/groceries/:id.json", { id: '@id' }, {
    update: {
      method: 'PUT'
    }
	});
});

//lets create a controller!
app.controller('GroceryCtrl', function($scope, Grocery) {
// MaJOR PRoblem!! I forgot the parentheses to invoke the function below!!
// Always remember when invoking a function to use parentheses!!
	$scope.costChanged = false;

	$scope.$watch('totalCost', function () {
		$scope.costChanged = true;
	});
	
	$scope.totalCost = 0.00;
	$scope.healthyCost = 0.00;
	$scope.badCost = 0.00;
	$scope.showTotal = false;

	$scope.groceries = Grocery.query(function(data){
		angular.forEach(data, function(item){
			$scope.totalCost += item.price;
			if(parseFloat($scope.totalCost) > 0){
				$scope.showTotal = true;
			} else {
				$scope.showTotal = false;
			}
			healthCheck(item.healthy, item.price);
		});
	});
	$scope.foods = [
		{food: 'Frozen Kale', healthy: true, price: 1.79},
		{food: 'Organic Spinach', healthy: true, price: 1.79},
		{food: 'Organic Eggs', healthy: true, price: 3.99},
		{food: 'Loaf of Bread', healthy: false, price: 2.99},
		{food: 'Pizza', healthy: false, price: 5.99},
		{food: 'One Banana', healthy: true, price: 0.19},
		{food: 'Oatmeal', healthy: true, price: 1.39},
		{food: 'Sweet Potatoes (2 lbs)', healthy: true, price: 1.79},
		{food: 'One Avocado', healthy: true, price: 0.99}
		];

	
	$scope.addItem = function(e){
		//alert('add item');
		if ($scope.grocery_list.$invalid) {
			return;
		} else { 
			e.preventDefault();
			var healthy = $scope.healthy;
			var item = $scope.item;
			var cost = $scope.cost;
			$scope.totalCost += parseFloat(cost);
			if(parseFloat($scope.totalCost) > 0){
				$scope.showTotal = true;
			} else {
				$scope.showTotal = false;
			}
/*			if(healthy) {
				$scope.healthyCost += parseFloat(cost);
			} else {
				$scope.badCost += parseFloat(cost);
			}*/
			healthCheck(healthy, cost);
			if(healthy){
				// $scope.healthyCost += parseFloat(cost);
			} else {
				// $scope.badCost += parseFloat(cost);
				healthy = false;
			}
			// alert(healthy);
			$scope.groceries.push({item: item, healthy: healthy, bought:false, price: cost });
			//save info in database
			Grocery.save({ item: item, healthy: healthy, bought:false, price: cost });
			$scope.item = '';
			$scope.healthy = false;
			$scope.cost = '';
		}
	}
/*NOTE: In order to use the 'update' function, I have to include the 'update' 
	declaration in the $resource definition above-->
	    update: {
      method: 'PUT'
    }*/
	$scope.toggleBought = function(item){
		//alert('bought-->' + item.item)
		item.bought = !item.bought;
		Grocery.update(item);
	};

	$scope.deleteItem = function(index, item) {
		Grocery.delete({ id: item.id });
		$scope.groceries.splice(index, 1);
		$scope.totalCost -= item.price;
		if(item.healthy) {
			$scope.healthyCost -= parseFloat(item.price);
		 } else {
		 	$scope.badCost -= parseFloat(item.price);
		 }
	 	if(parseFloat($scope.totalCost) > 0){
			$scope.showTotal = true;
		} else {
			$scope.showTotal = false;
		}
		
	};
	//add food to the list
	$scope.addFood = function(e, food){
		e.preventDefault();
		$scope.groceries.push({item: food.food, healthy: food.healthy, bought:false, price: food.price });
		Grocery.save({ item: food.food, healthy: food.healthy, bought:false, price: food.price });
		$scope.totalCost += food.price;
		if(parseFloat($scope.totalCost) > 0){
			$scope.showTotal = true;
		} else {
			$scope.showTotal = false;
		}
		healthCheck(food.healthy, food.price);
/*		if(food.healthy) {
			$scope.healthyCost += parseFloat(food.price);
		 } else {
		 	$scope.badCost += parseFloat(food.price);
		 }*/
	}

	function healthCheck(healthy, price) {
		// alert("price:" + price + ' healthy?: ' + healthy);
		if(healthy) {
			$scope.healthyCost += parseFloat(price);
		 } else {
		 	$scope.badCost += parseFloat(price);
		 }
	};

});


