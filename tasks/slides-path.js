var fs = require('fs');

function SlidesPath (){
	this.slidesFolder = undefined,
	this.slidesPath = undefined,
	
	this.extend = function (target) {
		var sources = [].slice.call(arguments, 1);
		sources.forEach(function (source) {
			for (var prop in source) {
				target[prop] = source[prop];
			}
		});
		return target;
	};

	this.init = function(slidesPath) {
		var _this = this;
		_this.slidesPath = slidesPath;
		
		try {
		  _this.slidesFolder = fs.readdirSync(_this.slidesPath);
		} catch (err) {
		  _this.slidesFolder = [];
		  console.log('Error: No slides found!')
		}
		
		return {
			slidesPath: _this.slidesPath,
			slidesFolder: _this.slidesFolder,

			getSlidesPath: function (base, folder) {
				return _this.slidesFolder.map(function(item) {
					if (folder){
						return [base, item, folder].join('/');
					}else{
						return [base, item].join('/');
					}
				});
			},

			getCopyDestinationPath: function (base, src, options) {
				return _this.slidesFolder.map(function(item) {
					return _this.extend({src: src, dest: [base, item, ''].join('/')}, options);;
				});
			},

			getSassDestinationPath: function (base, src, innerFolder, options){
				return _this.slidesFolder.map(function(item) {
					return _this.extend({ cwd: [base, item, innerFolder.src].join('/'), src: src, dest: [base, item, innerFolder.dest].join('/') }, options);;
				});
			},
			
			getJsminDestinationPath: function (base, src, innerFolder, output){
				return _this.slidesFolder.map(function(item) {
					var obj = {};
					obj[([base, item, innerFolder.dest, output].join('/'))] = src.map(function(jsFile) {
						return [base, item, innerFolder.src, jsFile].join('/');
					});
					return obj;
				});
			},

			renamePhantomjScreenshot: function(dest, src) {
				path = src.split('/');
				name = path[path.length-1].split(".")
				name[0] = 'thumb';
				path[path.length-1] = name.join(".");
				return dest + '/' + path.join("/");
			}
		}
	}
}

module.exports = function(slidesPath) {
  return new SlidesPath().init(slidesPath)
}





