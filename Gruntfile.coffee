module.exports = (grunt) ->
    grunt.initConfig
        watch:
            coffee:
                files: [
                    'src/**/*.js.coffee'
                ]
                tasks: ['coffee:main']
        karma:
            watch:
                configFile: 'config/karma.conf.js'
            jenkins:
                configFile: 'config/jenkins.karma.conf.js'
            coverage:
                configFile: 'config/coverage.karma.conf.js'
        coffee:
            main:
                expand: true
                flatten: false
                cwd: 'src'
                src: ['**/*.coffee']
                dest: 'app/js'
                ext: '.js'

        #exec:
        #    frontend_sdk_docs:
        #        cmd: ->
        #            cwd = process.cwd()
        #            cmd = [
        #                cwd + '/node_modules/codo/bin/codo'
        #                '-o docs/frontend/'
        #                '-r docs-readme.md'
        #                'static-src/'
        #            ]
        #            return cmd.join ' '
        #    frontend_internal_docs:
        #        cmd: ->
        #            cwd = process.cwd()
        #            cmd = [
        #                cwd + '/node_modules/codo/bin/codo'
        #                '-o docs/frontend-internal/'
        #                '-r docs-readme.md'
        #                '--private true'
        #                'static-src/'
        #            ]
        #            return cmd.join ' '


    # register the task
    grunt.loadNpmTasks 'grunt-contrib-watch'
    #grunt.loadNpmTasks 'grunt-karma'
    #grunt.loadNpmTasks 'grunt-docco'
    grunt.loadNpmTasks 'grunt-contrib-coffee'

    #grunt.registerTask 'build-styledocco', [
    #    'copy:main_ui_img'
    #    'copy:new_glyphicons_fonts'
    #    'exec:egstyle_docs'
    #]

    #grunt.registerTask 'build-datavisapp', [
    #    'mince:datavisapp'
    #    'ngtemplates:datavisapp'
    #    'uglify:datavisapp'
    #]

    #grunt.registerTask 'demo-prod-build', [
    #    'less'
    #    'copy:glyphicons_fonts'
    #    'copy:glyphicons_css'
    #    'copy:visualsearch_css'
    #    'copy:main_ui_img'
    #    'build-datavisapp'
    #]

    grunt.registerTask 'default', ['coffee']
    grunt.registerTask 'test', ['karma:watch']
    grunt.registerTask 'cover', ['karma:coverage']
