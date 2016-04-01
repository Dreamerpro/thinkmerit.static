angular.module('thinkmerit')
.factory('ScreenManager',function  ($rootScope) {
	
	return {
		isSmallDevice:function () {
			if($(document).width()<768){
				/*console.log("mobile/tablet device");*/
				return true;
			}
			return false;

		},
		work:function () {
			if(this.isSmallDevice()){$rootScope.isCollapsed=true;}
		}
	}
})
.factory('QuestionListService',function ($location, $http, AP, $routeParams) {
	

	return {
		prev:function (_self) {
			if(_self.questions.previousPage){
				$location.search({pageNo:_self.questions.previousPage});
			}
		},
		next:function (_self) {
			if(_self.questions.nextPage){
				$location.search({pageNo:_self.questions.nextPage});
			}
		},
		showanswer:function (_self, id) {
			var canceled=false;
			swal({
					  title: "",
					  text: "<img src=\"/images/loading.gif\">",
					  html:true,
					  showCancelButton: true,
					  showConfirmButton:false
				},function (argument) {
					canceled=argument;
				})
			$http.get(AP+'/answer/'+id)
			.success(function (data) {
				_self.answer=data.answer;
				if(!canceled){	swal.close(); $('#answer-modal').modal({show:true});	}
			})
			.error(function (argument) { swal({   title: "Error!",   text: "There was an error loading answer.",   timer: 2000,   showConfirmButton: false });	})
			
		},
		showsolution:function (_self, id) {
			var canceled=false;
			swal({
					  title: "",
					  text: "<img src=\"/images/loading.gif\">",
					  html:true,
					  showCancelButton: true,
					  showConfirmButton:false
				},function (argument) {
					canceled=argument;
				})
			$http.get(AP+'/solution/'+id)
			.success(function (data) {
				_self.solution=data.solution;
				if(!canceled){	swal.close();$('#solution-modal').modal({show:true});	}
			})
			.error(function (argument) {swal({   title: "Error!",   text: "There was an error loading solution.",   timer: 2000,   showConfirmButton: false });	})

		},
		showinfo:function (_self, id) {
			var canceled=false;
			swal({
					  title: "",
					  text: "<img src=\"/images/loading.gif\">",
					  html:true,
					  showCancelButton: true,
					  showConfirmButton:false
				},function (argument) {
					canceled=argument;
				})
			$http.get(AP+'/question-info/'+id)
			.success(function (data) {
				_self.question_info=data;
				if(!canceled){	swal.close();$('#question-info-modal').modal({show:true});	}
			})
			.error(function (argument) { swal({ title: "Error!",   text: "There was an error loading question information.",   timer: 2000,   showConfirmButton: false });	})
		},
		showvideo:function (video) {
			if(!video){return false;}
			var canceled=false;
			swal({
				  title: "",
				  text: "<img src=\"/images/loading.gif\">",
				  html:true,
				  showCancelButton: false,
				  showConfirmButton:false,
				  timer:1000
			})
			$('#question-video-modal').modal({show:true});
		},
		togglefavourite:function (_self,question,list) {
			$http.get(AP+'/dfs/toggleitem/'+question.id+'/1')
			.success(function (data) {
				if(list){$item=_self.questions.questions[_self.questions.questions.indexOf(question)];$item.userfavourite[0]=!$item.userfavourite[0];}
				else{_self.question.userfavourite[0]=!_self.question.userfavourite[0];}	
			})
			.error(function (data) {	console.log(data);	})
		},
		toggledoubt:function (_self,question,list) { 
			$http.get(AP+'/dfs/toggleitem/'+question.id+'/2')
			.success(function (data) {
				if(list){ $item=_self.questions.questions[_self.questions.questions.indexOf(question)]; $item.userdoubt[0]=!$item.userdoubt[0];}
				else{_self.question.userdoubt[0]=!_self.question.userdoubt[0];}
			})
			.error(function (data) { console.log(data);	})
		},
		togglesolved:function (_self, question,list) {
			$http.get(AP+'/dfs/toggleitem/'+question.id+'/3')
			.success(function (data) {
				if(list){ $item=_self.questions.questions[_self.questions.questions.indexOf(question)]; $item.usersolved[0]=!$item.usersolved[0];}
				else{_self.question.usersolved[0]=!_self.question.usersolved[0];}
			})
			.error(function (data) {	console.log(data);	})
		},
		share:function (_self, url, type) {
			$("#question-share").modal('hide');
			if(type=="fb"){
				FB.ui({
					  method: 'share',
					  href: "https://"+window.location.hostname+"/question-bank"+url,
					  description:'',
					  title:'Have you tried this question?'
					}, function(response){
						
					});
			}
			else if(type=="tw"){
				window.open('https://twitter.com/intent/tweet?text='+window.location.hostname+url+"&headline=Have you solved this question?", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
			}
			else if(type=="gp"){
				window.open('https://plus.google.com/share?url='+window.location.hostname+url+"&headline=Have you solved this question?", '', 'data-prefilltext=Headline=Have you solved this question?,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
			}
			return url;
		}


	}//end
})
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
		var date=new Date();
		var time=date.getTime()+18*60*1000;
		date.setTime(time);
 			CookieService.set('authenticated',true,{expires:date});
			CookieService.set('name',response.name);
			CookieService.set('email',response.email);
			CookieService.set('avatar',response.avatar);
			
			$rootScope.isLoggedIn=true;
		 	
	}
	var uncacheSession=function($timeout){
		CookieService.unset('authenticated');
		$rootScope.isLoggedIn=false;
	}
	/*var that=this;*/
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
.factory("AuthHelper", function (AuthService,$rootScope, $location, UserService) {
	return {
		initIfLoggedIn:function () {
	     if(AuthService.isLoggedIn()){
	              $rootScope.flash="";
	              $rootScope.user=UserService.getUser();
	      }
	   	},
		isAuthorized:function () {
			$client=AuthService.isLoggedIn();
			if($client) { this.initIfLoggedIn() ;return true;}
			else{
				$res=false;
				AuthService.authuser()
					.success(function (){ $res=true; $location.path('/dashboard');	})
					.error(function (){	$res=false;	});
				return $res;
			}
		},
		redirectIfUnAuthorized:function () {
			if(!$rootScope.islanding){
	              $rootScope.islanding=true;  
	              $location.path('/');
	              $location.hash('');
	              $rootScope.flash="You must log in first.";
          	}
   		},
		redirectIfAuthorized:function () {
			if($rootScope.islanding){ $location.path('/dashboard');      }     
   		}
	}
})