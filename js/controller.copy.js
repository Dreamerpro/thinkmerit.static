/*controller copy*/
angular.module('cultstage')
.controller('headerCtrl', function($scope, $rootScope){
	$scope.ngHeader=false;
	$scope.menus=$rootScope.headerMenus;
	$scope.subMenus=$rootScope.subMenus;
	$scope.set=function(v){
		$rootScope.activeHM=v;
	};
	$scope.isActive=function(v){
		return $rootScope.activeHM==v;
	}
})
.controller('langSCtrl', function($scope){
	$scope.langs=['Hindi','English','Kannada','Tamil','Telugu','Malayalam','Bangla', 'Marathi'];
})
/*.controller('ucCtrl', function($scope,$rootScope){
	$scope.val=0;
	$scope.subMenus=$rootScope.subMenus.home;
	$scope.set=function(v){
		
		$scope.val=v;
		//console.log(v+" "+$scope.val);
		//console.log()
	};
	$scope.isSet=function(v){
		
		return v===$scope.val;
	}
})*/
.controller('jobSearchCtrl', function($scope){
	//garbage datas
	$scope.results=
	[{title:"Project Title",protype:"Movie",position:2,status:"Pre-Production",postdate:"30th July",img:'images/mock/film.png'},
	{title:"Project Title",protype:"Movie",position:2,status:"Pre-Production",postdate:"30th July",img:'images/mock/film.png'},
	{title:"Project Title",protype:"Movie",position:2,status:"Pre-Production",postdate:"30th July",img:'images/mock/film.png'}
	
	];
	//$http.get('',data).success(function(data){parse data and render});
})
.controller('MyProjectCtrl', function($scope){
	//garbage datas
	$scope.myProject=
	[{title:"Project Title",uuid:'aosd1',protype:"Movie",position:2,status:"Pre-Production",postdate:"30th July",img:'images/mock/film.png'},
	{title:"Project Title",uuid:'aosd1',protype:"Movie",position:2,status:"Pre-Production",postdate:"30th July",img:'images/mock/film.png'}	
	];
	//$http.get('',data).success(function(data){parse data and render});

	$scope.saf=false;

	$scope.showAddForm=function(){  $scope.saf=!$scope.saf; };
	$scope.toShowAddForm=function(){alert($scope.saf); return $scope.saf;}

})
.controller('contentCtrl', function($scope,$rootScope){
	/*for submenu menu selection*/
	$rootScope.subMenus=$rootScope.subMenus;
	$scope.a=0;
	$scope.isSMSet=function(v){
		//console.log(v+" "+$scope.a);
		return $scope.a===v;
	};
	$scope.setSM=function(v){
		console.log( $scope.a+ " "+v);
		$scope.a=v;
		
	};
	/**/
})
.controller('addProjectCtrl', function($scope){
	// for selection of projects 1st pull from datas
	$scope.projects={};
	/*$scope.projectID=$scope.projectid;*/
	$scope.projects=[{uuid:'',title:'Select a project'},{uuid:'xyzas',title:'Project X-Men'}];

})
.controller('ProjectHeaderCtrl', function($scope){
	//fetch header datas from server
	$scope.header={};
	$scope.header={title:'Project X-Men',logo:'images/mock/film.png'};
})
.controller('projectContentCtrl', function($scope){
	//for project menu bar
	$scope.v=2;
	$scope.isSet=function(v){
		return v==$scope.v;
	};
	$scope.set=function(v){
		$scope.v=v;
	}
//for project content controller	
})
.controller('AboutProject', function($scope){
	$scope.about="";
	$scope.about="To be fetched from server .....Blah Blah BlahBlah Blah BlahBlah Blah BlahBlah Blah BlahBlah Blah BlahBlah Blah Blah.....";
})
.controller('GroupUpdateCtrl', function($scope){
	$scope.feeds={};
	$scope.feeds=[{data:"Just a garbage update."}];
	$scope.resetfeeds=function(){$scope.feeds={};};
})
.controller('ProjectSideBarCtrl', function($scope){
	$scope.data={};
	$scope.data={lastActive:"30th March '15", location:"Bengaluru", roles:[{name:"cameraman"},{name:"hero"}],members:[{name:"Abhijit Pegu",ppic:"images/mock/film.png",about:"I am a Business Analyst by day and Music Director by night."}]}
})
.controller('userContentCtrl', function($scope){
	//for project menu bar
	$scope.v=1;
	$scope.isSet=function(v){
		return v==$scope.v;
	};
	$scope.set=function(v){
		$scope.v=v;
	}
//for project content controller	
})
.controller('msgCtrl', function($scope){
	$scope.header="New Message";
	$scope.v=1;
	$scope.set=function(v){
		$scope.v=v;
		if (v==1) {$scope.header="New Message"}
		else if (v==2) {$scope.header="All Message"}	
		else if (v==3) {$scope.header="Unread Message"}	
		else if (v==4) {$scope.header="Sent"}		
	}
	$scope.isSet=function(v){
		return $scope.v===v;
	}
	$scope.allmessages={};
	$scope.allmessages=[{msg:"Message 1"},{msg:"Message 2"},{msg:"Message 3"}];
})
.controller('pplCtrl', function($scope){
	/* TO set connection type either existiting or new*/
	$scope.ct=1;
	$scope.isCTSet=function(ct){
		return $scope.ct==ct;
	};
	$scope.setCT=function(ct){
		$scope.ct=ct;
	}
/*Filter toggle button*/
	$scope.toShowFilters=false;
	$scope.showFilters=function(bool){
		$scope.toShowFilters=!$scope.toShowFilters;
	}

/* Filter menus*/
	$scope.categories=["On Stage","Behind the Stage","Stage Authorities", "Releasing the stage","Music Stage","Stage Vendor"];
	$scope.types=[
				["Actor","Actress","Comedian","Supporting Actor","Supporting Actress","Models","Child Artists","Aged Characters"],
["Directors",
"Associate Directors",
"Art Director",
"Cinematographers",
"Lyricists",
"Choreographers",
"Dancers",
"Fighters",
"Production Executives",
"Make-up Artists",
"Hair Stylists",
"Costume Designers",
"Advertisment Designers",
"Still Photographers",
"Vehicle Drivers",
"Production Assistants",
"Journalists",
"Photo Journalists",
"Stunt Directors and Masters",
"Story, Screenplay & Dialogue Writers"
],
["Shooting Permission",
"Film Chamber/ Title Registration",
"Censor Board",
"Producers Association",
"Directors Association",
"others"
],
[
"Publicity Designers/ PRO",
"Distributors",
"Audio Companies",
"Online Promotions",
"Railway Marketing",
"Event Management",
"Audio Releasing Premises",
"BMTC/KSRTC Bus Marketing",
"FM Marketing/ Jingles",
"Advertising Agencies/ Paper Ads",
"Local Cable Marketing",
"Preview Theatres"
],
[
"Music Directors",
"Playback Singers",
"Track Singers",
"Instrumentalists",
"Music Programmers",
"Dubbing Facilities",
"Recording Studios",
"DTS Studios",
"Mixing and Mastering Team",
"Dubbing Artist",
"Sound Engineers"
],
[
"Camera Vendors",
"Crane Vendors",
"Steady/Helic Vendors",
"Computer Graphics",
"DI Steups",
"Editing Suites",
"Production Managers",
"Food Caterers",
"Union Vehicles",
"TV Studios",
"Shooting Locations",
"Outdoor Units",
"TV Channels",
"Cable Networks",
"Theatres",
"Units(Lights, Sounds, Genertaors) Suppliers",
"Acting and Training Institutes"
]

];	

	$scope.setCategory=function(i){
		if(i+1==$scope.category){return $scope.category=0;}
		$scope.category=i+1;
		$scope.type=0;
	};
	$scope.isCategory=function(i){
		return $scope.category===i+1;
	};
	$scope.setType=function(i){
		$scope.type=i+1;
	}
	$scope.isType=function(i){
		return $scope.type===i+1;
	}


/*pull people list*/
	$scope.peoples={};
	$scope.peoples=[{name:'Mr. Bengali', language:"Bengali" , location:"Kolkata", role:"Actor", profilepic:"http://img3.rnkr-static.com/user_node_img/651/13013118/870/tori-black-people-in-film-photo-u16.jpg"},
	{name:'Mr. Bengali', language:"Bengali" , location:"Kolkata", role:"Actor", profilepic:"http://img3.rnkr-static.com/user_node_img/651/13013118/870/tori-black-people-in-film-photo-u16.jpg"},
	{name:'Mr. Bengali', language:"Bengali" , location:"Kolkata", role:"Actor", profilepic:"http://img3.rnkr-static.com/user_node_img/651/13013118/870/tori-black-people-in-film-photo-u16.jpg"}];




})
.controller('signUpCtrl', function($scope){
	$scope.data={};
	$scope.c=function(){
		/*alert($scope.data);*/
		console.log($scope.data);
		/* $http.post('url', $scope.data).success(function(data){

		});*/
	}
})
