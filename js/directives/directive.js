angular.module('thinkmerit')
.directive("mathjaxBind", function($sce) {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

           $scope.$watch($attrs.mathjaxBind, function(value) {
                $element.html(value?value:"");
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);         
            });

        }]
    };
})
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
.directive('escapekey', [
  function() {
    return {
      restrict: 'E',
      link: function(scope, el, attrs) {
        scope.keyPressed = 'no press :(';
        // For listening to a keypress event with a specific code
        scope.$on('keypress:13', function(onEvent, keypressEvent) {
          scope.keyPressed = 'Enter';
        });
        // For listening to all keypress events
        scope.$on('keypress', function(onEvent, keypressEvent) {
          if (keypress.which === 120) {
            scope.keyPressed = 'x';
          }
          else {
            scope.keyPressed = 'Keycode: ' + keypressEvent.which;
          }
        });
      }/*,
      template: '<h1>{{keyPressed}}</h1>'*/
    };
  }
]);

