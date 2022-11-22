let mix = require('laravel-mix');
require('mix-html-builder');

mix
    .sourceMaps(true, 'source-map')
    .js('resources/js/app.js', 'assets/js')
    .sass('resources/sass/style.scss', 'assets/css')
    .copyDirectory('resources/fonts', 'assets/fonts')
    .copyDirectory('resources/images', 'assets/images')
    .options({
        processCssUrls: false
    })
    .html({
        output: './',
        htmlRoot: './resources/html/*.html',
        partialRoot: './resources/html/partials',
        layoutRoot: './resources/html/layouts',
        minify: {
            removeComments: true
        }
    })
    .browserSync({
        proxy: false,
        server: {
            baseDir: './'
        },
        files: [
            'assets/js/*.js',
            'assets/css/*.css',
            '.*.html'
        ]
    });