
var modernizrTests = [
	'cssclasses',
	'rgba',
	'svg',
	'boxshadow',
	'backgroundsize',
];

var gulp       = require('gulp'),
// 		fs         = require('fs'),
//     del        = require('del'),
    addSrc     = require('gulp-add-src'),
//     vinylPaths = require('vinyl-paths'),
//     rev        = require('gulp-rev'),
//     copy       = require('gulp-copy'),
//     rename     = require('gulp-rename'),
    concat     = require('gulp-concat'),
    size       = require('gulp-size'),
    minify     = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    jshint     = require('gulp-jshint'),
    jshint_s   = require('jshint-stylish'),
    compass    = require('gulp-compass'),
    modernizr  = require('gulp-modulizr');


// gulp.task('version', ['build'], function() {
// 	var files = vinylPaths();

// 	emptyBuildPathFiles(
// 		path.build().s(),
// 		path.build().append('rev-manifest.json').s()
// 	);

// 	return gulp.src([
// 			path.css().minified().append('*.css').s(),
// 			path.js().minified().append('*.js').s(),
// 			path.js().vendor().minified().append('*.js').s(),
// 		], { base: './public' })
// 		.pipe(rename(function (path) {
// 			path.dirname = path.dirname.replace('/.minified', '');
// 		}))
// 		.pipe(gulp.dest(path.build().s()))
// 		.pipe(files)
// 		.pipe(rev())
// 		.pipe(gulp.dest(path.build().s()))
// 		.pipe(rev.manifest())
// 		.pipe(gulp.dest(path.build().s()))
// 		.on('end', function() {
// 			del(files.paths, { force: true });
// 		});
// });

// gulp.task('copy-requirejs', function() {
// 	var files = vinylPaths();

// 	return gulp.src(path.bower('requirejs/require.js').s())
// 		.pipe(gulp.dest(path.js().vendor().s()))
// 		.pipe(size({ title:'Original', showFiles:true }))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(path.js().vendor().minified().s()))
// 		.pipe(size({ title:'Optimized', showFiles:true, gzip:true }));
// });

gulp.task('copy-bootstrap-fonts', function() {
	return gulp.src(path.bower('bootstrap-sass-official/assets/fonts/bootstrap/*').s())
		.pipe(gulp.dest(path.fonts().vendor().append('bootstrap').s()))
		.pipe(size({ title:'Bootstrap Fonts', gzip:true }));
});

gulp.task('copy-pygments-css', function() {
	return gulp.src(path.bower('pygments/css/*').s())
		.pipe(minify())
		.pipe(gulp.dest(path.css().vendor().append('pygments').s()))
		.pipe(size({ title:'Pygments CSS', gzip:true }));
});

gulp.task('compile-compass', function() {
	return gulp.src(path.sass().append('*.scss').s())
		.pipe(compass({
			css: path.css().s(),
			sass: path.sass().s(),
			image: path.images().s()
		}))
		.pipe(minify())
		.pipe(gulp.dest(path.css().s()));
});

gulp.task('custom-modernizr', function() {

	return gulp.src(path.bower('modernizr/modernizr.js').s())
		.pipe(size({ title:'Original', showFiles:true }))
		.pipe(modernizr(modernizrTests))
		.pipe(addSrc.append([
			path.js().append('modernizr/*.js').s()
		]))
		.pipe(concat('modernizr.js'))
		.pipe(gulp.dest(path.js().vendor().s()))
		.pipe(uglify())
		.pipe(gulp.dest(path.js().vendor().s()))
		.pipe(size({ title:'Optimized', showFiles:true, gzip:true }));
});

gulp.task('lint-js', function() {
	return gulp.src([
			path.js().append('/**/*.js').s(),
			'!' + path.js().vendor().append('*.js').s()
		])
		.pipe(jshint())
		.pipe(jshint.reporter(jshint_s))
		.pipe(jshint.reporter('fail'));
});

// gulp.task('compile-js-app', function () {
// 	return gulp.src(path.js().append('main.app.js').s())
// 		.pipe(requirejs({
// 			optimize: 'none',
// 			findNestedDependencies: true,
// 			baseUrl: path.bower().s(),
// 			mainConfigFile: path.js().append('config.js').s(),
// 			name: 'main.app',
// 		}))
// 		.pipe(gulp.dest(path.js().compiled().s()))
// 		.pipe(size({ title:'Original', showFiles:true }))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(path.js().minified().s()))
// 		.pipe(size({ title:'Optimized', showFiles:true, gzip:true }));
// });

// gulp.task('compile-js-admin', function () {
// 	return gulp.src(path.js().append('main.admin.js').s())
// 		.pipe(requirejs({
// 			optimize: 'none',
// 			findNestedDependencies: true,
// 			baseUrl: path.bower().s(),
// 			mainConfigFile: path.js().append('config.js').s(),
// 			name: 'main.admin',
// 		}))
// 		.pipe(gulp.dest(path.js().compiled().s()))
// 		.pipe(size({ title:'Original', showFiles:true }))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(path.js().minified().s()))
// 		.pipe(size({ title:'Optimized', showFiles:true, gzip:true }));
// });

gulp.task('build', [
	'copy-bootstrap-fonts',
	'copy-pygments-css',
	'custom-modernizr',
	'compile-compass',
	'lint-js',
]);

gulp.task('default', [
	'build',
]);

gulp.task('watch', function() {
	gulp.watch(path.sass().append('*.scss').s(), ['compile-compass']);
	gulp.watch([
		path.js().append('/**/*.js').s(),
		'!' + path.js().vendor().append('*.js').s()
	], ['lint-js']);
	gulp.watch(path.js().append('modernizr/*.js').s(), ['custom-modernizr']);
});


function path(p, f){
	if(f) f = '/' + f;
	this.path = p + path.format(f);
};

path.base = function() {
	return new path('_site');
};

path.assets = function() {
	return path.base().append('_assets');
};

path.bower = function(p) {
	return new path('libs').append(p);
};

path.sass = function() {
	return path.assets().append('scss');
};

path.css = function() {
	return path.assets().append('css');
};

path.images = function() {
	return path.assets().append('img');
};

path.fonts = function() {
	return path.assets().append('fonts');
};

path.js = function() {
	return path.assets().append('js');
};

path.format = function(p) {
	if(!p) return '';
	return p;
},

path.prototype = {

	path: '',

	toString: function(){
		return this.path;
	},

	s: function(){
		return this.toString();
	},

	append: function(p) {
		return new path(this.path, p);
	},

	compiled: function() {
		return this.append('.compiled');
	},

	minified: function() {
		return this.append('.minified');
	},

	vendor: function() {
		return this.append('vendor');
	}

}

// var emptyBuildPathFiles = function(buildPath, manifest) {
//     fs.stat(manifest, function(err, stat) {
//         if (! err) {
//             manifest = JSON.parse(fs.readFileSync(manifest));

//             for (var key in manifest) {
//                 del.sync(buildPath + '/' + manifest[key], { force: true });
//             }
//         }
//     });
// };
