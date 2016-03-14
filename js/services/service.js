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
.factory('UserService', function (SessionService) {
	return {
		getUser:function () {
			if(!SessionService.get('authenticated')){return false;}
			return {
				name:SessionService.get('name'),
				email:SessionService.get('email'),
				avatar:SessionService.get('avatar')
			}
		}
	}
})
.factory("SessionService", function(){
	return {
		get:function(key){
			return sessionStorage.getItem(key);
		},
		set:function(key, val){
			return sessionStorage.setItem(key,val);
		},
		unset:function(key){
			return sessionStorage.removeItem(key);
		}
	}
})
.factory("AuthService", function($http, SessionService,AP){
	var cacheSession=function(response){
		SessionService.set('authenticated',true);
		SessionService.set('name',response.name);
		SessionService.set('email',response.email);
		SessionService.set('avatar',response.avatar);
		console.log(response);
	}
	var uncacheSession=function(){
		SessionService.unset('authenticated');
	}
	return {
		login:function(credentials){
			var promise= $http.post(AP+'/auth/login',credentials);
			promise.success(function (response) {
				cacheSession(response);
			});
			return promise;
		},
		logout:function(){
			var promise= $http.get(AP+'/logout');	
			promise.success(uncacheSession);
			return promise;
		},
		isLoggedIn:function(){
			return SessionService.get('authenticated');
		},
		
	}
})