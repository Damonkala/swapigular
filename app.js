var myapp = angular.module('myapp', ["ui.router"])
myapp.controller("ResidentCtrl", function($scope, $http, $stateParams) {
				if(sessionStorage.getItem("resident " + $stateParams.id)) {
					$scope.name = sessionStorage.getItem("resident " + $stateParams.id);
					$scope.gender = sessionStorage.getItem("resident gender" + $stateParams.id);
					$scope.birth_year = sessionStorage.getItem("resident birth_year" + $stateParams.id);
					$scope.blip = true;
					($scope.name)
				}
		$http.get("http://swapi.co/api/people/" + $stateParams.id + "/?format=json").then(resp => {
				$scope.character = resp.data;
				sessionStorage.setItem("resident " + $stateParams.id, resp.data.name);
				sessionStorage.setItem("resident gender" + $stateParams.id, resp.data.gender);
				sessionStorage.setItem("resident birth_year" + $stateParams.id, resp.data.birth_year);
				$scope.blip = false
		});
})
myapp.controller("PlanetCtrl", function($scope, $http) {
		$scope.planets = [];
		$http.get("http://swapi.co/api/planets/?format=json").then(resp => {
				$scope.planets = resp.data.results.map(planet => {
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
