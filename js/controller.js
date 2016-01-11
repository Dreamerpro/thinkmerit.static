angular.module('thinkmerit')
.controller('careerCtrl', function($http, FlashService, $scope){
	var ctx=this;

	ctx.struct={
		name:'',
		phone:'',
		email:'',
		college:'',
		branch:'',
		year:'',
		address:'',
		why:''
	}
	ctx.data=angular.copy(ctx.struct);
	ctx.isValid=function(){

		return ctx.data.name!='' && ctx.data.phone!=undefined && ctx.data.phone.length==10 && ctx.data.email!='' && ctx.data.college!=''  && ctx.data.branch!=''  && ctx.data.year!='' 
		 && ctx.data.address!=''  && ctx.data.why!='' ; 
	}
	ctx.submit=function(){
		//console.log($rootScope.CSRF_TOKEN);
		if(ctx.isValid()){
			//submit
			FlashService.clear();

			$http.post('http://dev.api.thinkmerit.in/careersapply',ctx.data)
			.success(function(response){
				$scope.careerForm.$setPristine();
				FlashService.show(response.message,'success');
				ctx.data=angular.copy(ctx.struct);
				
			})
			.error(function(response){
				FlashService.show(response.error,'error');
			})
		}
		else{
			alert("Please fill all the details correctly.")
		}
	}
})