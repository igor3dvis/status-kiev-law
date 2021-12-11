//записываю в переменную, что необходимо называть папку не "dist", а по названию самого проэкта, чтобы было удобней на продакшен выпускать готовую папку
let project_folder = require("path").basename(__dirname);
// путь к исходникам в переменной
let source_folder = "#src";
// в переменной записаны обькты с путями к файлам и папкам проэкта
let path = {
	// пути вывода
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	// пути иходников
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
	},
	// слежка 
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
	},
	//удаление папки при запуске gulp
	clean: "./" + project_folder + "/"
}

//список переменных с присвоиными им задачами
let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require('gulp-sass')(require('sass')),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	svgSprite = require('gulp-svg-sprite'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter')

//функция обновления брвузера в реальном времени с настройками
function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

function html() {
	return src(path.src.html)
	//подключение файлов
		.pipe(fileinclude())
		//работа с картинками и кодом для них
		//выгрузка файлов
		.pipe(dest(path.build.html))
		//обновление страницы
		.pipe(browsersync.stream())
}

function css() {
	return src(path.src.css)
		.pipe(scss({
			outputStyle: 'expanded'
		}).on('error', scss.logError)
		)
		.pipe(group_media())
		.pipe(autoprefixer({
			overrideBrowserslist: ["last 5 versions"],
			cascade: true
		}))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)
		//подключение файлов
		.pipe(fileinclude())
		//выгрузка до сжатия
		.pipe(dest(path.build.js))
		//сжатие файла
		.pipe(uglify()).on('error', function (err) { console.log(err.toString()); this.emit('end'); })
		//переименование главного файла
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		//выгрузка главного файла
		.pipe(dest(path.build.js))
		//синхронизация
		.pipe(browsersync.stream())
}

// работа с изображениями
function images() {
	return src(path.src.img)
		.pipe(imagemin())
		.pipe(dest(path.build.img))
}
//работа с шрифтами, преобразование в вофф и выгрузка в главную папку
function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
};
// преобразование форматов шрифтов из otf в  ttf 
function fonts_otf() {
	return src('./' + source_folder + '/fonts/*.otf')
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(gulp.dest('./' + source_folder + '/fonts/'));
}
//создаем таск в котором обрабатывем свг и создаем спрайт свг
gulp.task('svgSprite', function () {
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../icons/icons.svg",  //sprite file name
					//пример иконок
					example: true
				}
			},
		}
		))
		//выгрузка
		.pipe(dest(path.build.img))
})
// слежка за файлами
function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}
// удаляем папку дист
function clean(params) {
	return del(path.clean);
}
// переменные, которые запускают сценарий
let fontsBuild = gulp.series(fonts_otf, fonts);
let buildDev = gulp.series(clean, gulp.parallel(fontsBuild, html, css, js, images));
let watch = gulp.series(buildDev, gulp.parallel(watchFiles, browserSync));
//подключаем к gulp переменные, чтобы он мог их выполнить
exports.css = css;
exports.fonts = fontsBuild;
exports.watch = watch;
exports.default = watch;