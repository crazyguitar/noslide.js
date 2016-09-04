const jshint = require('gulp-jshint');
const gulp   = require('gulp');

jshintOpt = { esversion: 6
            , laxcomma: true
            , '-W100': true
            , scripturl: true};

src = [ './index.js'
      , './noslide'
      , './lib/*.js'
      , './lib/themes/*.js'];

gulp.task('lint', function() {
  return gulp.src(src)
    .pipe(jshint(jshintOpt))
    .pipe(jshint.reporter('default'));
});
