#!/usr/bin/env node

//shebang(#) makes it an executable script in the command line

var fs = require('fs');
var spawn = require('child_process').spawn;

//functions modify this settings variable
var settings = {
    htmlFileName: '/_specRunner.html',
    specFileName: '/_spec.js',
    creationDirectory: process.cwd(),
    targetDirectories: [process.cwd()],
    commandMode: '-fl',       //default command mode is flat (not recursive)
    createdFiles: [],         //saves filepath of created files
    commandOptions: [],       //includes (--mocha) to create spec file
    targetFiles: [],          //file paths of .js files to test
  };

function breakGlass() {
  getArgs();

  if(settings.commandMode === '-rm'){   //deletion
    removeFiles();
  } else {                              //creation
    getDirectories();                   //produce a list of all directories
    getFiles();                         //get the files in those directories
  
    if(settings.commandOptions.indexOf("--mocha") !== -1){
      makeSpecString();                 //apply the templating for a _spec file
      writeSpecFile();  
      settings.targetFiles.push(settings.creationDirectory + settings.specFileName); //!should be async after file creation
      makeScriptsString();
      makeMochaHtmlString();                
    } else {
      makeScriptsString();                //apply the templating for the scripts in the html
      makeHtmlString();
    }

    writeIndex();                       //write the specRunner file
    //flagForIgnore();
  }
  
}

function removeFiles(){
  var targets = [settings.creationDirectory + settings.htmlFileName, settings.creationDirectory + settings.specFileName];

  targets.forEach(function(path){
    fs.unlink(path, function(err) {               
      if (err) {
        //error occurs if either of the files don't exist
      } else {
        console.log(`${nameFromPath(path)} deleted successfully!`);
      }
    });
  });
}

function getArgs(){
  var args = process.argv.slice(2);

  args.forEach(function(c){

    //if it is a command mode
    if(c[0]==="-" && c[1] !== "-"){
      settings.commandMode = c; 
    }

    //if it is a command option...
    else if(c[0]==="-" && c[1] === "-"){     
      if(typeof settings.commandOptions === 'undefined'){
        settings.commandOptions = [];
      }
      settings.commandOptions.push(c);
    }

    //if it is a filename
    else if(isJsFileString(c)){
      if(typeof settings.targetFiles === 'undefined'){
        settings.targetFiles = [];
      }
      settings.targetFiles.push(c);         
    }  
    
    //if it is a directory name
    else if (isDirectory(c)) {
        if(typeof settings.targetDirectories === 'undefined'){
          settings.targetDirectories = [];
        }
        settings.targetDirectories.push(c);
    }  

    //if none of the above, throw error
    else {
        throw new Error('invalid argument: use [dir | file | -mode | --option]');
      }
  });
    
}

///////////////////FILE NAVIGATION/GETTING FILES

function getDirectories(){
  //if not recursive mode
  if(settings.commandMode === '-fl'){

  } 
  //if recursive mode, recurse
  if(settings.commandMode === '-r'){
    recurseDirectories(settings.targetDirectories)
  }
}

function recurseDirectories(directories){
  //breadth-first search
  var queue = directories;

  while(queue.length > 0){
    var dir = queue.pop();
    var containedDirs = getSubDirectories(dir);       //saved as paths
    queue = containedDirs.concat(queue);
    settings.targetDirectories.push(dir);       
  }

}

function getSubDirectories(directory){
  var containedPaths = fs.readdirSync(directory).map(function(name){
    //everything is stored as complete directory name
    return directory + '/' + name; 
  })
  
  //filter only directories
  return containedPaths.filter(function (path) {
    return isDirectory(path);
  });
  

}

function getFiles(){      //simple iteration, calls getFilesInDirectory for each directory
  settings.targetDirectories.forEach(function(dir){
    settings.targetFiles = settings.targetFiles.concat(getFilesInDirectory(dir));
  });
}

function getFilesInDirectory(directory){    //get files in one directory
  return fs.readdirSync(directory).map(function(name){
    return directory + '/' + name;
  }).filter(function (name) {
    return isJsFileString(name);
  });
}


///////////////////STRING TEMPLATING


function makeScriptsString(){       
    settings.scriptsString = "";
    settings.targetFiles.forEach(function (path) {
      var script = `<script src="${path}"></script>`;
      settings.scriptsString += ('\n' + script);
    });
}

//fill the template string with the scripts tag and script names
function makeMochaHtmlString() {     //!presently includes all mocha script tags, etc, even 
  var scripts = settings.scriptsString;
  var specfile = settings.creationDirectory + '/' + settings.specFileName;

  var htmlString = `<!DOCTYPE>
    <html>
     
      <head>
        <meta charset="UTF-8">
        <link href='https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css' rel='stylesheet' />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
        <script src='https://cdn.rawgit.com/chaijs/chai/2.3.0/chai.js'></script>
        <script src='https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js'></script>
        <script>mocha.setup('bdd')</script>
        
        ${scripts}

        <script>
          var assert = chai.assert,  
          expect = chai.expect,
          should = chai.should();
          $(function() {
            mocha.run();
          })
        </script>

      </head>

    <body >
      <div id="mocha"></div>
    </body>

    </html>`;

  settings.htmlString = htmlString;
}

function makeHtmlString() {     
  var scripts = settings.scriptsString;
  var specfile = settings.creationDirectory + '/' + settings.specFileName;

  var htmlString = `<!DOCTYPE>
    <html>
     
      <head>
        <meta charset="UTF-8">
        
        ${scripts}

      </head>

    <body >
      
    </body>

    </html>`;

  settings.htmlString = htmlString;
}


function makeSpecString(){

  var str = "";

  var describeEnd = "}); \n\n"
  var expectStart = "  it('should ', function() { \n";
  var expectEnd = "  })"; 
  var spacer = "\n\n\n\n";

  settings.targetFiles.forEach(function(file){
    str += "describe(\'" + nameFromPath(file) + "\'" +", function() { \n" + spacer + expectStart + spacer +expectEnd + spacer + describeEnd; 
  });

  settings.specString = str; 

}


///////////////////FILE CREATION

function writeSpecFile(){
  fs.writeFile(settings.creationDirectory + settings.specFileName, settings.specString, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file" + settings.specFileName + " was saved!");
      spawn('open', [settings.directory + settings.specFileName]); //!not opening
    }
  });

}

function writeIndex(){
  fs.writeFile(settings.creationDirectory + settings.htmlFileName, settings.htmlString, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file" + settings.htmlFileName + " was saved!");
      spawn('open', [settings.creationDirectory + settings.htmlFileName]);
    }
  });
}

///////////////////UTILITIES

function nameFromPath(path){
  return path.split('/').reverse()[0];
}

//test whether a file is a .js file
function isJsFileString(name) {
  return name.slice(name.length - 3) === '.js';
}

  // test whether Command line argument is a directory
function isDirectory(name) {
  return fs.statSync(name).isDirectory()
}

function flagForIgnore(){ //!

}

//makes into a node module
module.exports = breakGlass();
