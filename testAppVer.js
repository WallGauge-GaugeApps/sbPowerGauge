const fs =      require("fs");

var appVer = (JSON.parse(fs.readFileSync('package.json'))).version;
//appVer = appVer.version;
console.log ('vversion = ' + appVer);