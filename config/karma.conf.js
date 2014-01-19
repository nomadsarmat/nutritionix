module.exports = function(config){
   config.set({
      basePath : '../',

      files : [
         'assets/lib/jquery-2.0.3.min.js',
         'test/lib/angular/angular.js',
         'test/lib/angular/angular-route.js',
         'test/lib/firebase/firebase-debug.js',
         'test/lib/firebase/firebase-simple-login.js',
         'test/lib/firebase/angularfire.js',
         'test/lib/angular/angular-mocks.js',
         'assets/js/**/*.js',
         'assets/lib/**/*.js',
         'assets/config/config.js',
         'test/unit/**/*.js'
      ],

      autoWatch : true,

      frameworks: ['jasmine'],

      browsers : ['Chrome'],

      plugins : [
         'karma-junit-reporter',
         'karma-chrome-launcher',
         'karma-firefox-launcher',
         'karma-jasmine'
      ],

      junitReporter : {
         outputFile: 'test_out/unit.xml',
         suite: 'unit'
      }

   })}
