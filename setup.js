const fs = require('fs');
const package = require('./package.json');

const passedName = JSON.parse(process.env.npm_config_argv).remain[0];
const currDirName = process.env.PWD.split('/');

let dirName = passedName || currDirName[currDirName.length - 1];

package.name = dirName.toLowerCase();

fs.writeFileSync( './package.json', JSON.stringify(package, null , 2));
console.log(`Set "name" in package.json to ${package.name}`);
