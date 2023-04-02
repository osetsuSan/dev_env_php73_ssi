const { src, dest, watch, series, parallel, lastRun } = require('gulp');

// Common
const plumber = require("gulp-plumber"),
notify        = require("gulp-notify"),
del           = require("del"),
rename        = require('gulp-rename');

// pug
const pug = require('gulp-pug');

// Sass
const sass = require('gulp-sass')(require('sass')),
postcss    = require("gulp-postcss"),
cssnext    = require("postcss-cssnext"),
mqpacker   = require('css-mqpacker'),
sassGlob   = require("gulp-sass-glob"),
autoprefixer = require('autoprefixer');

// Babel
const babel = require('gulp-babel');

// FilePath
let filePath = {
    watch : {
        pug  : 'resource/pug/**/*.pug',
        sass : 'resource/sass/**/*.scss',
        es   : 'resource/es/**/*.es',
    },
    update : {
        pug  : '',
        sass : '',
        es   : '',
    },
    dest : {
        html : 'htdocs',
        css  : 'htdocs/assets/css',
        js   : 'htdocs/assets/js',
    },
    event : ''
};


/**
 * [Task]Pugファイルをhtmlにコンパイル
 * @param {Function} done 
 */
const compilePug = (done)=> {

    // ファイル削除時動作
    if(filePath.event === 'unlink') {
        deleteCompileFile(filePath.update.pug, done, 'pug');
        return;
    }

    let distPath = filePath.update.pug
        .replace(/\\/g, '/')
        .replace(/^(.*\/).*/, '$1')
        .replace('resource/pug', '');

    return src(filePath.update.pug)
        .pipe(
            plumber({errorHandler: notify.onError('Error:<%= error.message %>')}))
        .pipe(pug({
            pretty: true,
            filters: {
                php : text => {
                    text = '<?php ' + text + ' ?>';
                    return text;
                }
            }
        }))
        .pipe(rename((aPath)=> {
            aPath.dirname = distPath;
        }))
        .pipe(dest(filePath.dest.html))

}

/**
 * [Task]Sassファイルをcssにコンパイル
 * @param {Function} done 
 */
const compileSass = (done) => {

    // ファイル削除時動作
    if(filePath.event === 'unlink') {
        deleteCompileFile(filePath.update.sass, done, 'sass');
        return;
    }

    let distPath = filePath.update.sass
        .replace(/\\/g, '/')
        .replace(/^(.*\/).*/, '$1')
        .replace('resource/sass', '');

    return src(filePath.update.sass, {
            sourcemaps : true
        })
        .pipe(
            plumber({errorHandler: notify.onError('Error:<%= error.message %>')}))
        .pipe(sassGlob())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([mqpacker()]))
        .pipe(postcss([autoprefixer({ 
                cascade: false,
                grid: "autoplace"
            })]))
        .pipe(rename((aPath)=> {
            aPath.dirname = distPath;
        }))
        .pipe(dest(filePath.dest.css, {
            sourcemaps: true
        }))
}

/**
 * [Task]esファイルをjsにトランスパイル
 * @param {Function} done 
 */
const transpileEcma = (done)=> {

    // ファイル削除時動作
    if(filePath.event === 'unlink') {
        deleteCompileFile(filePath.update.es, done, 'es');
        return;
    }

    let distPath = filePath.update.es
        .replace(/\\/g, '/')
        .replace(/^(.*\/).*/, '$1')
        .replace('resource/es', '');

    return src(filePath.update.es)
        .pipe(
            plumber({errorHandler: notify.onError('Error:<%= error.message %>')}))
        .pipe(babel())
        .pipe(rename((aPath)=> {
            aPath.dirname = distPath;
        }))
        .pipe(dest(filePath.dest.js))
}

/**
 * コンパイル元ファイル削除時動作
 * @param {String} aPath - 削除コンパイルファイルのパス
 * @param {Function} aCallBack - Task終了時実行関数
 * @param {String} aFileType   - コンパイルファイル種別（pug|sass|es） 
 */
const deleteCompileFile = (aPath, aCallBack, aFileType)=> {
    let deleteFile;
    switch(aFileType) {
        case 'pug' :
            deleteFile = aPath.replace('resource\\pug\\', 'htdocs\\').replace('.pug', '.html');
        break;
        case 'sass' :
            deleteFile = aPath.replace('resource\\sass\\', 'htdocs\\assets\\css\\').replace('.scss', '.css');
        break;
        case 'es' :
            deleteFile = aPath.replace('resource\\es\\', 'htdocs\\assets\\js\\').replace('.es', '.js');
        break;
    }

    del(deleteFile);
    console.log(deleteFile + 'を削除しました');
    aCallBack();
};


// Watch
const gulpWatchFunc = ()=> {

    watch(filePath.watch.pug, compilePug).on('all', (ev, path)=> {
        filePath.event = ev;
        filePath.update.pug = path;
    });

    watch(filePath.watch.sass, compileSass).on('all', (ev, path)=> {
        filePath.event = ev;
        filePath.update.sass = path;
    });

    watch(filePath.watch.es, transpileEcma).on('all', (ev, path)=> {
        filePath.event = ev;
        filePath.update.es = path;
    });

}

exports.default = gulpWatchFunc;