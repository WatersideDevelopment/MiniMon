var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var run = require('gulp-run');
var concat = require('gulp-concat');
//var rename = require('gulp-rename');
//var connect = require('gulp-connect');
var flatten = require('gulp-flatten');
var expect = require('gulp-expect-file');

var paths = {
    js: [
        'bower_components/jquery/dist/jquery.js'
    ],
    sass: [
        'src/sass/minimon.scss'
    ]
};

gulp.task('default', [
        'build',
        'run'
    ]
);

gulp.task('build', [
	    'js',
	    'sass'
    ]
);

var run = function (done) {
    run('npm start &').exec()
        .pipe(gulp.dest('output'))
        .on('end', done);
};
gulp.task('run', run);

var js = function (done) {
    gulp.src(paths.js)
        .pipe(expect(paths.js))
        .pipe(concat('fe.js'))
        .pipe(flatten())
        .pipe(gulp.dest('./ui'))
        .on('end', done);
};
gulp.task('js', js);

var sass = function(done) {
    gulp.src('src/sass/minimon.scss')
        .pipe(expect('src/sass/minimon.scss'))
        .pipe(sass({
            includePaths:[
                './bower_components/bootstrap-sass/assets/stylesheets'
            ]
        }))
        .pipe(gulp.dest('./ui'))
        .on('end', done);
};
gulp.task('sass', sass);

var _watch = function(done) {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.sass, ['sass']);
};
gulp.task('watch', _watch);

var install = function (done) {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        })
        .on('end', function(data) {
            done();
        })
};
gulp.task('install', install);

var server = function(done) {
    connect.server({
        root: ['example'],
        port: 8080,
        livereload: true,
        middleware: function (connect, o) {
            return [
                (function () {
                    var url = require('url');
                    var proxy = require('proxy-middleware');
                    var options = url.parse('http://yolanda.vpn:5984/');
                    options.route = '/db/';
                    return proxy(options);
                })()
            ]
        }
    });
};
gulp.task('server', server);