
var modernizrTests = [
	'cssclasses',
	'rgba',
	'svg',
	'boxshadow',
	'backgroundsize',
];

var gulp       = require('gulp'),
    addSrc     = require('gulp-add-src'),
    concat     = require('gulp-concat'),
    size       = require('gulp-size'),
    minify     = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    jshint     = require('gulp-jshint'),
    jshint_s   = require('jshint-stylish'),
    rename     = require('gulp-rename'),
    compass    = require('gulp-compass'),
    modernizr  = require('gulp-modulizr'),
    del        = require('del'),
    favicons   = require('gulp-favicons'),
    paths      = require('path');


gulp.task('del-generated-favicon-html', function () {
    return del([
    	path.includes().append('favicons.html').s()
    ], {
    	force: true
    });
});

gulp.task('del-temp-favicon-source', function () {
    return del([
    	path.includes().append('._favicons.html').s()
    ], {
    	force: true
    });
});

gulp.task('generate-favicons', ['del-generated-favicon-html'], function () {
    return gulp.src(path.includes().append('_favicons.html').s())
        .pipe(rename('._favicons.html'))
        .pipe(gulp.dest(path.includes().s()))
        .pipe(favicons({
            files: {
            	dest: '../' + path.images().append('favicons').s(),
            	html: path.includes().append('favicons.html').s(),
            	iconsPath: '/_assets/img/favicons/'
            },
            settings: { background: '#FFFFFF' }
        }));
});

gulp.task('create-favicons', ['generate-favicons'], function () {
    return del([
    	path.includes().append('._favicons.html').s()
    ], {
    	force: true
    });
});

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
			css: paths.join(__dirname, path.css().s()),
			sass: paths.join(__dirname, path.sass().s()),
			image: paths.join(__dirname, path.images().s()),
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


gulp.task('build', [
	'create-favicons',
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
	return new path('../_site');
};

path.layouts = function() {
	return path.base().append('_layouts');
};

path.includes = function() {
	return path.base().append('_includes');
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
