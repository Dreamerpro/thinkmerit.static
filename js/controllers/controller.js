angular.module('thinkmerit')
.controller('ProfileCtrl', function ($http,AP) {
	var _self=this;
	this.init=function () {

		$http.get(AP+'/profile')
		.success(function (data) {
			_self.profiledata=data;
			console.log(data);
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
.controller('QuestionBank', function  ($http,AP,$sce, $scope, $location,$routeParams,StringMods,$rootScope, $cookies, CSRF_TOKEN) {
	var _self=this;
	this.datas={courses:[],subjects:[],chapters:[],modules:[],topics:[]};
	this.selected={};
	this.search=$location.search();
	this.pageNo=_self.search.pageNo?_self.search.pageNo:1;

	this.answer="";
	this.solution="";
	_self.questions=$rootScope.questions;

	_self.init=function () {
		/*$http.get(AP+'/get/courses')
		.success(function (data) {	_self.datas.courses=data;	})
		.error(function (argument) { console.log(argument);})*/
		if($routeParams.course){
					if(!_self.questions && !$routeParams.subject){
						//if question null and subject not selected => load all question from that course 
						$http.get(AP+'/get/questions/'+StringMods.removeUnderScore($routeParams.course)+"/"+_self.pageNo)
						.success(function (data) {_self.questions=data;	})
						.error(function (data) {console.log(data); })
					}

			$http.post(AP+'/get/subjects',{course:StringMods.removeUnderScore($routeParams.course), _token:CSRF_TOKEN})
			.success(function (data) {	
				_self.datas.subjects=data;	
				$rootScope.subjects=data;
				for (var i = data.length - 1; i >= 0; i--) {
					if(data[i].name===StringMods.removeUnderScore($routeParams.course)){
						_self.selected.course=data[i];
					}
				}

					
					/*if($routeParams.subject && !$routeParams.chapter){
						$http.get(AP+'/get/questions/'
							+StringMods.removeUnderScore($routeParams.course)+"/"
							+StringMods.removeUnderScore($routeParams.subject)+"/"
							+_self.pageNo)
						.success(function (data) { _self.questions=data;})
						.error(function (data) { console.log(data);	})
					}*/
				
				if($routeParams.subject){//select subject if in routeParam
					for (var i = _self.datas.subjects.length - 1; i >= 0; i--) {
						if(_self.datas.subjects[i].name===StringMods.removeUnderScore($routeParams.subject)){
							_self.selected.subject=_self.datas.subjects[i];
							console.log(_self.selected.subject);
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
											$http.post(AP+'/get/question/'+$routeParams.questionid,{
												course:StringMods.removeUnderScore($routeParams.course),
												subject:StringMods.removeUnderScore($routeParams.subject),
												chapter:StringMods.removeUnderScore($routeParams.chapter),
												topic:StringMods.removeUnderScore($routeParams.topic)
											})
											.success(function (data) {	
												//console.log(data);
												_self.question=data;
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

	this.prev=function () {
		if(_self.questions.previousPage){
			$location.search({pageNo:_self.questions.previousPage});
		}
	}
	this.next=function () {
		if(_self.questions.nextPage){
			$location.search({pageNo:_self.questions.nextPage});
		}
	}
	/*this.shareUrl=function (qid) {
		return $location.path();
	}*/
	this.share=function (qid) {
		var path="/question-bank/";
				path+=$routeParams.course?$routeParams.course+"/":"";
				path+=$routeParams.subject?$routeParams.subject+"/":"";
				path+=$routeParams.chapter?$routeParams.chapter+"/":"";
				path+=$routeParams.topic?$routeParams.topic+"/":"";
				path+=qid;
		return path;
		//$location.path(path);
	}
	
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
	this.showanswer=function (id) {

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
			//swal().close();
			if(!canceled){
				swal.close();
				$('#answer-modal').modal({show:true});
			}
		})
		.error(function (argument) {
			swal({   title: "Error!",   text: "There was an error loading answer.",   timer: 2000,   showConfirmButton: false });
		})
			
	}
	this.showsolution=function (id) {
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

			if(!canceled){
				swal.close();
				$('#solution-modal').modal({show:true});
			}
			
		})
		.error(function (argument) {
			swal({   title: "Error!",   text: "There was an error loading solution.",   timer: 2000,   showConfirmButton: false });
		})

	}
	this.showvideo=function (video) {
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
		/*$http.get(AP+'/video/'+id)
		.success(function (data) {
			_self.question_video=data.url;
			if(!canceled){
				swal.close();
				$('#question-video-modal').modal({show:true});
			}
			$('#question-video-modal').modal({show:true});
		})*/
		$('#question-video-modal').modal({show:true});
	}

	this.showinfo=function (id) {
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
			
			if(!canceled){
				swal.close();
				$('#question-info-modal').modal({show:true});
			}

		})
		.error(function (argument) {
			swal({   title: "Error!",   text: "There was an error loading question information.",   timer: 2000,   showConfirmButton: false });
		})
	}

	this.togglefavourite=function (question,list) {
		$http.get(AP+'/dfs/toggleitem/'+question.id+'/1')
		.success(function (data) {
			if(list){$item=_self.questions.questions[_self.questions.questions.indexOf(question)];$item.favourite=!$item.favourite;}
			else{_self.question.favourite=!_self.question.favourite;}	
		})
		.error(function (data) {
			console.log('error');
		})
	}
	this.toggledoubt=function (question,list) {
		$http.get(AP+'/dfs/toggleitem/'+question.id+'/2')
		.success(function (data) {
			if(list){ $item=_self.questions.questions[_self.questions.questions.indexOf(question)]; $item.doubt=!$item.doubt;}
			else{_self.question.doubt=!_self.question.doubt;}
		})
		.error(function (data) {
			console.log('error');
		})
	}
	this.togglesolved=function (question,list) {
		$http.get(AP+'/dfs/toggleitem/'+question.id+'/3')
		.success(function (data) {
			if(list){ $item=_self.questions.questions[_self.questions.questions.indexOf(question)]; $item.solved=!$item.solved;}
			else{_self.question.solved=!_self.question.solved;}
		})
		.error(function (data) {
			console.log('error');
		})
	}

	

	this.trust_html=function (html_code) {
		return $sce.trustAsHtml(html_code);
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
/*.controller('QuestionBank', function  ($http,AP,$sce, $scope, $location) {
	var _self=this;
	this.datas={courses:[],subjects:[],chapters:[],modules:[],topics:[]};
	this.selected={};
	this.search=$location.search();
	this.range={start:0,end:10};

	this.answer="";
	this.solution="";

	_self.init=function () {
		$http.get(AP+'/get/courses')
		.success(function (data) {	_self.datas.courses=data;	})
		.error(function (argument) { console.log(argument);})		
	};
	this.selectcourse=function (course) {
		_self.selected.course=course;
		_self.selected.chapter=null;//clear selected subject
		_self.datas.subjects=[];
		_self.selected.subject=null;
		
		$http.get(AP+'/get/subjects/'+course.id)
		.success(function (data) {	_self.datas.subjects=data;	})
		.error(function (argument) { console.log(argument);})
	}
	this.selectsubject=function (subject) {
		_self.selected.subject=subject;
		_self.datas.chapters=[];
		
		_self.selected.chapter=null;//clear selected chapter

		$http.get(AP+'/get/getchaptersfromsubject/'+subject.id)
		.success(function (data) {	_self.datas.chapters=data;	})
		.error(function (argument) { console.log(argument);})
	}
	this.selectchapter=function (chapter) {
		_self.selected.chapter=chapter;
		_self.selected.topics=[];
		
		$http.get(AP+'/get/topics/'+chapter.id)
		.success(function (data) {	_self.datas.topics=data;	})
		.error(function (argument) { console.log(argument);})
	}

	this.selecttopic=function (topic) {
		_self.selected.topic=topic;
		_self.questions=[];
		_self.loadquestions();
	}
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
	this.showanswer=function (id) {
		$http.get(AP+'/answer/'+id)
		.success(function (data) {
			_self.answer=data.answer;
		})
		.error(function (data) {
			console.log('error');
		})
	}
	this.togglefavourite=function (question) {
		$http.get(AP+'/dfs/toggleitem/'+question.id+'/1')
		.success(function (data) {
			$item=_self.questions[_self.questions.indexOf(question)];
			$item.favourite=!$item.favourite;
		})
		.error(function (data) {
			console.log('error');
		})
	}
	this.toggledoubt=function (question) {
		$http.get(AP+'/dfs/toggleitem/'+question.id+'/2')
		.success(function (data) {
			$item=_self.questions[_self.questions.indexOf(question)];
			$item.doubt=!$item.doubt;
		})
		.error(function (data) {
			console.log('error');
		})
	}
	this.togglesolved=function (question) {
		$http.get(AP+'/dfs/toggleitem/'+question.id+'/3')
		.success(function (data) {
			$item=_self.questions[_self.questions.indexOf(question)];
			$item.solved=!$item.solved;
		})
		.error(function (data) {
			console.log('error');
		})
	}

	this.showsolution=function (id) {
		$http.get(AP+'/solution/'+id)
		.success(function (data) {
			_self.solution=data.solution;
		})
		.error(function (data) {
			console.log('error');
		})

	}

	this.trust_html=function (html_code) {
		return $sce.trustAsHtml(html_code);
	}
	

})*/
.controller('NotesCtrl', function ($http,AP,$sce, $scope, $location, $rootScope,$routeParams,StringMods) {
	var _self=this;
	this.datas={courses:false,subjects:false,chapters:false,modules:false,topics:false};
	this.selected={};
	this.search=$routeParams;
	this.current={
		course:$routeParams.course,
		subject:$routeParams.subject,
		chapter:$routeParams.chapter,
		ncourse:StringMods.removeUnderScore($routeParams.course),
		nsubject:StringMods.removeUnderScore($routeParams.subject),
		nchapter:StringMods.removeUnderScore($routeParams.chapter)
	}
	
	_self.init=function () {
		if($routeParams.course){
			$http.post(AP+'/get/subjects',{course:StringMods.removeUnderScore($routeParams.course)})
			.success(function (data) {	
				_self.datas.subjects=data;	
				$rootScope.subjects=data;
			})
			.error(function (argument) { console.log(argument);})
		}
		if($routeParams.subject){
			$http.post(AP+'/get/chapters',{
				course:StringMods.removeUnderScore($routeParams.course),
				subject:StringMods.removeUnderScore($routeParams.subject)
			})
			.success(function (data) {	
				_self.datas.chapters=data;	
				$rootScope.chapters=data;
			})
			.error(function (argument) { console.log(argument);})
		}
		if($routeParams.chapter){
			$http.post(AP+'/get/notes',{
				course:StringMods.removeUnderScore($routeParams.course),
				subject:StringMods.removeUnderScore($routeParams.subject),
				chapter:StringMods.removeUnderScore($routeParams.chapter)
			})
			.success(function (url) {	
				$http.get(AP+"/"+url)
				.success(function (notes) {
					_self.notes=$sce.trustAsHtml(notes);	

				})
				.error(function (argument) {
					_self.notes=$sce.trustAsHtml("<h4 class=\"text-danger\">Error loading notes!</h4>");
				})
				
			})
			.error(function (argument) { console.log(argument);})
		}


	};
	this.selectcourse=function (course) {
		_self.selected.course=course;
		_self.selected.chapter=null;//clear selected subject
		_self.selected.subject=null;
		_self.datas.subjects=[];
		
		
		/*$http.get(AP+'/get/subjects/'+course.id)
		.success(function (data) {	_self.datas.subjects=data;	})
		.error(function (argument) { console.log(argument);})*/

		$location.search({course:_self.selected.course.name});
	}
	/*this.selectsubject=function (subject) {
		_self.selected.subject=subject;
		_self.datas.chapters=[];
		_self.selected.notes='';	
		_self.selected.chapter=null;//clear selected chapter

		$http.get(AP+'/get/getchaptersfromsubject/'+subject.id)
		.success(function (data) {	_self.datas.chapters=data;	})
		.error(function (argument) { console.log(argument);})
	}
	this.selectchapter=function (chapter) {
		_self.selected.chapter=chapter;
		_self.selected.notes="";
		$http.get(AP+'/notes/'+chapter.id+'/index.html')
		.success(function (data) {_self.selected.notes=$sce.trustAsHtml(data);	})
		.error(function (argument) {_self.selected.notes='<h3>Error loading notes!</h3>'; console.log(argument);})
	}*/
	this.togglebookmark=function () {
		$http.get(AP+'/toggle/bookmark/'+_self.selected.chapter.id)
		.success(function (data) {	_self.selected.chapter.bookmark=!_self.selected.chapter.bookmark;	})
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
			if(type=="sticky"){_self.stickies.splice(_self.stickies.indexOf(item),1);}
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
				if(type=="sticky"){_self.stickies.push(data);}
				else if(type=="todo"){_self.todos.push(data);}	
			}
			else if(_self.savemode==="update"){
				if(type=="sticky"){_self.stickies[index]=data;}
				else if(type=="todo"){_self.todos[index]=data;}	
			}
			
			_self.current={};		
		})
		.error(function (argument) {console.log(argument);	})

		return $prom;
	}
		
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

	this.deletebookmark=function (bookmark) {
		$http.get(AP+'/toggle/bookmark/'+bookmark.id)
		.success(function (data) {	 _self.wdatas.bookmarks.splice(_self.wdatas.bookmarks.indexOf(bookmark));	})
		.error(function (argument) { console.log(argument);})
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
				that.signflash=argument.msg;
			})
		}
	}
	
}])
.controller("LineCtrl", function ($scope) {

  $scope.labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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

