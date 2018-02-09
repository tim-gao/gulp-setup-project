// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var amdOptimize = require('amd-optimize'); 

//清空上一次的文件
gulp.task('clean', function (cb) {
  del([
    'css/**/*'
  ], cb);
});
// 检查脚本
gulp.task('lint', function () {
  gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// 编译Sass
gulp.task('sass', function () {
  gulp.src('sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css/'));
});

// 合并，压缩文件
// gulp.task('scripts', function () {
//   gulp.src('src/*.js')
//     .pipe(concat('all.js'))
//     .pipe(gulp.dest('./dist'))
//     .pipe(rename('all.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('build/src/'));
// });

// // 默认任务
// gulp.task('default', function () {
//   gulp.start('lint', 'sass', 'scripts');

//   // 监听文件变化
//   gulp.watch('src/*.js', function () {
//     gulp.start('lint', 'sass', 'scripts');
//   });
// });

gulp.task('rjs', function () {
  return gulp.src('./**/*.js')
    .pipe(amdOptimize.src('main',{
      baseUrl: './',
      paths: {
        'jquery': 'lib/jquery-3.2.0',
        'mytime': 'src/mytime',
        'app': 'src/app',
      },

      waitSeconds: 0,

      shim: {

      },
    })) //主入口文件
    .pipe(concat('all.js')) //合并  
    .pipe(gulp.dest('./')) //输出保存  
    .pipe(rename('all.min.js')) //重命名  
    .pipe(uglify()) //压缩  
    .pipe(gulp.dest("./")); //输出保存  
});

gulp.task('watch',function(){
  gulp.watch('src/*.js',['lint','scripts']);
  gulp.watch('sass/*.scss', ['sass']);
});

//gulp.task('default',['clean','lint','sass','scripts','watch']);
gulp.task('default', ['clean', 'lint', 'sass', 'rjs']);