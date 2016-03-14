angular.module('thinkmerit',['ngRoute','ngCookies','ui.calendar','chart.js','chieffancypants.loadingBar', 'ngAnimate'])
.constant('AP', 'http://dev.api.thinkmerit.in')//http://188.166.253.128  ,'angularRipple'
.config(['$routeProvider','$httpProvider','$locationProvider', 
    function($routeProvider, $httpProvider, $locationProvider) {

	$tu="templates/";
	$routeProvider
	.when("/", { templateUrl:$tu+'home/index.html' })//comingsoon
	.when("/careers", { templateUrl:$tu+'careers/index.html' })
  .when("/dashboard", {templateUrl:$tu+'dashboard/index.html'})
  .when("/notes", {templateUrl:$tu+'notes/index.html'})
	//.otherwise({ templateUrl:$tu+'errors/invalidurl.html' });

  $httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);

}])
 .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
})
//.constant("CSRF_TOKEN",function($http){$http.get('http://dev.api.thinkmerit.in/csrf_token').success(function(d){ return d; } )})
.run(function($rootScope, $location, $http, $cookies, AP, AuthService, UserService){

  
   if($rootScope.CSRF_TOKEN==undefined || $rootScope.CSRF_TOKEN==null){
        $http.get(AP+'/csrf_token').success(function(d){
            $cookies.put('XSRF-TOKEN',d.XSRF_TOKEN);
            //$cookies.put('laravel-session',d.LARAVEL_ID);
            //$rootScope.CSRF_TOKEN=d.XCSRF_TOKEN;  
            //$http.defaults.headers.common.X-CSRF-TOKEN = 'Basic YmVlcDpib29w';
            $http.defaults.headers.post['X-CSRF-TOKEN']=d.XSRF_TOKEN;
          });
   }
   $rootScope.$on('$locationChangeSuccess', function(event){
        var url = $location.url(),
        homeurl=['/','/#home','/#about', '/#catalogue','/#careers','/#vision', '/#faq', '/#contact'];
       
        if(!_.contains(homeurl, url) ){
            if(!AuthService.isLoggedIn()){
              $location.path('/');
              $location.hash('');
              $rootScope.flash="You must log in first.";
            }
            else{
              $rootScope.islanding=false;  
              $rootScope.flash="";
              $rootScope.user=UserService.getUser();
            }
                    
        }
        if(_.contains(homeurl, url)){
          if(AuthService.isLoggedIn()){
            $location.path('/dashboard');   
          }
          else{
            $rootScope.islanding=true;  
          }             
        }  
        $rootScope.path=$location.path();   
        document.body.scrollTop=0;

   });
   $rootScope.isLocationActive=function (argument) {
     return $rootScope.path.indexOf(argument)>0;
   }



});
/*

#RewriteEngine on
#RewriteRule ^([A-Za-z0-9-]+)/?$ #/$1 [NC,L]


*/