
angular.module('thinkmerit',['ngRoute','ngCookies','ui.calendar','chart.js','chieffancypants.loadingBar', 'ngAnimate','ui.select', 'ngSanitize','ngIdle'])
.constant('AP', 'https://api.thinkmerit.in')
.config(['$routeProvider','$httpProvider','$locationProvider', 
    function($routeProvider, $httpProvider, $locationProvider) {

	$tu="templates/";
	$routeProvider
	.when("/", { templateUrl:$tu+'home/index.html' })//comingsoon
	.when("/careers", { templateUrl:$tu+'careers/index.html' })
  .when("/dashboard", {templateUrl:$tu+'dashboard/index.html'})
  .when("/dashboard/:item", {templateUrl:$tu+'dashboard/item.html'})
  .when("/notes", {redirectTo:"/notes/+2_Science"})//templateUrl:$tu+'notes/index.html'
  .when("/notes/:course", {templateUrl:$tu+'notes/course.html'})
  .when("/notes/:course/:subject", {templateUrl:$tu+'notes/course.html'})
  .when("/notes/:course/:subject/:chapter", {templateUrl:$tu+'notes/chapter.html'})

  .when("/question-bank", {redirectTo:"/question-bank/+2_Science"})
  .when("/question-bank/:course", {templateUrl:$tu+'questionbank/index.html'})
  .when("/question-bank/:course/:subject", {templateUrl:$tu+'questionbank/index.html'})
  .when("/question-bank/:course/:subject/:chapter", {templateUrl:$tu+'questionbank/index.html'})
  .when("/question-bank/:course/:subject/:chapter/:topic", {templateUrl:$tu+'questionbank/index.html'})
  .when("/question-bank/:course/:subject/:chapter/:topic/:questionid", {templateUrl:$tu+'questionbank/index.html'})
  .when("/change-password", {templateUrl:$tu+'profile/changeprofile.html'})
  .when("/profile", {templateUrl:$tu+'profile/index.html'})
	//.otherwise({ templateUrl:$tu+'errors/invalidurl.html' });

  $httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);

}])
.config(function(IdleProvider, KeepaliveProvider) {
  KeepaliveProvider.interval(18*60); // 5 minute keep-alive ping//5*60
})
 .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
})
 .run(function (Idle) {
    Idle.watch();
 })
.run(function($rootScope, $location, $http, $cookies, AP, AuthService,  AuthHelper, ScreenManager){

  
//detect route change
      $rootScope.$on('$locationChangeSuccess', function(event){
          var url = $location.url(),
          homeurl=['/','/#home','/#about', '/#catalogue','/#careers','/#vision', '/#faq', '/#contact'];

          if(_.contains(homeurl, url)){  $rootScope.islanding=true;}
          else{  $rootScope.islanding=false;}
          
          

          if(AuthHelper.isAuthorized()){ 
            ScreenManager.work(); 
            AuthHelper.redirectIfAuthorized();       
         }
          else{  AuthHelper.redirectIfUnAuthorized(); }

          $rootScope.path=$location.path();
      });
      $rootScope.$on('Keepalive', function() {
        if(AuthService.isLoggedIn()){
          AuthService.authuser();
        }
        
      });
      
  /*$http.defaults.headers.post['X-CSRF-TOKEN']=CSRF_TOKEN; 
  $cookies.put('XSRF-TOKEN',CSRF_TOKEN);*/
   /*if(!$cookies.get('XSRF-TOKEN')){//$rootScope.CSRF_TOKEN==undefined || $rootScope.CSRF_TOKEN==null
        $http.get(AP+'/csrf_token').success(function(d){
            $cookies.put('XSRF-TOKEN',d.XSRF_TOKEN);
            //$cookies.put('laravel-session',d.LARAVEL_ID);
            //$http.defaults.headers.common.X-CSRF-TOKEN = 'Basic YmVlcDpib29w';
            //$http.defaults.headers.post['X-CSRF-TOKEN']=$cookies.get('XSRF-TOKEN'); 
            $http.defaults.headers.post['X-CSRF-TOKEN']=d.XSRF_TOKEN; 
          });
   }*/
   if(!$cookies.get('XSRF-TOKEN')){
        $http.get(AP+'/csrf_token').success(function(d){
        $cookies.put('XSRF-TOKEN',d);
        $http.defaults.headers.post['X-CSRF-TOKEN']=d;
      });
   }
  
   $rootScope.isLocationActive=function (argument) {
     return $rootScope.path.indexOf(argument)>0;
   }

   $rootScope.currentPath=window.location.href;
   document.body.scrollTop=0;


});
