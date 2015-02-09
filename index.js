var through = require('through2');
var fs = require('fs');
var util = require('gulp-util');
var es = require('event-stream');
var path = require('path');
var slash = require('slash');

var wireto = function( placeholder, src, template, delimiter ){
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

/**
 * Formats filepath as script tag
 * @param  {String} filepath Path to file being wired
 * @return {String}          Formatted string
 */
function formatAsScript(filepath){
	return '<script src="' + slash(filepath) + '"></script>\n';
}
/**
 * Formats filepath as string
 * @param  {String} filepath Path to file being wired
 * @return {String}          Formatted string
 */
function formatAsString(filepath){
	return '\n"' + slash(path.join('src', 'app', 'autoload', filepath)) + '"';
}
/**
 * Returns a formatter function based on input parameter
 * @param  {String} format The desired format to wire files as
 * @return {Function}        The formatter function to use
 */
wireto.formatAs = function(format){
	switch(format){
		case 'script':
			return formatAsScript;
		case 'string':
			return formatAsString;
		default:
			throw new Error('Invalid format');
	}
};

module.exports = wireto;