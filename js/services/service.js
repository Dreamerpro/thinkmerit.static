angular.module('thinkmerit')
.factory('ScreenManager',function  ($rootScope) {

	return {
		isSmallDevice:function () {
			if($(document).width()<768){
				return true;
			}
			return false;

		},
		work:function () {
			if(this.isSmallDevice()){$rootScope.isCollapsed=true;}
		}
	}
})
// .factory("subjecttypeService", function(AP, $http,$routeParams,StringMods) {
// 	return {get:function() { 
// 				console.log($routeParams.course);
// 				$http.post(AP+"/get/subjectsandquestiontypes",{course:"+2 Science"})
// 				.then(function(data) { console.log(data); return data.data; });
// 		}};
// })
.factory('QuestionListService',function ($location, $http, AP, $routeParams,StringMods) {


	return {
		prev:function (_self) {
			console.log(_self.questions.previousPage);
			if(_self.questions.prev_page_url){
				// $location.search({pageNo:_self.questions.previousPage});
				var temp=$location.search();
				temp.pageNo=_self.questions.current_page-1;
				_self.pageNo=temp.pageNo;
				$location.search(temp);
			}
		},
		next:function (_self) {
			console.log(_self.questions);
			if(_self.questions.next_page_url){
				console.log("call");
				var temp=$location.search();
				temp.pageNo=_self.questions.current_page+1;
				_self.pageNo=temp.pageNo;
				$location.search(temp);
			}
		},
		fetchQuestions:function(_self) {
			_self.pageNo=$location.search().pageNo||1;
			$http.post(AP+'/get/questions',this.createQueryData())
				.success(function (data) { _self.questions=data;})
				.error(function (data) {console.log(data);})
			
		},
		createQueryData:function() {
			var data={};
			data.course=StringMods.removeUnderScore($routeParams.course);
			data.page=$location.search().pageNo||1;
			if($location.search().type){data.type=StringMods.removeUnderScore($location.search().type);}

			if($location.search().topic){  data.topic=StringMods.removeUnderScore($location.search().topic); }
			if($location.search().chapter){  data.chapter=StringMods.removeUnderScore($location.search().chapter);  }
			if($location.search().subject){ 	data.subject=StringMods.removeUnderScore($location.search().subject); }
			
			return data;
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
			$("#q-video-container").html(
				"<iframe width='500' allowfullscreen height='350'src='"+video.url+"' style=\"display:block;margin:0 auto\"></iframe>"
			);
		},
		togglefavourite:function (question) {
			console.log(question);
			$http.get(AP+'/dfs/toggleitem/'+question.id+'/1')
			.success(function (data) {
				question.userfavourite[0]=!question.userfavourite[0];
			})
			.error(function (data) {	console.log(data);	})
		},
		toggledoubt:function (question) {
			$http.get(AP+'/dfs/toggleitem/'+question.id+'/2')
			.success(function (data) {
				question.userdoubt[0]=!question.userdoubt[0];
			})
			.error(function (data) { console.log(data);	})
		},
		togglesolved:function (question) {
			$http.get(AP+'/dfs/toggleitem/'+question.id+'/3')
			.success(function (data) {
				question.usersolved[0]=!question.usersolved[0];
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
.factory("FetchService", function($http,$routeParams,StringMods,EntitySelector,AP) {
	return {
		getsubjects:function(_self) {
			if($routeParams.course){
			return $http.post(AP+'/get/subjects',{ course:StringMods.removeUnderScore($routeParams.course)})
						.success(function (data) { _self.datas.subjects=data;	})
						.error(function (argument) { console.log(argument);})
			}
		},
		getchaptersData:function(_self) {
			// if($routeParams.subject){
				$http.post(AP+'/get/chapters/notes/withsubjectsnccp',{
					course:StringMods.removeUnderScore($routeParams.course)
				})
				.success(function (data) {
					_self.datas.course=data;
					// .modules;
					// _self.datas.subjects=data.subjects
					EntitySelector.selectNotesChapter(_self,data);
				})
				.error(function (argument) { console.log(argument);})
			// }
		},
		gettopics:function(_self) {
			
		},
		dashboard:function(_self) {
			
			$http.get(AP+'/user/dashboard')
			.success(function (data) {	
				_self.stats=data.totalstats; 
				_self.wdatas.stickies=data.stickies;
				_self.wdatas.todos=data.todos;
				_self.wdatas.bookmarks=data.bookmarks;
			})
			.error(function (argument) { 
				console.log(argument);
				_self.stats=null; 
				_self.wdatas.stickies=[];
				_self.wdatas.todos=[];
				_self.wdatas.bookmarks=[];
			})
		}
	}
})
.factory("EntitySelector", function(StringMods,$routeParams,$location) {
	return{
		selectNotesChapter:function(_self,data) {
			/*
			Only for use in  notes
			***/
			if($routeParams.chapter){
				for (var i = data.length - 1; i >= 0; i--) {
					for (var j = data[i].chapters.length - 1; j >= 0; j--) {
						if(data[i].chapters[j].name==StringMods.removeUnderScore($routeParams.chapter)){ _self.selected.chapter=data[i].chapters[j]; 	}
					};
				}
			}
		},
		
		selectSubject:function(_self) {
			for (var i = _self.datas.subjects.length - 1; i >= 0; i--) {
				if(_self.datas.subjects[i].name===StringMods.removeUnderScore($location.search().subject)){
					_self.selected.subject=_self.datas.subjects[i];
				}
			}
		},
		selectChapter:function(_self) {
			for (var i = _self.datas.chapters.length - 1; i >= 0; i--) { //set the selected chapter
				if(_self.datas.chapters[i].name===StringMods.removeUnderScore($location.search().chapter)){
					_self.selected.chapter=_self.datas.chapters[i];
				}
			}
		},
		selectTopic:function(_self) {
			for (var i = _self.datas.topics.length - 1; i >= 0; i--) { //set the selected chapter
				if(_self.datas.topics[i].name===StringMods.removeUnderScore($location.search().topic)){
					_self.selected.topic=_self.datas.topics[i];
				}
			}
		},
		selectType:function(_self) {
			for (var i = _self.datas.types.length - 1; i >= 0; i--) { //set the selected chapter
				if(_self.datas.types[i].name===StringMods.removeUnderScore($location.search().type)){
					_self.selected.type=_self.datas.types[i];
				}
			}
		}
		
	}
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
			// if(!CookieService.get('authenticated')){return false;}
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
			var date=new Date();
			var time=date.getTime()+18*60*1000;
			date.setTime(time);
			return $cookies.put(key, val,{expires:date});
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

.factory("AuthService", function($http, CookieService,AP,$rootScope,UserService){
	var cacheSession=function(response){

 			CookieService.set('authenticated',true);
			CookieService.set('name',response.name);
			CookieService.set('email',response.email);
			CookieService.set('avatar',response.avatar);

			$rootScope.isLoggedIn=true;
			$rootScope.user=UserService.getUser();
	}
	var cacheguestSession=function(){
 			CookieService.set('authenticated',false);
 			CookieService.set('name',"Guest user");
 			$rootScope.user=UserService.getUser();
 	}
	var uncacheSession=function(){
		CookieService.unset('authenticated');
		$rootScope.isLoggedIn=false;
	}
	/*var that=this;*/
	return {
		login:function(credentials){
			//credentials._token=CookieService.get('XSRF-TOKEN');
			var promise= $http.post(AP+'/auth/login',credentials);
			promise.success(function (response) {
				cacheSession(response);
			});
			return promise;
		},
		logout:function(){
			var promise= $http.get(AP+'/auth/logout');
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
		// authuser:function () {
		// 	$http.get(AP+ '/csrf_token')
		// 	.success(function(d) {
		// 		console.log(d);
		// 		CookieService.set('X-CSRF-TOKEN',d);
		// 		}
		// 	)
		// 	var promise= $http.get(AP+'/user');
		// 	promise.success(function (response) {
		// 		cacheSession(response);
		// 	})
		// 	.error(uncacheSession);
		// 	return promise;
		// },
		isLoggedIn:function(){
			if(CookieService.get('authenticated')==true){return true;}
			else{
				if(!$rootScope.isloginCalled){
					var promise= $http.get(AP+'/user');
					promise.success(function (response) {
						 cacheSession(response);
						 $rootScope.isloginCalled=true;
						 return true;
					})
					.error(function() {
						$rootScope.isloginCalled=true;
					})
				}
				cacheguestSession();
				return false;
				// var promise= $http.get(AP+'/user');
				// promise.success(function (response) {
				// 	cacheSession(response);
				// })
				// .error(uncacheSession);
				// return CookieService.get('authenticated');
			}
			
		},

	}
})
.factory("AuthHelper", function (AuthService,$rootScope, $location, UserService,ScreenManager) {
	return {
		
		redirectIfUnAuthorized:function () {
			$rootScope.islanding=true;
	        $location.url('/');
			$rootScope.flash="You must log in first.";
   		},
   		init:function() {
   			if(AuthService.isLoggedIn()){
	            $rootScope.flash="";
	            $rootScope.user=UserService.getUser();
	            ScreenManager.work();
	            // this.redirectIfAuthorized();
	      	}
	      	else{ /* this.redirectIfUnAuthorized();*/ 	}
   		},
   		isLanding:function() {
   			var homeurl=['/#home','/#about', '/#catalogue','/#careers','/#vision', '/#faq', '/#contact'];
			if(_.contains(homeurl,$location.url()) || !$location.url().split(".in")[1]){return true; }
			return false;
   		},
		redirectIfAuthorized:function () {
			if(this.isLanding()){ $location.path('/dashboard');      }
   		}
	}
})
// .factory('httpRequestInterceptor', function () {
//   return {
//     request: function (config) {

//       config.headers['X-CSRF-TOKEN'] = "xyz";//'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==';
//       config.headers['X-Requested-With'] = 'XMLHttpRequest';
//       // $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
// 			return config;
//     }
//   };
// });
