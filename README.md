# wireto
Gulp plug-in for wiring a stream to placeholder text

directory
```
index.template.html
one.js
two.js
gulpfile.js
```
index.template.html
```
<html>
<body>
<!-- put script tags here -->
</body>
</html>
```
gulpfile.js
```
var gulp = require('gulp');
var rename = require('gulp-rename');
var slash = require('slash');
var wireto = require('wireto');

gulp.task('wire-js-files-to-html', function(){
  var js = gulp.src('*.js');
  return gulp.src('index.template.html')
    .pipe(wireto('<!-- put script tags here -->', js, function(filepath){
      return '<script src="' + slash(filepath) + '"></script>\n';
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('.'));
});
```
index.html
```
<html>
<body>
<script src="one.js"></script>
<script src="two.js"></script>
</body>
</html>
