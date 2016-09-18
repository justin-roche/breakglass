#!/usr/bin/env node

//shebang(#) makes it an executable script in the command line

var fs = require('fs');
var spawn = require('child_process').spawn;

function breakGlass(){

  var htmlFileName = '/fastIndex.html';
  //the names of the scripts
  var scriptNames = ""; 

  //the script tags
  var scripts = "";

  var directory = process.cwd(); 

  //the input command [filename | undefined]
  var command = process.argv.slice(2)[0];

  //if a command is provided and it is a .js filename, add it to the scripts
  if(command && isJsFileString(command)){
    scripts = `<script src="${command}"></script>`;
    scriptNames = command;
  }

  //if no command, add references to all detected .js files in the newly created index html
  if(!command){
    //get all files
    var files = fs.readdirSync(directory);
    //filter to only .js
    jsFiles = files.filter(function(name){
      return isJsFileString(name);
    })
    //create script reference for each file
    jsFiles.forEach(function(fileName){
      var script = `<script src="${fileName}"></script>`;
      scriptNames = scriptNames + '  ' + fileName;
      scripts = scripts + '\n' + script;
      
    });

  } 

  htmlString = getTemplate(scriptNames,scripts);

  //test whether a file is a .js file
  function isJsFileString(name){
    return name.slice(name.length-3) === '.js';
  }

  //create the file in the current directory
  fs.writeFile(directory+htmlFileName, htmlString, function(err) {
      if(err) {
        console.log('an error');
          return console.log(err);
      }
      
      console.log("The file" + htmlFileName +" was saved!");
      spawn('open', [directory+htmlFileName]);
  }); 

  //fill the template string with the scripts tag and script names
  function getTemplate(scriptNames,scripts){

    var htmlString = `<!DOCTYPE>
      <html>
        
        <head>
          <meta charset="UTF-8">
          
        </head>

      <body >
        <h1> Scripts Running</h1>
        <p> ${scriptNames} </p>


        ${scripts}

      </body>
      
      </html>`;

    return htmlString;
  }

}

module.exports = breakGlass();

/*command: breakglass (creates index file that references the scripts and opens chrome on index and sublime for them)*/