# breakglass
A command line tool for creating mocha specs and html files from directories of existing javascript files. All .js files in the current directory are loaded as scripts of the newly created .html file. The .html is then opened with the default web browser.

# installation and use
open the directory in terminal and run 'npm install . -g'. The script should now be available everywhere using the command $breakglass.

Breakglass can accept three types of command line arguments:

#$breakglass [ -r | -rm | --mocha ] 

1. If provided no arguments it will create an html file called _specRunner.html that loads all .js files in the current directory

2. If provided the -r flag the created _specRunner file will load all .js files in the current directory and in subdirectories, recursively.

3. If provided the --mocha flag, it will create, in addition to the _specRunner file, a _spec.js file with prewritten describe and it statements based on the included .js files. The required dependencies are added to the _specRunner file.

4. If provided the -rm argument, it will delete any previously created _spec.js and _specRunner files  

# issues
1. .gitignore flags are not set by breakglass. Run breakglass -rm to remove files before commiting. 




