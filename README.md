# breakglass
an executable script that creates an index.html in the current directory. All .js files in the current directory are loaded as scripts of the newly created .html file. The .html is then opened with default web browser.

# installation and use
open the directory in terminal and run 'npm install . -g'. The script should now be available everywhere using the command $breakglass.

breakglass can accept two types of command line arguments.

## 1. If provided an argument of the form filename.js, it will initialize the newly created index.html to load only that script

Example:

`breakglass filename.js`

## 2. If provided a sub-directory of the current working directory, breakglass will create a new index.html with all files in that sub directory.

Example:

File structure:
| mainDirectory/
  | subDirectory/
    | app.js
    | test.js

Calling the below command from mainDirectory will load all js scripts in the subDirectory.

`breakglass subDirectory`


# issues
There is no -rm command, to remove the new index.html file you will have to remove it manually



