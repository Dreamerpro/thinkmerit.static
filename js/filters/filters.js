angular.module('thinkmerit')
.filter('safe', function($sce) { 

	return function (value) {
		return $sce.trustAsHtml(value);
	}; 
})

