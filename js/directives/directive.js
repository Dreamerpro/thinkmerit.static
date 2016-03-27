angular.module('thinkmerit')
.directive('levelBind',function () {
  return {
    restrict:'A',
    controller:function ($scope, $element, $attrs) {
      $scope.$watch($attrs.levelBind, function (val) {
        $html="";
        if(val==1){
          $html="<i class=\"fa fa-circle fa-10px text-success\"></i>";
        }
        else if(val==2){
          $html="<i class=\"fa fa-circle fa-10px text-warning\"></i>";
        }
        else if(val==3){
          $html="<i class=\"fa fa-circle fa-10px text-danger\"></i>";
        }
        $element.html($html);
        console.log(val);
      });
    }
  }
})
.directive("mathjaxBind", function() {
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
.directive("mathjaxBindNotes", function($sce) {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
          var _self=this, url=null;

          $scope.$watch($attrs.url, function (val) {
            _self.url=val;
          })
           $scope.$watch($attrs.mathjaxBindNotes, function(value) {
                if(value && _self.url){
                    _self.url=_self.url.substring(0,_self.url.lastIndexOf('/')+1);
                    value=value+"";
                    value=value.replace("src=\"http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML\"","");
                    value=value.replace(/src=\"/g,"src=\""+_self.url);
                    var z=value.split('</head>');
                    value=z[0]+"<script type='text/javascript' src='http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML'></script></head>"+z[1];
                }
                /*console.log(_self.url);
              */
                $element.html(value?value:"");

                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);         
            });

        }]
    };
})
.directive('questionBankModals', function () {
  return {
    restrict:'E',
    templateUrl:'/templates/directives/question-bank-modals'
  }
})
.directive('listOfQuestion', function () {
  return {
    restrict:'A',
    templateUrl:'/templates/directives/question-list'
  }
})
.directive('singleQuestion', function () {
  return {
    restrict:'A',
    templateUrl:'/templates/directives/question-single'
  }
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

