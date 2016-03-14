angular.module('thinkmerit')
.controller('NotesCtrl', function ($http,AP) {
	var _self=this;
	this.datas={courses:[],subjects:[],chapters:[],modeules:[],topics:[]};
	this.selected={}
	_self.init=function () {
		$http.get(AP+'/get/courses')
		.success(function (data) {	_self.datas.courses=data;	})
		.error(function (argument) { console.log(argument);})
	};
	this.selectcourse=function (course) {
		_self.selected.course=course;
		_self.datas.subjects=[];
		$http.get(AP+'/get/subjects/'+course.id)
		.success(function (data) {	_self.datas.subjects=data;	})
		.error(function (argument) { console.log(argument);})
	}
	this.selectsubject=function (subject) {
		_self.selected.subject=subject;
		_self.datas.chapters=[];
		$http.get(AP+'/get/getchaptersfromsubject/'+subject.id)
		.success(function (data) {	_self.datas.chapters=data;	})
		.error(function (argument) { console.log(argument);})
	}
	/*this.selectcourse=function (course) {
		_self.selected.course=course;
		_self.datas.subjects=[];
		$http.get(AP+'/get/subjects')
		.success(function (data) {	_self.datas.subjects=data;	})
		.error(function (argument) { console.log(argument);})
	}*/
})
.controller('DashboardCtrl', function ($http,AP) {
	var _self=this;
	_self.stats={};
	_self.wdatas={todos:[],bookmarks:[],stickies:[]};
		
	_self.init=function () {
		$http.get(AP+'/user/stats')
		.success(function (data) {
			_self.stats=data;
		})
		.error(function (argument) { console.log(argument);})

		$http.get(AP+'/user/get/stickies')
		.success(function (data) { _self.wdatas.stickies=data;	})
		.error(function (argument) {console.log(argument);_self.wdatas.stickies=[];	})

		$http.get(AP+'/user/get/todos')
		.success(function (data) { _self.wdatas.todos=data;	})
		.error(function (argument) {console.log(argument);	_self.wdatas.todos=[];})

		$http.get(AP+'/user/get/bookmarks')
		.success(function (data) { _self.wdatas.bookmarks=data;	})
		.error(function (argument) {console.log(argument);	_self.wdatas.bookmarks=[];})
		
	}

	_self.deleteItem=function (item,type) {
		$http.post(AP+'/user/delete/'+type,{ids:[item.id]})
		.success(function (data) { 
			if(type=="sticky"){_self.wdatas.stickies.splice(_self.wdatas.stickies.indexOf(item),1);}
			else if(type=="todo"){_self.wdatas.todos.splice(_self.wdatas.todos.indexOf(item),1);}
		})
		.error(function (argument) {console.log(argument);	})
		
	}

	_self.save=function (type,index) {
		$fn=null;
		if(_self.savemode==="new"){$fn="/add/";}
		else if(_self.savemode==="update"){$fn="/user/update/";}
		else{ alert('invalid operation'); return false; }
		
		$prom= $http.post(AP+$fn+type,_self.current);
		$prom.success(function (data) { 
			if(_self.savemode==="new"){
				if(type=="sticky"){_self.wdatas.stickies.push(data);}
				else if(type=="todo"){_self.wdatas.todos.push(data);}	
			}
			else if(_self.savemode==="update"){
				if(type=="sticky"){_self.wdatas.stickies[index]=data;}
				else if(type=="todo"){_self.wdatas.todos[index]=data;}	
			}
			
			_self.current={};		
		})
		.error(function (argument) {console.log(argument);	})

		return $prom;
	}
})
.controller('careerCtrl', function($http, FlashService, $scope, AP){
	var ctx=this;

	ctx.struct={
		name:'',
		phone:'',
		email:'',
		college:'',
		branch:'',
		year:'',
		address:'',
		why:'',
		content:true,
		technical:false,
		operation:false
	}
	ctx.data=angular.copy(ctx.struct);
	ctx.isValid=function(){

		return ctx.data.name!='' && ctx.data.phone!=undefined && ctx.data.phone.length==10 && ctx.data.email!='' && ctx.data.college!=''  && ctx.data.branch!=''  && ctx.data.year!='' 
		 && ctx.data.address!=''  && ctx.data.why!=''  && ctx.data.content==true ; 
	}
	ctx.submit=function(){
		//console.log($rootScope.CSRF_TOKEN);
		console.log(ctx.data);
		if(ctx.isValid()){
			//submit
			FlashService.clear();
			$http.post(AP+'/careersapply',ctx.data)
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
.controller('UtilityCtrl', function(){
	var that=this;
	that.config={
		title:'',
		bgClass:'',
		deletemode:false,
		editmode:false, //openmode
		type:'',
		datas:[]
	}
	that.getBGClass=function(type){
		if(type==="stickies"){return 'bg-stickies';}
		else if(type==="bookmarks"){return 'bg-yellow';}
		else if(type==="todo"){return 'bg-todo';}
	}
	that.showItem=function(a){
		that.config.viewmode=true;
		//that.config.editmode=true;
		that.currentItem=a;
	}
	that.showList=function(){
		that.config.viewmode=false;
	}
	that.toggleDeleteMode=function(){
		that.config.deletemode=!that.config.deletemode;
	}
	that.deleteItem=function(index){
		//delete ajax request and then delete local 
		that.config.datas.splice(index, 1);
	}
	that.addItem=function(data){
		swal({
		  title: "Add "+that.config.type,
		  text: '',//Write something interesting:
		  type: 'input',
		  showCancelButton: true,
		  closeOnConfirm: false,
		  animation: "slide-from-top"
		}, function(inputValue){
		  swal("Successfully added.","", 'success');
		});
	}
	that.save=function (t, dc, editform, index)  {
		dc.save(t,index)
		.success(function  () {
			that.config.editmode=false;
			editform.$setPristine();
		})
		.error(function () {
			
		})
	}

})
.controller("ScrollCtrl", ['$rootScope', '$location', '$anchorScroll', 
	function($rootScope, $location,  $anchorScroll){
	$rootScope.goTo=function(id){
	
	if(id.substring(0,1)=="!"){
		$location.hash(id.substring(1,id.length));
		$anchorScroll();
	}		
	}
}])
.controller('AuthController', ['AuthService','$location','$rootScope',function(AuthService, $location,$rootScope){
	var that=this;
	this.credentials={};
	this.login=function(){
		AuthService.login(that.credentials)
		.success(function(data){
			//$rootScope.user=data;
			$location.path('/dashboard');	
		});
		
	}
	
}])
.controller("LineCtrl", function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Solved', 'Doubts'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
})
/*.controller('DashboardCtrl', function ($http) {
	var _self=this;
	this.
	this.init=function () {
		$http.get('/bookmarks').success(function () {
			
		});
	}
})*/

