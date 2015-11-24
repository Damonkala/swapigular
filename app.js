var myapp = angular.module('myapp', ["ui.router"])
myapp.controller("ResidentCtrl", function($scope, $http, $stateParams) {
		$http.get("http://swapi.co/api/people/" + $stateParams.id + "/?format=json").then(resp => {
				$scope.character = resp.data;
				sessionStorage.setItem("resident " + $stateParams.id, resp.data.name);
		});
})
myapp.controller("PlanetCtrl", function($scope, $http) {
		$scope.planets = [];
		$http.get("http://swapi.co/api/planets/?format=json").then(resp => {
				$scope.planets = resp.data.results.map(planet => {
					sessionStorage.setItem("planet " + planet.id, planet.name);
						planet.residents = planet.residents.map(resident => {
								var resident = { url: resident };
								resident.id = resident.url.match(/\d+/)[0];
							if(sessionStorage.getItem("resident " + resident.id)){
								resident.name =  sessionStorage.getItem("resident " + resident.id);
								resident.url = "";
								return resident;
							}
								return resident;
						});
						return planet;
				});
		}).catch(error => console.error(error.status));
});
myapp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/planets")
	$stateProvider
		.state('planets', {
				url: "/planets",
				templateUrl: "planets.html",
				controller: "PlanetCtrl"
		})
		.state('resident', {
				url: "/resident/:id",
				templateUrl: "resident.html",
				controller: "ResidentCtrl"
		})
})
