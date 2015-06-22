var app = angular.module('nicotinesKryptonite', ['ui.router', 'angular-momentjs', 'ngSanitize']);

app.run(['$rootScope', '$state', 'nav', 'signup', function($rootScope, $state, nav, signup){
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
		$state.go('home', {errorMessage: error});
	});
	$rootScope.$on('$locationChangeSuccess', function () {
        nav.setActive(nav.getActive());
        signup.goNextPage('Intro');
    });
}]);