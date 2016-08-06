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
jsMin = require("gulp-uglify"),

rootDir = ".",
sourceDir = rootDir + "/dev/",
destDir = rootDir + "/dist/",

processors = [
	require("postcss-for"),
	require("postcss-foreach"),
	cssNext({
		"nesting": true,
		"calc": true,
		"browsers": ["> 1%", "last 3 version"],
		"autoprefixer": {
			"browsers": ["> 1%, last 3 version"]
		},
		"customProperties": true,
		"customSelectors": true,
		"sourcemap": false
	})
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


gulp.task("js", function() {
	gulp.src(components.js.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(gulpIf(argv.prod, jsMin()))
		.pipe(gulp.dest(destDir));
});

gulp.task("css", function() {
	gulp.src(components.css.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(rename(path => path.extname = ".css"))
		.pipe(postCss(processors))
		.pipe(gulpIf(argv.prod, cssMin()))
		.pipe(gulp.dest(destDir));
});

gulp.task("html", function() {
	gulp.src(components.html.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(gulpIf(argv.prod, htmlMin({processScripts: "text/x-handlebars-template"})))
		.pipe(gulp.dest(destDir));
});

gulp.task("json", function() {
	gulp.src(components.json.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(gulpIf(argv.prod, jsonMin()))
		.pipe(gulp.dest(destDir));
});

gulp.task("img", function() {
	gulp.src(components.img.src, {base: sourceDir})
		.pipe(newer(destDir))
		.pipe(imgMin())
		.pipe(gulp.dest(destDir));
});

gulp.task("watch", function() {
	for(var source in components) {
		if (components.hasOwnProperty(source)) {
			gulp.watch(components[source].src, [source]);
		}
	}
});

gulp.task("default", function() {
	gulp.start("js", "css", "html", "json", "img", "watch");
});