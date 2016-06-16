angular.module('thinkmerit')
.filter('safe', function($sce) {

	return function (value) {
		return $sce.trustAsHtml(value);
	};
})
.filter('embedutube', function($sce) {

	return function (value) {
		return $sce.trustAsHtml("<iframe width=\"100%\" height=\"400px\" id=\"ytplayer\" type=\"text/html\" src=\"https://www.youtube.com/embed/"+value+"?autoplay=0&fs=1\"	frameborder=\"2\" allowfullscreen \/\> </div>");
	};
})
.filter('onehundred', function() {
	return function(input) {
		if(input.length>100){
			return input.substring(0,100);
		}
		else{
			return input;
		}
	}
})

/*.filter('imgsrc',function ($sce) {
	return function (value, param) {
		if(param!==undefined){
			param=param.substring(0,param.lastIndexOf('/')+1);
			value=value+"";
			value=value.replace("src=\"https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML\"","");
			value=value.replace(/src=\"/g,"src=\""+param);
			var z=value.split('</head>');
			// value=z[0]+"<script type='text/javascript' src='//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML'></script></head>";
			value+=z[1]?z[1]:"";
		}
		// console.log(value);

		return $sce.trustAsHtml(value);
	}
})*/
/*.filter('mathjax',function () {
	return function (value) {

		return
	}
})*/
