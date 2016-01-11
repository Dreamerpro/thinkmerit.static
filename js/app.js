angular.module('thinkmerit',['ngRoute','ngCookies'])
.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {
	$tu="templates/";
	$routeProvider
	.when("/", { templateUrl:$tu+'home/index.html' })
	.when("/careers", { templateUrl:$tu+'careers/index.html' })
	.otherwise({ templateUrl:$tu+'errors/invalidurl.html' });

  $httpProvider.defaults.withCredentials = true;
}])
//.constant("CSRF_TOKEN",function($http){$http.get('http://dev.api.thinkmerit.in/csrf_token').success(function(d){ return d; } )})
.run(function($rootScope, $location, $http, $cookies){

  
   if($rootScope.CSRF_TOKEN==undefined || $rootScope.CSRF_TOKEN==null){
        $http.get('http://dev.api.thinkmerit.in/csrf_token').success(function(d){
            $cookies.put('XSRF-TOKEN',d.XSRF_TOKEN);
            //$cookies.put('laravel-session',d.LARAVEL_ID);
            //$rootScope.CSRF_TOKEN=d.XCSRF_TOKEN;  
            $http.defaults.headers.post['X-CSRF-TOKEN']=d.XSRF_TOKEN;
          });
        
        //$http.defaults.headers.common.X-CSRF-TOKEN = 'Basic YmVlcDpib29w';
   }
   $rootScope.$on('$locationChangeSuccess', function(event){
        var url = $location.url()/*,
        params = $location.search()*/;
        if(url=="/"){
           $rootScope.islanding=true;
        }
        else{
           $rootScope.islanding=false;
        }
   });

});