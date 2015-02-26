var through = require('through2');
var fs = require('fs');
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
function formatAsScript(filepath, options){
	return '<script src="' + slash(path.join(options.basePath, filepath)) + '"></script>\n';
}
/**
 * Formats filepath as string
 * @param  {String} filepath Path to file being wired
 * @return {String}          Formatted string
 */
function formatAsString(filepath, options){
	return '\n"' + slash(path.join(options.basePath, filepath)) + '"';
}
/**
 * Formats filepath as AMD path by removing the extension.
 * @param  {String} filepath Path to file being wired
 * @param  {Object} options  [description]
 * @return {String}          [description]
 */
function formatAsAmdPath(filepath, options){
	return formatAsString(filepath, options).replace(/\.js/, '');
}
/**
 * Returns a formatter function based on input parameter
 * @param  {String} format The desired format to wire files as
 * @return {Function}        The formatter function to use
 */
wireto.formatAs = function(format, options){
	options = options || {};
	options.basePath = options.basePath || '';
	function curry(fn){
		return function(filepath){
			return fn.apply(null, [filepath, options]);
		};
	}
	switch(format){
		case 'script':
			return curry(formatAsScript);
		case 'string':
			return curry(formatAsString);
		case 'amd-path':
			return curry(formatAsAmdPath);amd
		default:
			throw new Error('Invalid format');
	}
};

module.exports = wireto;