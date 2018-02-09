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

 ---
 ### gulp的异步模块加载插件amd-optimize

 gulp和requirejs集成的过程中花了好久的时间，
 * 一是因为不熟悉应该用哪个个插件。实际上有gulp-requirejs,amd-optimize,gulp-amd-optimize,gulp-optimizer这些插件，试过才发现gulp-requirejs其实已经不推荐用了，似乎是因为requirejs本身就具有代码压缩整合能力，功能上和gulp-concat,gulp-uglify是重复的并且不太兼容，有兴趣的话可以看看[stackoverflow](https://stackoverflow.com/questions/23978361/using-gulp-to-build-requirejs-project-gulp-requirejs)。最终本人采用了amd-optimize。
 * 二是因为实际上我在练习的过程中遇到了两个关键问题始终解决不了 *1)* 代码压缩总是包含配置文件部分，其他的依赖无法合并。 *2)* 可以压缩所有依赖，但代码初始化无法执行。 功夫不负有心人，最后还是解决了，详细过程真是一言难尽，看下面的具体配置吧，并结合示例跑一下，自会明白。
 
执行gulp default后，浏览器打开index.html看到一个实时的时钟，如下图

![gulp demo result](./clock.png)

```
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

```

作者：timgao

博客: [http://julysxy.xyz](http://julysxy.xyz)

license：ISC