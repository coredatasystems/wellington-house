module.exports = function(grunt) {

      grunt.initConfig({
            watch: {
                files: 'www/**/*.scss',
                tasks: ['sass']
            },
            sass: {
                options: {
                    sourceMap: true
                },
                dist: {
                    files: [{
                        expand: true,
                        src: ['www/stylesheets/scss/*.scss'],
                        dest: 'www/stylesheets',
                        flatten: true,
                        ext: '.css'
                    }]
                }
            },
            browserSync: {
                dev: {
                    bsFiles: {
                        src: [
                            'www/**',
                            '!www/**/*.map',
                            '!www/**/*.scss'
                        ]
                    },
                    options : {
                        server: {
                            baseDir: './www/'
                        },
                        watchTask: true,
                        injectChanges: false
                    }
                }
            }     
      });

      require('load-grunt-tasks')(grunt);

      grunt.registerTask('default', ['sass', 'browserSync', 'watch']);

};
