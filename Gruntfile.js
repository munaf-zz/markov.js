module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>.js\nMunaf Assaf (http://github.com/munaf)\nBuilt <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true
      },
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);

};