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
.directive('utilityStickies', function () {
	return {
		restrict: 'A',
    	templateUrl: '/templates/directives/utility-stickies',
    	controller:"UtilityCtrl",
    	controllerAs:"uc"
	}
})
.directive('utilityBookmarks', function () {
	return {
		restrict: 'A',
    	templateUrl: '/templates/directives/utility-bookmarks',
    	controller:"UtilityCtrl",
    	controllerAs:"uc0"
	}
})
.directive('utilityTodos', function () {
	return {
		restrict: 'A',
    	templateUrl: '/templates/directives/utility-todos',
    	controller:"UtilityCtrl",
    	controllerAs:"uc1"
	}
})

