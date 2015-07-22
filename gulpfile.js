var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
//var concat = require('gulp-concat');
//var rename = require('gulp-rename');
//var connect = require('gulp-connect');
var flatten = require('gulp-flatten');
var expect = require('gulp-expect-file');

var paths = {
    js: [
        'bower_components/jquery/dist/jquery.js ',
        'src/napkins.js'],
    sass: [
        'src/sass/minimon.scss']
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

gulp.task('js', function (done) {
    gulp.src(paths.js)
        .pipe(expect(paths.js))
        .pipe(flatten())
        .pipe(gulp.dest('./example/'))
        .on('end', done);
});

gulp.task('sass', function (done) {
    gulp.src('src/sass/minimon.scss')
        .pipe(expect('src/sass/minimon.scss'))
        .pipe(sass({
            includePaths: ['./bower_components/bourbon/app/assets/stylesheets/bourbon']
        }))
        .pipe(gulp.dest('./ui/minimon.css'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.distjs, ['fulljs', 'distjs', 'examplejs']);
    gulp.watch(paths.distcss, ['examplecss']);
});

gulp.task('install', function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

//gulp.task('server', function () {
//    connect.server({
//        root: ['example'],
//        port: 8080,
//        livereload: true,
//        middleware: function (connect, o) {
//            return [
//                (function () {
//                    var url = require('url');
//                    var proxy = require('proxy-middleware');
//                    var options = url.parse('http://yolanda.vpn:5984/');
//                    options.route = '/db/';
//                    return proxy(options);
//                })()
//            ]
//        }
//    });
//});
