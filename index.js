var through = require('through2');
var fs = require('fs');
var util = require('gulp-util');
var es = require('event-stream');
var path = require('path');

module.exports = function( placeholder, src, template, delimiter ){
	var buffer = [],
		srcPaths = [];
	template = template || function(x){return x;};
	delimiter = delimiter || '';
	return through.obj(function( file, enc, cb){
		buffer.push(file);
        cb();
	}, function(cb){
		var self = this;
		src.on('data', function(file){
			srcPaths.push(file.relative);
		})
		.on('end', function(){
			srcPaths = srcPaths.map(template).join(delimiter);
			buffer.forEach(function(file){
				file.contents = new Buffer( file.contents.toString().replace( placeholder, srcPaths) );
				self.push(file);
			});
			cb();
		});
	});
};