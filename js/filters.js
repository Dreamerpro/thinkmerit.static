angular.module('cultstage')
.filter('object_filter', function() {
	//var option={name:'D\'',types:[],locations:[]};
	
	return function(objects,option){
		var out=[];
		var z=true;
/*
TRUE==ADD
IF PEOPLE NAME CONTAINS QUERY => TRUE
IF AT LEAST 1 TYPE EXIST IN PEOPLE.TYPE or FILED => TRUE
*/

		for (var i = objects.length - 1; i >= 0; i--) {
			var object=objects[i];
			
			if(option.name==undefined || option.name==""){/*DO NOTHING*/}
			else{if(object.name.indexOf(option.name)<0) continue;}

			if(option.types==undefined){/*DO NOTHING*/}
			else{
				if(option.types.length==0){}
				else{
					
					for (var j = 0; j <object.types.length; j++) {
						for (var k = 0; k <option.types.length; k++) {
							if(object.types[j].indexOf(option.types[k])>-1){ j=object.types.length; break;	}
							else if(j==object.types.length-1 && k==option.types.length-1){ z=false;}
						}		
					}
				}
			}
			if(z){
				if(option.locations==undefined){/*DO NOTHING*/}
				else{
					if(option.locations.length==0){}
					else{
						for (var j = 0; j <object.locations.length; j++) {
							for (var k = 0; k <option.locations.length; k++) {
								if(object.locations[j].indexOf(option.locations[k])>-1){ j=object.locations.length; break;	}
								else if(j==object.locations.length-1 && k==option.locations.length-1){ z=false;}
							}		
						}
					}
				}	
			}

			if(z){
				if(option.languages==undefined){/*DO NOTHING*/}
				else{
					if(option.languages.length==0){}
					else{
						for (var j = 0; j <object.languages.length; j++) {
							for (var k = 0; k <option.languages.length; k++) {
								if(object.languages[j].indexOf(option.languages[k])>-1){ j=object.languages.length; break;	}
								else if(j==object.languages.length-1 && k==option.languages.length-1){ z=false;}
							}		
						}
					}
				}	
			}
			

			if(z){ out.push(object); }
			z=true;
		}
			
		return out;
	}

})
/*if(option.name!=undefined || option.name!=""){
				console.log("index is "+element.name.indexOf(option.name))	
				if(element.name.indexOf(option.name)<-1){console.log("thats it");z=false;}
				
			}
			if(z){
				console.log("helo 2");
				if(option.types==undefined){}
				else if(option.types!=undefined || option.types.length>0){
					for (var i = element.types.length - 1; i >= 0; i--) {
						
						for (var j = option.types.length - 1; j >= 0; j--) {
							if(element.types[i].indexOf(option.types[j])>-1){
								a=1; break;
							}
							if(i==0 && j==0){z=false;}
						};
						if(a==1){break;}
					};
				}
			}
			z=true;*/
