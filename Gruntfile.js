module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            sass: {
                files: ['www/**', '!www/output/**', '!www/content/stylesheets/', '!www/tmp/**'],
                tasks: ['sass', 'autoprefixer', 'shell']
            }
        },
        shell: {
            options: {
                stderr: false
            },
            target: {
                command: 'cd www && nanoc'
            }
        },
        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'www',
                    src: ['scss/*.scss'],
                    flatten: true,
                    dest: 'www/content/stylesheets',
                    ext: '.css'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions'],
                map: true // Update source map (creates one if it can't find an existing map)
            },

            // Prefix all files
            multiple_files: {
                src: 'www/scss/*.css'
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'www/output/**'
                    ]
                },
                options : {
                    server: {
                        baseDir: './www/output'
                    },
                    watchTask: true,
                    injectChanges: false
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['sass', 'autoprefixer', 'browserSync', 'watch']);

};
