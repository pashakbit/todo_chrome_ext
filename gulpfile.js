var gulp = require("gulp"),
	gulpIf = require("gulp-if"),
	argv = require('yargs').argv,
	rename = require("gulp-rename"),
	newer = require("gulp-newer"),

	postCss = require("gulp-postcss"),
	cssNext = require("postcss-cssnext"),
	cssMin = require("gulp-cssmin"),
	htmlMin = require("gulp-htmlmin"),
	jsonMin = require("gulp-jsonmin"),
	imgMin = require("gulp-imagemin"),
	jsMin = require("gulp-jsmin"),


	rootDir = ".",
	sourceDir = rootDir + "/dev/",
	destDir = rootDir + "/dist/",

	processors = [
		require("postcss-for"),
		require("postcss-foreach"),
		cssNext({
			"nesting": true,
			"browsers": ["Chrome >= 42"],
			"autoprefixer": {
				"browsers": ["Chrome >= 42"]
			},
			"sourcemap": false
		}),
		require("postcss-mixins")
	],

	components = {
		js: {
			src: sourceDir + "js/**/*.js"
		},
		css: {
			src: sourceDir + "css/**/*.postcss"
		},
		html: {
			src: sourceDir + "html/**/*.html"
		},
		json: {
			src: sourceDir + "**/*.json"
		},
		img: {
			src: sourceDir + "img/**/*.+(jpg|jpeg|png|gif)"
		}
	};


gulp.task("js", () => {
	gulp.src(components.js.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(gulpIf(argv.prod, jsMin()))
		.pipe(gulp.dest(destDir));
});

gulp.task("css", () => {
	gulp.src(components.css.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(rename(path => path.extname = ".css"))
		.pipe(postCss(processors))
		.pipe(gulpIf(argv.prod, cssMin()))
		.pipe(gulp.dest(destDir));
});

gulp.task("html", () => {
	gulp.src(components.html.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(gulpIf(argv.prod, htmlMin({processScripts: "text/x-handlebars-template"})))
		.pipe(gulp.dest(destDir));
});

gulp.task("json", () => {
	gulp.src(components.json.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(gulpIf(argv.prod, jsonMin()))
		.pipe(gulp.dest(destDir));
});

gulp.task("img", () => {
	gulp.src(components.img.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(imgMin())
		.pipe(gulp.dest(destDir));
});

gulp.task("watch", () => {
	for(var source in components) {
		if (components.hasOwnProperty(source)) {
			gulp.watch(components[source].src, [source]);
		}
	}
});

gulp.task("default", () => {
	gulp.start("js", "css", "html", "json", "img", "watch");
});