const gulp = require('gulp'); //Подключаем Gulp
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const fileinclude = require('gulp-file-include'); //Для подключения файлов друг в друга


//Таск для сборки HTML из шаблонов
gulp.task('html', function(callback) {
    return gulp.src('./app/html/*.html')
    .pipe( plumber({
        errorHandler: notify.onError(function(err) {
            return {
                title: 'HTML include', //Ошибка касается HTML
                sound: false, //Заглушаем звуки
                message: err.message
            }
        })
    }) )
    .pipe( fileinclude ({ prefix: '@@'}) )
    .pipe( gulp.dest('./app/') )
    callback();
});



//Таск для компиляции SCSS в CSS
gulp.task('scss', function(callback) {
    return gulp.src('./app/scss/main.scss')

    .pipe( plumber({
        errorHandler: notify.onError(function(err) {
            return {
                title: 'Styles', //Ошибка касается стилей
                sound: false, //Заглушаем звуки
                message: err.message
            }
        })
    }) )
    .pipe( sourcemaps.init() )
    .pipe( sass() )
    .pipe( autoprefixer({
        overrideBrowserslist: ['last 4 versions']
    }) )
    .pipe( sourcemaps.write() )
    .pipe( gulp.dest('./app/css/') )
   callback();
});


//Слежение за HTML и CSS и обновление браузера
gulp.task('watch', function() {
    watch(['./app/*.html', './app/css/**/*.css'], gulp.parallel(browserSync.reload));

    //Слежение за SCSS и компиляция в CSS
    //watch('./app/scss/**/*.scss', gulp.parallel('scss'));

    watch('./app/scss/**/*.scss', function() {
        setTimeout( gulp.parallel('scss'), 1000 )
    })

    //Слежение за HTML и сборка страниц и шаблонов
    watch('./app/html/**/*.html', gulp.parallel('html'))
});

//Задача для старта сервера из папки app
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./app/"
        }
    });
});

//Дефолтный таск (задача по умолчанию)
//Запускает одновременно задачи server и watch
gulp.task('default', gulp.parallel('server', 'watch', 'scss', 'html') );
