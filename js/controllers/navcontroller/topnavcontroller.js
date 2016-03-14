angular.module('thinkmerit')
.controller('NavCtrl', function($rootScope, AuthService,$location){
	var that=this;
	that.isFullScreenAvailable=function(){
		if (
			document.fullscreenEnabled || 
			document.webkitFullscreenEnabled || 
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled
		) {
		return true;
		}
		return false;
	}

	that.toggleFullScreen=function(){
			  if (!document.fullscreenElement &&    // alternative standard method
			      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
			    if (document.documentElement.requestFullscreen) {
			      document.documentElement.requestFullscreen();
			    } else if (document.documentElement.msRequestFullscreen) {
			      document.documentElement.msRequestFullscreen();
			    } else if (document.documentElement.mozRequestFullScreen) {
			      document.documentElement.mozRequestFullScreen();
			    } else if (document.documentElement.webkitRequestFullscreen) {
			      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			    }
			  } else {
			    if (document.exitFullscreen) {
			      document.exitFullscreen();
			    } else if (document.msExitFullscreen) {
			      document.msExitFullscreen();
			    } else if (document.mozCancelFullScreen) {
			      document.mozCancelFullScreen();
			    } else if (document.webkitExitFullscreen) {
			      document.webkitExitFullscreen();
			    }
			  }
	}
	that.showSearch=false;
	that.toggleSearch=function(){
		return that.showSearch=!that.showSearch;
	}

	$rootScope.isCollapsed=false;
	that.toggleCollapsible=function(){
		return $rootScope.isCollapsed=!$rootScope.isCollapsed;
	}
	that.logout=function(){
				swal({
		  title: "Are you sure?",
		  text: "Your will be logged out!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonClass: "btn-danger",
		  confirmButtonText: "Yes!",
		  closeOnConfirm: false,
		  showLoaderOnConfirm: true
		},
		function(){
		  AuthService.logout()
		  .success(function () {
		  	swal({
			  title: "Logged Out!",
			  text: "Your have been logged out.",
			  showConfirmButton: false,
			  timer:2000
		  	})
		  	$location.path('/');
		  	//console.log('heloo');
			//swal({title:'asd'});
			
		  
		  })
		
		});
	}
})