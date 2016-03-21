angular.module('thinkmerit')
.filter('safe', function($sce) { 

	return function (value) {
		return $sce.trustAsHtml(value);
	}; 
})
.filter('imgsrc',function ($sce) {
	return function (value, param) {
		if(param!==undefined){
			param=param.substring(0,param.lastIndexOf('/')+1);
			value=value+"";
			value=value.replace("src=\"http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML\"","");
			value=value.replace(/src=\"/g,"src=\""+param);
			var z=value.split('</head>');
			value=z[0]+"<script type='text/javascript' src='http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML'></script></head>"+z[1];
		}
		// console.log(value);
		
		return $sce.trustAsHtml(value);
	}
})
/*.filter('mathjax',function () {
	return function (value) {
		
		return 
	}
})*/

