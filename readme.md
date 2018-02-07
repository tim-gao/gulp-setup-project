这是一个gulp练习项目。

配置任务有：

* 清理文件（del）
* js代码检查（gulp-jshint）
* 代码压缩 （gulp-uglify）
* 文件合并（gulp-concat）
* SASS编译（gulp-sass）
* 实时监听（gulp-watch）
* 文件名更改（gulp-rename）

详细配置如下：

    // 引入 gulp
    var gulp = require('gulp');

    // 引入组件
    var jshint = require('gulp-jshint');
    var sass = require('gulp-sass');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var rename = require('gulp-rename');
    var del = require('del');

    //清空上一次的文件
    gulp.task('clean', function (cb) {
      del([
        'dist/**/*',
        'buid/**/*',
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
        .pipe(gulp.dest('build/css/clock.css'));
    });

    // 合并，压缩文件
    gulp.task('scripts', function () {
      gulp.src('src/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/src/'));
    });

    // // 默认任务
    // gulp.task('default', function () {
    //   gulp.start('lint', 'sass', 'scripts');

    //   // 监听文件变化
    //   gulp.watch('src/*.js', function () {
    //     gulp.start('lint', 'sass', 'scripts');
    //   });
    // });

    gulp.task('watch',function(){
      gulp.watch('src/*.js',['lint','scripts']);
      gulp.watch('sass/*.scss', ['sass']);
    });

    gulp.task('default',['clean','lint','sass','scripts','watch']);


作者：timgao

license：ISC