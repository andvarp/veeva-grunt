var slidePath = require('./tasks/slides-path')('src/slides')

module.exports = function(grunt) {

  var vaultCsvGenerator = require('./tasks/vault-csv-generator-grunt.js')(grunt);
  var zipAssets = require('./tasks/zip-assets-grunt.js')(grunt);

  var baseSlidesWeb = 'web/src/slides';

  var JSLibraries = [
    'lib/jquery.min.js',
    'lib/hammer.min.js',
    'lib/veeva-library-3.2.js',
    'lib/fastclick.js',
    'lib/bouncefix.min.js',
    'dh-veeva-utils.js',
    'main.js',
    'slide.js'
  ];

  var target = grunt.option('target') || 'dev';
  console.log('*Target*', target);

  grunt.initConfig({

    clean: {
      all: ['web/**','zip/**'],
      assets:[
        'web/**/**/sass',
        'web/**/**/javascript'
      ],
      build: ['web/src']
    },

    assemble: {
      options: {
        layoutdir: 'src/layouts',
        layout: 'default.hbs',
        partials: 'src/partials/**/*.hbs',
        helpers: 'src/helpers/*.js',
        data: 'src/data/cfg.json',
        env: target,
        envData: grunt.file.readJSON('src/data/env/' + target + '.json'),
        flatten: false
      },
      slides: {
        files: {
          'web/': ['src/slides/**/*.hbs'],
        }
      }
    },

    copy: {
      slideAssets: {
        cwd: 'src',
        src: ['slides/**/assets/**','slides/**/thumb.png'],
        dest: 'web/src/',
        expand: true
      },
      globalAssets: {
        files: slidePath.getCopyDestinationPath(baseSlidesWeb, ['assets/**',], {cwd: 'src', expand: true})
      },
      build: {
        cwd: baseSlidesWeb,
        src: ['**', '!.svn'],
        dest: 'web/',
        expand: true
      }
    },

    sass : {
      options: {
        sourcemap: 'none',
        style: 'compressed'
      },
      slides: {
        files: slidePath.getSassDestinationPath(baseSlidesWeb, ['*.scss'], {src: 'assets/sass', dest: 'assets/css'}, {expand: true, ext: '.min.css'}),
      },
    },

    uglify: {
      options: {
        mangle: false,
        sourceMap: false,
        compress: false
      },
      slides: {
        files: slidePath.getJsminDestinationPath(baseSlidesWeb, JSLibraries, {src: 'assets/javascript', dest: 'assets/js'}, 'all-js.min.js')
      }
    },

    cachebreaker: {
      dev: {
        options: {
          match: ['assets/css/all-styles.min.css', 'assets/js/all-js.min.js'],
        },
        files: {
          src: ['web/**/index.html']
        }
      }
    },

    mkdir: {
      zip: {
        options: {
          create: ['zip']
        },
      },
    },

    vaultCsvGenerator: {
      files: [
        {
          foo: 'bar',
          envData: grunt.file.readJSON('src/data/env/' + target + '.json'),
          csvFileName: 'zip/' + target + '.csv'
        }
      ]
    },

    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['src/**'],
        tasks: ['default']
      }
    },

    connect: {
      server: {
        options: {
          livereload: true,
          open: true,
          hostname: 'localhost',
          port: 5432,
          base: 'web'
        }
      }
    },

    zipAssets: {
      directories: [
        {
          name: 'brand',
          webDir: 'web',
          zipDir: 'zip'
        }
      ]
    },

    phantomjs_screenshot: {
      thumbs: {
        options: {
          viewport: '400x300',
          quality: 100
        },
        files: [{
          expand: true,
          cwd: 'web',
          src: ['**/*.html'],
          dest: 'web',
          ext: '.png',
          rename: slidePath.renamePhantomjScreenshot
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-phantomjs-screenshot');

  grunt.registerMultiTask('vaultCsvGenerator', 'vault csv generator', vaultCsvGenerator);
  grunt.registerMultiTask('zipAssets', 'zip assets', zipAssets);

  // Custom tasks
  grunt.registerTask('assets', ['copy:slideAssets', 'copy:globalAssets']);
  grunt.registerTask('css', ['sass:slides']);
  grunt.registerTask('js', ['uglify:slides']);

  grunt.registerTask('csv', ['mkdir:zip', 'vaultCsvGenerator']);
  grunt.registerTask('thumbs', ['phantomjs_screenshot:thumbs']);
  
  grunt.registerTask('beforeBuild', ['clean:all']);
  grunt.registerTask('build', ['assemble', 'assets', 'css', 'js', 'clean:assets']);
  grunt.registerTask('afterBuild', ['copy:build', 'clean:build','cachebreaker']);

  grunt.registerTask('default', ['beforeBuild', 'build', 'afterBuild']);
  grunt.registerTask('serve', ['default', 'connect', 'watch']);
  grunt.registerTask('zip', ['default', 'thumbs', 'csv', 'zipAssets']);

};