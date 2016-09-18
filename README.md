# breakglass
an executable script that creates an index.html in the current directory. All .js files in the current directory are loaded as scripts of the newly created .html file. The .html is then opened with default web browser. 

# installation and use
-open the directory in terminal and run 'npm install . -g'
-the script should now be available everywhere using the command $breakglass
-if provided an argument of the form filename.js, it will initialize the newly created index.html to load only that script

# issues
-there is no -rm command, to remove the new index.html file you will have to remove it manually



