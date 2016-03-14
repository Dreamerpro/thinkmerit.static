
/*not used for now*/
angular.module('thinkmerit')
.directive('userSideBar', function () {
	return {
		restrict: 'E',
    	templateUrl: '/templates/directives/user-side-bar'
	}
})
.directive('logOutModal', function () {
	return {
		restrict: 'E',
    	templateUrl: '/templates/directives/log-out-modal'
	}
})
.directive('mainHeader', function () {
	return {
		restrict: 'E',
    	templateUrl: '/templates/directives/main-header',
    	controller:"NavCtrl",
    	controllerAs:"nc"
	}
})
.directive('mainFooter', function () {
	return {
		restrict: 'E',
    	templateUrl: '/templates/directives/main-footer',
    	controller:"NavCtrl",
    	controllerAs:"nc"
	}
})