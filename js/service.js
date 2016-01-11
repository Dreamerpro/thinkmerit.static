angular.module('thinkmerit')
.factory("FlashService", function($rootScope){
	return {
		show:function(msg, type){
			$rootScope.flash=msg;
			$rootScope.flashType=type;
		},
		clear:function(){
			$rootScope.flash="";
			$rootScope.flashType="";
		}
	}
})