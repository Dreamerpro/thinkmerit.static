angular.module('thinkmerit')
/*.factory("IndexFinder", function () {
	return{
		findIndexByName:function (obj, query) {
						for (var i = obj.length - 1; i >= 0; i--) {
							if(obj[i].name==query){
								return i;
							}
						};
		}
	}
})
.factory("DataService", function (AP,$rootScope,$http) {


 return {
 	fetchcourses:function () {
			var prom=$http.get(AP+'/get/courses');
 				prom.success(function (argument) { $rootScope.courses=argument;})
				return prom;
			},
	fetchstickies:function () {
				return $http.get(AP+'/user/get/stickies');
				},
	courses: $rootScope.courses || [],
	subjects: $rootScope.subjects|| [],
	chapters: $rootScope.chapters|| [],
	modules: $rootScope.modules|| [],
	topics: $rootScope.topics|| [],
	stickies: $rootScope.stickies|| []

 }
 this.removeUnderScore=function (val) {	
		if(val==undefined){return false;}
		return val.replace(/_/g,' ');
	}
	this.addUnderScore=function (val) {	
		if(val==undefined){return false;}
		return val.replace(/ /g,'_');}
	
	
})*/
.factory("StringMods",function () {
	return {
		removeUnderScore:function (val) {
			if(val==undefined){return false;}
			return val.replace(/_/g,' ');
		},
		addUnderScore:function (val) {	
			if(val==undefined){return false;}
			return val.replace(/ /g,'_');
		}
	}
})
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
.factory('UserService', function (CookieService) {
	return {
		getUser:function () {
			if(!CookieService.get('authenticated')){return false;}
			return {
				name:CookieService.get('name'),
				email:CookieService.get('email'),
				avatar:CookieService.get('avatar')
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
.factory('CookieService', function($cookies){
	return {
		set:function(key, val){
			return $cookies.put(key, val);
		},
		get:function(key){
			return $cookies.get(key);
		},
		unset:function(key){
			return $cookies.remove(key);
		},
		clearuser:function(){
			return $cookies.remove('authenticated');
		}
	}
})

.factory("AuthService", function($http, CookieService,AP,$timeout,$rootScope){
	var cacheSession=function(response){

 			CookieService.set('authenticated',true);
			CookieService.set('name',response.name);
			CookieService.set('email',response.email);
			CookieService.set('avatar',response.avatar);
			console.log(response);
			$rootScope.isLoggedIn=true;
		 	
	}
	var uncacheSession=function($timeout){
		CookieService.unset('authenticated');
		$rootScope.isLoggedIn=false;
	}
	/*var that=this;*/
	return {
		login:function(credentials){
			console.log(credentials);
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
		signup:function(credentials){//manualregister
			var promise= $http.post(AP+'/manualregister',credentials);
			promise.success(function (response) {
				cacheSession(response);
			});
			return promise;
		},
		authuser:function () {
			var promise= $http.get(AP+'/user');
			promise.success(function (response) {
				cacheSession(response);
			});
			return promise;
		},
		isLoggedIn:function(){
			return CookieService.get('authenticated');
		},
		
	}
})