const jshint    = require('gulp-jshint')
    , mocha     = require('gulp-mocha')
    , istanbul  = require('gulp-istanbul')
    , gulp      = require('gulp')
    , path      = require('path');

jshintOpt = { esversion: 6
            , laxcomma: true
            , '-W100': true
            , scripturl: true};

srcTest = ['./test/index.js'];

src = [ './index.js'
      , './noslide'
      , './lib/*.js'
      , './lib/themes/*.js'
      , './test/index.js'];


gulp.task('pre-test', function () {
  return gulp.src(['lib/*.js', 'lib/themes/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('lint', () => {
  return gulp.src(src)
    .pipe(jshint(jshintOpt))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter("fail"));
});

gulp.task('test', ['pre-test', 'lint'], () => {
  gulp.src(srcTest)
      .pipe(mocha())
      .pipe(istanbul.writeReports())
      .once('error', () => {
        process.exit(1);
      })
      .once('end', () => {
        process.exit(0);
      });
});

gulp.task('default', ['test']);
