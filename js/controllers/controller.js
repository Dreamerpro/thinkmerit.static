angular.module('thinkmerit')
.controller('TestController',function ($http, AP, $routeParams, $scope) {
	var _self=this;
	_self.questionnumber=0;
	this.init=function() {
		if(!_self.activetests){
			$http.get(AP+'/getactivetests')
			.success(function(d) {
				console.log(d);
				_self.activetests=d;
			})
			.error(function(e) {
				console.log(e);
			})
		}
	}
	this.fetchtest=function() {
		$http.get(AP+'/gettest/'+$routeParams.id)
		.success(function(d) {
			console.log(d);
			_self.test=d;
		})
		.error(function(e) {
			console.log(e);
		})
		console.log("here");
	}
	$scope.$watch(function() { return _self.questionnumber;}, function(newval, oldval) { _self.generateMarker(newval);});
	this.generateMarker=function(j) {
		var k=j;
		_self.attempmarker=[];
		while (k>0) {
			_self.attempmarker.push({status:0});
			k--;
		}

	}

	this.getQIndex=function(qi, si, pi) {
		var index=qi+1;
		//console.log(qi, si, pi, _self.test);

		//get questions in current part and section

		//while(_self.test.parts[pi]===undefined){ pi--; }
		//console.log(pi, si, qi, _self.test.parts, _self.test.parts[pi]);

		var sections=_self.test.parts[pi].sections;
		for (var i = 0; i < si; i++) {
			console.log(si, sections[i].questions.length, index);
			index+=sections[i].questions.length;
			console.log(index);
		}


		pi--;
		//if(pi==0){return qi+index+1;}//in case part index 0 then return
//get questions in preceeding parts and sections
		while(pi>=0){//in case part index not 0
					var sections=_self.test.parts[pi].sections;
					for (var i = 0; i < sections.length; i++) { 	index+=sections[i].questions.length+1; }
			pi--;
		}
		return index;
	}

})
.controller('GlobleSearchCtrl', function($scope, $http, $location, AP) {
	var _self=this;
	this.keyword="";
	this.timerforping=null;
	this.untouched=true;
	this.view=function(item) {
		console.log(item);
		if(item.thumbnails){
			$location.path('/video-lectures');
			$location.search(item);
		}
		$("#search-modal").modal('hide');
	}
	this.search=function(newval) {

		if(_self.timerforping){clearTimeout(_self.timerforping);}
		_self.timerforping=setTimeout(function () {
			_self.untouched=false;
			$http.get(AP+'/admin/video-lectures/'+newval)
			.success(function(data) {
				_self.results=data;
			}).error(function(reason) {

			});
		}, 500);
	}
	$scope.$watch(function() { return _self.keyword; }, function(newval,oldval) {
		console.log(newval, oldval);
		if(newval!=oldval){
			_self.results=null;
		}
		if(newval.length>3){//do search
			_self.search(newval);
		}
		else {
			//wait for more keywords
		}
	})

})
.controller('VideoLectureCtrl', function ($http,AP, $location) {
	var _self=this;

	this.init=function () {
		$http.get(AP+'/admin/video-lectures')
		.success(function(data) {
			console.log(data);
			_self.ids=data;
		})
		if($location.search().id){_self.showvideo=$location.search();}

	}

	this.get=function(item) {
		_self.showvideo=item;
	//	$location.search({'id':item.id});
	}
	this.next=function() {
		if(!_self.ids.nextPageToken){return false;}
		$http.get(AP+'/admin/video-lectures/next/'+_self.ids.nextPageToken)
		.success(function(data) {
			console.log(data);
			_self.ids=data;
		})
	}
	this.prev=function() {
		if(!_self.ids.prevPageToken){return false;}
		$http.get(AP+'/admin/video-lectures/prev/'+_self.ids.prevPageToken)
		.success(function(data) {
			console.log(data);
			_self.ids=data;
		})
	}
})
.controller('ContactCtrl', function ($http, AP) {
	var _self=this;
	_self.data={};
	_self.status=1;
	_self.sendmsg=function () {
		_self.status=2;
		$http.post(AP+"/contact", _self.data)
		.success(function (data) {
			_self.status=3;
			_self.data={};
			_self.message="Your message has been sent successfully.";
		})
		.error(function (data) {
			_self.status=3;
			_self.message="There was an error sending your message.";
		})
	}
})
.controller('SideBarCtrl', function (ScreenManager) {
	this.collapseifsmall=function () {
		ScreenManager.work();
	}
})
.controller('ProfileCtrl', function ($http,AP) {
	var _self=this;
	this.init=function () {

		$http.get(AP+'/profile')
		.success(function (data) {
			_self.profiledata=data;
		})
		.error(function (argument) {
			console.log(argument);
		})
	}
	this.submit=function () {
		$http.post(AP+'/saveprofile',_self.profiledata)
		.success(function () {
			_self.flash="Successfully saved the data!";
		})
		.error(function () {
			_self.flash="Error saving the data!";
		})
	}

	this.newPass=function () {
		if(_self.newpass!==_self.cfmpass){return false;}
		$http.post(AP+'/changepass',{old:_self.oldpass,new:_self.newpass,cfm:_self.cfmpass})
		.success(function () {
			_self.flash="Successfully saved the password!";
			_self.newpass="";
			_self.cfmpass="";
			_self.oldpass="";
		})
		.error(function (msg) {
			_self.flash=msg;
		})
	}

})
.controller('QuestionBank', function  ($http,AP,$sce, $scope, $location,$routeParams,StringMods,$rootScope, $cookies, QuestionListService) {
	var _self=this;
	this.datas={courses:[],subjects:[],chapters:[],modules:[],topics:[]};
	this.selected={};
	this.search=$location.search();
	this.pageNo=_self.search.pageNo?_self.search.pageNo:1;

	this.answer="";
	this.solution="";
	_self.questions={previousPage:false,nextPage:false,questions:false};

	_self.init=function () {

		if($routeParams.course){
					if(!_self.questions.questions && !$routeParams.subject){
						//if question null and subject not selected => load all question from that course
						$http.get(AP+'/get/questions/'+StringMods.removeUnderScore($routeParams.course)+"/"+_self.pageNo)
						.success(function (data) {_self.questions=data;	})
						.error(function (data) {console.log(data); })
					}

			$http.post(AP+'/get/subjects',{course:StringMods.removeUnderScore($routeParams.course)})
			.success(function (data) {
				_self.datas.subjects=data;
				$rootScope.subjects=data;
				for (var i = data.length - 1; i >= 0; i--) {
					if(data[i].name===StringMods.removeUnderScore($routeParams.course)){
						_self.selected.course=data[i];
					}
				}


				if($routeParams.subject){//select subject if in routeParam
					for (var i = _self.datas.subjects.length - 1; i >= 0; i--) {
						if(_self.datas.subjects[i].name===StringMods.removeUnderScore($routeParams.subject)){
							_self.selected.subject=_self.datas.subjects[i];
						}
					}
					//if  subject  selected  && chapter notselected=> load all question from that subject
					if(!$routeParams.chapter){
						$http.get(AP+'/get/questions/'
							+StringMods.removeUnderScore($routeParams.course)+"/"
							+StringMods.removeUnderScore($routeParams.subject)+"/"
							+_self.pageNo)
						.success(function (data) { _self.questions=data;})
						.error(function (data) { console.log(data);	})
					}


					//get chapters
					$http.post(AP+'/get/chapters',{
						course:StringMods.removeUnderScore($routeParams.course),
						subject:StringMods.removeUnderScore($routeParams.subject)
					})
					.success(function (data) {
						_self.datas.chapters=data;
						$rootScope.chapters=data;

						if($routeParams.chapter){// chapter is queried
							//select chapter if there
							for (var i = _self.datas.chapters.length - 1; i >= 0; i--) { //set the selected chapter
								console.log(_self.datas.chapters[i]);
								if(_self.datas.chapters[i].name===StringMods.removeUnderScore($routeParams.chapter)){
									_self.selected.chapter=_self.datas.chapters[i];
									console.log(_self.selected.chapter);
								}
							}
							//if  subject  selected  && chapter selected but not topic=> load all question from that chapter
							if(/*$routeParams.subject && $routeParams.chapter && */!$routeParams.topic){
								$http.get(AP+'/get/questions/'
									+StringMods.removeUnderScore($routeParams.course)+"/"
									+StringMods.removeUnderScore($routeParams.subject)+"/"
									+StringMods.removeUnderScore($routeParams.chapter)+"/"
									+_self.pageNo)
								.success(function (data) { _self.questions=data;})
								.error(function (data) {console.log(data);})
							}

							$http.post(AP+'/get/topics',{
								course:StringMods.removeUnderScore($routeParams.course),
								subject:StringMods.removeUnderScore($routeParams.subject),
								chapter:StringMods.removeUnderScore($routeParams.chapter)
							})
							.success(function (data) {
								_self.datas.topics=data;

								if($routeParams.topic){
									for (var i = _self.datas.topics.length - 1; i >= 0; i--) { //set the selected chapter
										console.log(_self.datas.topics[i]);
										if(_self.datas.topics[i].name===StringMods.removeUnderScore($routeParams.topic)){
											_self.selected.topic=_self.datas.topics[i];
										}
										if(!$routeParams.questionid){
											/*$http.post(AP+'/get/questions',{
												course:StringMods.removeUnderScore($routeParams.course),
												subject:StringMods.removeUnderScore($routeParams.subject),
												chapter:StringMods.removeUnderScore($routeParams.chapter),
												topic:StringMods.removeUnderScore($routeParams.topic)
											})*/
											$http.get(AP+'/get/questions/'
												+StringMods.removeUnderScore($routeParams.course)+"/"
												+StringMods.removeUnderScore($routeParams.subject)+"/"
												+StringMods.removeUnderScore($routeParams.chapter)+"/"
												+StringMods.removeUnderScore($routeParams.topic)+"/"
												+_self.pageNo)
											.success(function (data) { _self.questions=data; _self.question=null;})
											.error(function (data) {console.log(data);})
										}
										else{
											$http.get(AP+'/get/question/'+$routeParams.questionid,{
												course:StringMods.removeUnderScore($routeParams.course),
												subject:StringMods.removeUnderScore($routeParams.subject),
												chapter:StringMods.removeUnderScore($routeParams.chapter),
												topic:StringMods.removeUnderScore($routeParams.topic)
											})
											.success(function (data) {
												_self.question=data;
												_self.questions=null;
											})
										}
									}
								}

							})
							.error(function (argument) { console.log(argument);})
						}
					})
					.error(function (argument) { console.log(argument);})
				}
			})
			.error(function (argument) { console.log(argument);})
		}
	}

	this.prev=function(){QuestionListService.prev(this)};
	this.next=function(){QuestionListService.next(this)};


	this.share=function (qid,type) {QuestionListService.share(_self,qid,type);}
	this.showShareDialog=function (qid) {
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
			$http.get(AP+'/question-share-url/'+qid)
			.success(function (data) {
				_self.qshareurl=StringMods.addUnderScore(data);
				if(!canceled){	swal.close();$('#question-share').modal({show:true});	}
			})
			.error(function (argument) { swal({ title: "Error!",   text: "There was an error fetching question share link.",   timer: 2000,   showConfirmButton: false });	})

	}

	this.showanswer=function (q) {	QuestionListService.showanswer(_self,q); }
	this.showsolution=function (q) { QuestionListService.showsolution(_self,q);	}
	this.showvideo=function (video) { QuestionListService.showvideo(video); }

	this.showinfo=function (id) { QuestionListService.showinfo(_self,id); }
	this.togglefavourite=function (question,list) { QuestionListService.togglefavourite(_self,question,list)	}
	this.toggledoubt=function (question,list) { QuestionListService.toggledoubt(_self,question,list);  }
	this.togglesolved=function (question,list) { QuestionListService.togglesolved(_self,question,list); }


	this.loadquestions=function () {
		$http.get(AP+'/questions/'+_self.selected.topic.id+"/"+_self.range.start+"/"+_self.range.end)
		.success(function (data) {
			_self.questions=data;
			console.log(data);
		})
		.success(function (data) {
			console.log("error");
		})
	}


	this.redirectToSubject=function (val) {
			var path="/question-bank/";
				path+=$routeParams.course?$routeParams.course+"/":"";

				path+=StringMods.addUnderScore(val);
				$location.path(path);
	}
	this.redirectToChapter=function (val) {

			var path="/question-bank/";
				path+=$routeParams.course?$routeParams.course+"/":"";
				path+=$routeParams.subject?$routeParams.subject+"/":"";

				path+=StringMods.addUnderScore(val);
				$location.path(path);
	}
	this.redirectToTopic=function (val) {

			var path="/question-bank/";
				path+=$routeParams.course?$routeParams.course+"/":"";
				path+=$routeParams.subject?$routeParams.subject+"/":"";
				path+=$routeParams.chapter?$routeParams.chapter+"/":"";
				path+=StringMods.addUnderScore(val);
				$location.path(path);
	}

})

.controller('NotesCtrl', function ($http,AP,$sce, $scope, $location, $rootScope,$routeParams,StringMods, $timeout) {
	var _self=this;
	this.datas={courses:false,subjects:false,chapters:false,modules:false,topics:false};
	this.selected={};
	this.search=$routeParams;
	this.currentData={
		course:$routeParams.course,
		subject:$routeParams.subject,
		chapter:$routeParams.chapter,
		ncourse:StringMods.removeUnderScore($routeParams.course),
		nsubject:StringMods.removeUnderScore($routeParams.subject),
		nchapter:StringMods.removeUnderScore($routeParams.chapter)
	}
	this.notesload=false;
	_self.wdatas={todos:[],bookmarks:[],stickies:[]};

	_self.init=function () {
		if($routeParams.course){
			$http.post(AP+'/get/subjects',{course:StringMods.removeUnderScore($routeParams.course)})
			.success(function (data) {				_self.datas.subjects=data;			})
			.error(function (argument) { console.log(argument);})
		}
		if($routeParams.subject){
			$http.post(AP+'/get/chapters/notes/withccp',{
				course:StringMods.removeUnderScore($routeParams.course),
				subject:StringMods.removeUnderScore($routeParams.subject)
			})
			.success(function (data) {
				_self.datas.modules=data;
				if($routeParams.chapter){

					for (var i = data.length - 1; i >= 0; i--) {
						for (var j = data[i].chapters.length - 1; j >= 0; j--) {
							/*data[i].chapters*/
							if(data[i].chapters[j].name==StringMods.removeUnderScore($routeParams.chapter)){
							_self.selected.chapter=data[i].chapters[j];
						}
					};
				}
				}

			})
			.error(function (argument) { console.log(argument);})


		}
		if($routeParams.chapter){

			this.notesload=false;
			this.hideloader=false;
			$http.post(AP+'/get/noteswithchaptercc',{
				course:StringMods.removeUnderScore($routeParams.course),
				subject:StringMods.removeUnderScore($routeParams.subject),
				chapter:StringMods.removeUnderScore($routeParams.chapter)
			})
			.success(function (data) {
				_self.initslider();//progress slider

				_self.url=AP+""+data.url;
				_self.slider.value=data.cc?data.cc.completed+"%":"0%";
				_self.refreshrzslider();
				console.log(_self.slider);
				$http.get(AP+""+data.url)
				.success(function (notes) {
					_self.notes=notes;
					this.notesload=true;
					_self.hideloader=true;
				})
				.error(function (argument) {
					_self.notesload=false;
					_self.hideloader=true;
					_self.msg=$sce.trustAsHtml("<h4 class=\"text-danger\">Error loading notes!</h4>");
				})
				// .done(function () {			})
			})
			.error(function (argument) { console.log(argument);})
		}

	};
	this.refreshrzslider=function() {
		$timeout(function () {
			 $scope.$broadcast('rzSliderForceRender');
	 	},200);

			console.log("asda");
	}
	this.showchapter=function (index, parentindex, lim) {

		/*console.log(index,parentindex, _self.datas.modules[parentindex].chapters[index].name, _self.getTotalChapters(parentindex)+index);
		console.log(" ");*/
		if(lim==15){
			return _self.getTotalChapters(parentindex)+index<15;
		}
		else if(lim==30){
			return _self.getTotalChapters(parentindex)+index>14 && _self.getTotalChapters(parentindex)+index<30;
		}
		else if(lim==29){
			return _self.getTotalChapters(parentindex)+index>29;
		}
	}
	this.showchapternumber=function (index, parentindex, lim) {
		return _self.getTotalChapters(parentindex)+index;
	}
	this.showChaptername=function (index, lim) {
		if(lim==15){
			return _self.getTotalChapters(index)+1<=15;
		}
		else if(lim==30){
			var temp=_self.getTotalChapters(index);/*+_self.datas.modules[index].chapters.length*/
			if(temp+1<=15){return false;}
			else{
				return temp+1<=30;
			}

		}
		else if(lim==29){
			return _self.getTotalChapters(index)+1>30;
		}
	}
	this.totalchapters=function  () { return _self.getTotalChapters(_self.datas.modules.length);}

	this.initslider=function() {
		// console.log(_self.selected.chapter);
		_self.slider = {
								  value: "0%",
								  options: {
										id: 'slider-id',
								    showTicksValues: true,
										showSelectionBar: true,
								    stepsArray: [
								      {value: '0%', legend: 'Very poor'},
								      {value: '25%', legend: 'Fair'},
								      {value: '50%', legend: 'Average'},
								      {value: '75%', legend: 'Good'},
								      {value: '100%', legend: 'Excellent'}
								    ],
										getSelectionBarColor: function(value) {
												 if (value =="25%")
														 return 'red';
												 if (value =="50%")
		 												return 'orange';
												 if (value =="75%")
														 return 'green';
												 if (value =="100%")
														 return 'darkgreen';
												 return '#2AE02A';
										 },
										onChange: function(id) {
					            //console.log('on change ' + id); // logs 'on change slider-id'
											_self.saveProgress();
					        	}
								  }
								};
	}
	this.saveProgress=function() {
		console.log('on change ' + _self.slider.value.substring(0,_self.slider.value.length-1), _self.selected.chapter); // logs 'on change slider-id'
		if(_self.sp){clearTimeout(_self.sp);}
		_self.sp=setTimeout(function() {
			$http.get(AP+'/saveprogress/'+_self.selected.chapter.id+"/"+_self.slider.value.substring(0,_self.slider.value.length-1))
			.success(function() {		console.log('progress saved.');	})
			.error(function() {		console.log('progress save error.');	})
		},1000);
	}
	this.getTotalChapters=function (index) {
		var res=0;
		for (var i = 0; i < index; i++) {
			if(_self.datas.modules[i]){
				res+=_self.datas.modules[i].chapters.length;
			}
		};
		return res;
	}
	this.getStickies=function () {
			$http.get(AP+'/user/get/stickies')
			.success(function (data) {
				_self.wdatas.stickies=data;
				$("#modal-sticky").modal({show:true});
			})
			.error(function (argument) {console.log(argument);_self.wdatas.stickies=[];	})

			$http.get(AP+'/user/get/bookmarks')
			.success(function (data) { _self.wdatas.bookmarks=data;	})
			.error(function (argument) {console.log(argument);	_self.wdatas.bookmarks=[];})
	}
	this.selectcourse=function (course) {
		_self.selected.course=course;
		_self.selected.chapter=null;//clear selected subject
		_self.selected.subject=null;
		_self.datas.subjects=[];


		$location.search({course:_self.selected.course.name});
	}

	this.togglebookmark=function () {
		$http.get(AP+'/toggle/bookmark/'+_self.selected.chapter.id)
		.success(function (data) {	_self.selected.chapter.bookmark[0]=!_self.selected.chapter.bookmark[0];	})
		.error(function (argument) { console.log(argument);})
	}
	this.togglereadmode=function (element) {

		var elem = document.getElementById("notes-container");

		if (!document.fullscreenElement &&  !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {

				if (elem.requestFullscreen) {
				  elem.requestFullscreen();
				} else if (elem.msRequestFullscreen) {
				  elem.msRequestFullscreen();
				} else if (elem.mozRequestFullScreen) {
				  elem.mozRequestFullScreen();
				} else if (elem.webkitRequestFullscreen) {
				  elem.webkitRequestFullscreen();
				}
				_self.isfs=true;
		}
		else{
			if (document.exitFullscreen) {
		      document.exitFullscreen();
		    } else if (document.msExitFullscreen) {
		      document.msExitFullscreen();
		    } else if (document.mozCancelFullScreen) {
		      document.mozCancelFullScreen();
		    } else if (document.webkitExitFullscreen) {
		      document.webkitExitFullscreen();
		    }
		    _self.isfs=false;
		}

	}
	this.redirectToSubject=function (val) {

	var path="/notes/";
			path+=$routeParams.course?$routeParams.course+"/":"";
			/*path+=$routeParams.subject?$routeParams.subject+"/":"";
			path+=$routeParams.chapter?$routeParams.chapter+"/":"";*/
			path+=StringMods.addUnderScore(val);
		$location.path(path);
	}
	this.showNotes=function (val) {
		var path="/notes/";
			path+=$routeParams.course?$routeParams.course+"/":"";
			path+=$routeParams.subject?$routeParams.subject+"/":"";
			/*path+=$routeParams.chapter?$routeParams.chapter+"/":"";*/
			path+=StringMods.addUnderScore(val);
		$location.path(path);
	}

	/*this.removeUnderScore=function (val) {
		if(val==undefined){return false;}
		return val.replace(/_/g,' ');
	}
	this.addUnderScore=function (val) {
		if(val==undefined){return false;}
		return val.replace(/ /g,'_');}
	*/
	this.escape=function ($event) {
		alert($event.which);
	}

	_self.deleteItem=function (item,type) {
		$http.post(AP+'/user/delete/'+type,{ids:[item.id]})
		.success(function (data) {
			if(type=="sticky"){_self.wdatas.stickies.splice(_self.wdatas.stickies.indexOf(item),1);}
			/*else if(type=="todo"){_self.wdatas.todos.splice(_self.wdatas.todos.indexOf(item),1);}*/
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
.controller('DashboardCtrl', function ($http,AP,$location,$routeParams, StringMods, QuestionListService) {
	var _self=this;
	_self.stats={};
	_self.wdatas={todos:[],bookmarks:[],stickies:[]};
	_self.params=$routeParams;
	_self.widgetdatas={};

//for question list
	this.search=$location.search();
	this.pageNo=_self.search.pageNo?_self.search.pageNo:1;

	this.answer="";
	this.solution="";
	_self.questions={previousPage:false,nextPage:false,questions:false};
	this.pageNo=$location.search().pageno?$location.search().pageno:1;
//for question list

	_self.init=function () {
		$http.get(AP+'/user/stats')
		.success(function (data) {	_self.stats=data; })
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

	_self.goToNotes=function (cid, event) {
		event.preventDefault();
		$http.get(AP+"/get/datafromchapterid/"+cid)
		.success(function  (argument) {
			$location.path("/"
				+StringMods.addUnderScore("notes")+"/"
				+StringMods.addUnderScore(argument.module.subject.course.name)+"/"
				+StringMods.addUnderScore(argument.module.subject.name)+"/"
				+StringMods.addUnderScore(argument.name)
				);	})
		.error(function (argument) {console.log(argument);})
	}

	_self.save=function (type,index) {
		if(!_self.currentItem.title){return false;}
		$fn=null;
		if(_self.savemode==="new"){$fn="/add/";}
		else if(_self.savemode==="update"){$fn="/user/update/";}
		else{ alert('invalid operation'); return false; }

		$prom= $http.post(AP+$fn+type,_self.currentItem);
		$prom.success(function (data) {
			if(_self.savemode==="new"){
				if(type=="sticky"){_self.wdatas.stickies.push(data);}
				else if(type=="todo"){_self.wdatas.todos.push(data);}
			}
			else if(_self.savemode==="update"){
				if(type=="sticky"){_self.wdatas.stickies[index]=data;}
				else if(type=="todo"){_self.wdatas.todos[index]=data;}
			}

			_self.currentItem={};
		})
		.error(function (argument) {console.log(argument);	})
		return $prom;
	}

	this.deletebookmark=function (bookmark, event) {
		event.preventDefault();
		$http.get(AP+'/toggle/bookmark/'+bookmark.id)
		.success(function (data) {	 _self.wdatas.bookmarks.splice(_self.wdatas.bookmarks.indexOf(bookmark),1);	})
		.error(function (argument) { console.log(argument);})
	}
	this.goTo=function (path) {
		$location.path('/dashboard/'+path);
	}
	this.loadwidgetDatas=function () {
		var prom;
		/*console.log(_self.params.item);*/
		if(_self.params.item=="favourites"){	prom=$http.get(AP+'/user/list/favourites/'+_self.pageNo); }
		else if(_self.params.item=="doubts"){prom=$http.get(AP+'/user/list/doubts/'+_self.pageNo);	}
		else if(_self.params.item=="solved"){prom=$http.get(AP+'/user/list/solveds/'+_self.pageNo);	}

		prom
		.success(function (argument) {
			/*if(_self.params.item=="favourites"){	*/_self.questions=argument;/* }
			else if(_self.params.item=="doubts"){ _self.questions=argument;}
			else if(_self.params.item=="solved"){ _self.questions=argument;	}*/
		})
		.error(function (argument) { console.log(argument);	})
	}
	this.prev=QuestionListService.prev(this);
	this.next=QuestionListService.next(this);


	this.share=function (qid,type) {QuestionListService.share(_self,qid,type);}


	this.showanswer=function (id) {	QuestionListService.showanswer(_self,id); }
	this.showsolution=function (id) { QuestionListService.showsolution(_self,id);	}
	this.showvideo=function (video) { QuestionListService.showvideo(video); }

	this.showinfo=function (id) { QuestionListService.showinfo(_self,id); }
	this.togglefavourite=function (question,list) { QuestionListService.togglefavourite(_self,question,list)	}
	this.toggledoubt=function (question,list) { QuestionListService.toggledoubt(_self,question,list);  }
	this.togglesolved=function (question,list) { QuestionListService.togglesolved(_self,question,list); }
	this.showShareDialog=function (qid) {
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
			$http.get(AP+'/question-share-url/'+qid)
			.success(function (data) {
				_self.qshareurl=StringMods.addUnderScore(data);
				if(!canceled){	swal.close();$('#question-share').modal({show:true});	}
			})
			.error(function (argument) { swal({ title: "Error!",   text: "There was an error fetching question share link.",   timer: 2000,   showConfirmButton: false });	})

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
		$prom=dc.save(t,index);
		if($prom){
			$prom.success(function  () {
					that.config.editmode=false;
					editform.$setPristine();
				})
				.error(function () {

				})
		}

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
.controller('AuthController', ['AuthService','$location','$rootScope',function(AuthService, $location,$rootScope,AP){
	var that=this;
	this.credentials={};
	this.login=function(){
		if(that.signin.$valid){
			that.credentials._token=AP;
			AuthService.login(that.credentials)
			.success(function(data){
				//$rootScope.user=data;
				$location.path('/dashboard');
			})
			.error(function (argument) {
				that.signflash=argument.msg;
			})
		}

	}
	this.register=function () {
		if(that.signup.$valid){
			that.credentials.password_confirmation=that.credentials.password;
			that.credentials._token=AP;
			AuthService.signup(that.credentials)
			.success(function(data){

			    AuthService.authuser()
			    .success(function (argument) { $location.path('/dashboard');  })
			    .error(function (argument) {   })

			})
			.error(function (argument) {
				that.signflash=argument.email;
			})
		}
	}

}])
.controller("LineCtrl", function ($scope , AP, $http) {

	$scope.labels=[];
	$scope.series=[];
	$scope.data=[];
	$http.get(AP+"/lastweek/stats")
	.success(function (data) {
		$scope.labels=data.days;
		$scope.series = data.series;
		$scope.data=data.datas;
	})
	.error(function (data) {
		console.log(data);
	})

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
})
