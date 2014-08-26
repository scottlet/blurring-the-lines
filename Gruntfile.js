/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*global require:false, module:false*/
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    'use strict';
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    'use strict';
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        watch: {
            self: {
                files: ['Gruntfile.js'],
                tasks: ['jshint','build'],
                options: {livereload: true}
            },
            css: {
                files: ['examples/css/**/*.css'],
                options: {livereload: true}
            },
            sass: {
                files: ['src/sass/**'],
                tasks: ['compass']
                
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['copy:html'],
                options: {livereload: true}
            },
            js: {
                files: ['src/**.js'],
                tasks: ['jshint', 'uglify', 'copy:js'],
                options: { livereload: true }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/js/*.js'
            ]
        },
        uglify: {
            options: {
                beautify: false, /* Swap these two to get uncompressed pretty output */
                mangle: true,
                preserveComments: 'some'
                /*,
                preserveComments: 'some'*/
            },
            component: {
                files: {
                    'jq.akaccordion.min.js' : ['src/js/akaccordion.js']
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'examples')
                        ];
                    }
                }
            }
        },
        copy: {
            js: {
                files: [
                    {
                        expand:true,
                        src:['jq.akaccordion.min.js'], 
                        dest:'examples/js/'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand:true,
                        cwd:'src',
                        src:['fonts/*'], 
                        dest:'examples/'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand:true,
                        cwd:'src',
                        src:['*.html'], 
                        dest:'examples/'
                    }
                ]
            }
        },
        compass: {
            all: {
                options: {
                    httpPath: '/',
                    cssDir: "examples/css",
                    sassDir: "src/sass",
                    imagesDir: "src/images",
                    javascriptsDir: "examples/js",
                    fontsDir: "../fonts/",
                    httpFontsPath: "../fonts",
                    outputStyle: "compressed",
                    lineComments: false,
                    colorOutput: false
                }
            }
        }
    });
    
    grunt.registerTask('build', ['jshint', 'uglify', 'copy']);
    grunt.registerTask('server', ['build','connect:livereload','watch']);
};
