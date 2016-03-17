/* ----------------------------------------------------------------------
 * Grunt
 *
 * 開発開始手順
 * $ npm install
 * $ grunt
 *
 * 開発watch,connectコマンド
 * $ grunt live
 *
 ---------------------------------------------------------------------- */

module.exports = function (grunt) {

  // manage
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
  });


  // process
  grunt.initConfig({

    path: {
      src: 'src/',
      build: 'build/',
      hbs_src: 'src/hbs/',
      scss_src: 'src/scss/',
      js_src: 'src/js/',
      img_src: 'src/img/'
    },

    pkg: grunt.file.readJSON('package.json'),

    clean: ['<%= path.build %>'],

    /* html */
    assemble: {
      options: {
        layoutdir: '<%= path.hbs_src %>layouts/',
        partials: ['<%= path.hbs_src %>partials/**/*.hbs'],
        data: ['<%= path.hbs_src %>data/**/*.{json,yml}'],
        helpers: ['handlebars-helper-prettify'],
        prettify: {
          indent: 4
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.hbs_src %>pages/',
          src: ['**/*.hbs'],
          dest: '<%= path.build %>'
        }]
      }
    },


    /* css */
    sass: {
      options: {
        style: 'compact',
        sourcemap: 'none',
        noCache: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.scss_src %>',
          src: ['**/*.scss'],
          dest: '<%= path.build %>css/',
          ext: '.css'
        }]
      },
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      all: {
        src: '<%= path.build %>css/**/*.css'
      }
    },

    csscomb: {
      all: {
        expand: true,
        cwd: '<%= path.build %>css/',
        src: ['**/*.css'],
        dest: '<%= path.build %>css/',
      }
    },

    csso: {
      all: {
        expand: true,
        cwd: '<%= path.build %>css/',
        src: ['**/*.css'],
        dest: '<%= path.build %>css/',
        options: {
          restructure: false
        }
      }
    },


    /* js */
    uglify: {
      all: {
        files: [{
            expand: true,
            cwd: '<%= path.src %>js/',
            src: ['*.js', '!*.min.js'],
            dest: '<%= path.build %>js/',
            ext: '.min.js'
        }]
      }
    },

    /* img */
    copy: {
      img: {
        expand: true,
        cwd: '<%= path.img_src %>',
        src: ['**/*.{png,jpg}'],
        dest: '<%= path.build %>img/'
      }
    },


    watch: {
      html: {
        files: ['src/**/*.hbs'],
        tasks: ['build:html']
      },
      css: {
        files: ['src/**/*.scss'],
        tasks: ['build:css'],
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['build:js']
      },
      options: {
        livereload: true
      }
    },

    connect: {
      server: {
        options: {
          port: 1108,
          base: 'build/'
        }
      }
    }

  });


  grunt.registerTask('build:html', ['assemble']);
  grunt.registerTask('build:css', ['sass', 'autoprefixer', 'csscomb', 'csso']);
  grunt.registerTask('build:js', ['uglify']);
  grunt.registerTask('build:img', ['copy:img']);
  grunt.registerTask('build', ['clean', 'build:html', 'build:css', 'build:js', 'build:img']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('live', ['connect', 'watch']);
};
