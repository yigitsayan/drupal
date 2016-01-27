// @desc Gulpfile for Hangi Club theme
// @date 8.1.2016 15:14
// @author Yiğit Sayan <yigitsayan@gmail.com>
var gulp         = require('gulp');
var livereload   = require('gulp-livereload')
var uglify       = require('gulp-uglifyjs');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
var concat       = require('gulp-concat');
var config = {
    cssPath: './themes/custom/hangiclub',
    bowerDir: './bower_components'
}

gulp.task('css', function(){
    return gulp
        .src('./themes/custom/hangiclub/sass/style.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [ 
                config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                config.bowerDir + '/font-awesome/scss'
            ],
    }))
    .pipe(gulp.dest(config.cssPath + '/css'));
});

gulp.task('icons', function() {
    return gulp
        .src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest(config.cssPath + '/fonts'));
});


gulp.task('concatjs', function(){
    return gulp
        .src([config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js', config.cssPath + '/lib/owl.carousel.js', config.cssPath + '/lib/jquery-scrolltofixed.js', config.cssPath + '/lib/placeholdem.js' , config.cssPath + '/lib/fresco.js' , config.cssPath + '/lib/main.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(config.cssPath + '/js'));

});

gulp.task('uglify',function(){
    return gulp
        .src(config.cssPath + '/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.cssPath + '/js/'));
});

gulp.task('watch', function(){
    livereload.listen();

    gulp.watch('./themes/custom/hangiclub/sass/**/*.scss', ['css']);
    gulp.watch('./themes/custom/hangiclub/lib/*.js', ['concatjs']);
    gulp.watch('./themes/custom/hangiclub/js/*.js', ['uglify']);
    gulp.watch(['./themes/custom/hangiclub/sass/**/*.scss', './themes/custom/hangiclub/**/*.twig', './themes/custom/hangiclub/js/*.js'], function (files){
        livereload.changed(files)
    });
});

gulp.task('default', ['icons', 'css', 'concatjs', 'uglify', 'watch']);