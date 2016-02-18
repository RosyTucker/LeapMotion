import gulp from 'gulp';

// Runs a local dev server
import connect from 'gulp-connect';

// Open a URL in a web browser
import open from 'gulp-open';

// Concatenates files
import concat from 'gulp-concat';

// Lint JS files
import lint from 'gulp-eslint';

// SASS to CSS
import sass from 'gulp-sass';

// Run tasks synchronously
import runSequence from 'run-sequence';

// Bundles JS
import browserify from 'browserify';

// Transpile ES6 to ES5
import babelify from 'babelify';

// Use conventional text streams with Gulp
import source from 'vinyl-source-stream';

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: ['./src/js/**/*.js'],
        sass: ['./src/sass/application.scss'],
        dist: './dist',
        assets: [
            './src/assets/*'
        ],
        mainJs: './src/js/index.es6.js'
    }
};

gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: process.env.PORT || config.port,
        livereload: process.env.NODE_ENV !== 'production'
    });
});

gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    browserify(config.paths.mainJs, {require: ['cylon-leapmotion']})
        .transform(babelify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    gulp.src(config.paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function () {
    return gulp.src(config.paths.js)
        .pipe(lint({config: 'eslint.config.json'}))
        .pipe(lint.format());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.sass, ['sass']);
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.html, ['assets']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('icons', function () {
    return gulp
        .src(config.paths.icons)
        .pipe(gulp.dest(config.paths.dist + '/fonts'));
});

gulp.task('assets', function () {
    return gulp
        .src(config.paths.assets)
        .pipe(gulp.dest(config.paths.dist + '/assets'));
});

gulp.task('build', ['html', 'js', 'sass', 'lint', 'assets']);

gulp.task('prod', function (done) {
    runSequence('build', 'connect', function () {
        done();
    });
});

gulp.task('default', ['build', 'open', 'watch']);
