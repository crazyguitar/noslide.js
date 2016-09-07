const jshint = require('gulp-jshint')
    , mocha  = require('gulp-mocha')
    , gulp   = require('gulp');

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

gulp.task('test', () => {
  gulp.src(srcTest)
      .pipe(mocha())
      .once('error', () => {
        process.exit(1);
      })
      .once('end', () => {
        process.exit(0);
      });
});

gulp.task('lint', () => {
  return gulp.src(src)
    .pipe(jshint(jshintOpt))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter("fail"));
});

gulp.task('default', ['test', 'lint']);
