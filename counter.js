/*
@author: mienaikoe
*/

const fs = require('fs');
const wordcount = require('wordcount');


var total = 0;

function countWords(path, filename ){
  var file = fs.readFileSync(path + filename, "utf8");
  var count = wordcount(file);
  total += count;
  let tabs = "\t";
  console.log(`${filename}:${tabs}${count} words`);
}

function countDir(dirname) {
  let items = fs.readdirSync("./"+dirname)
  for( let ix in items ){
    let item = items[ix];
    if (item === 'README.md') continue;
    countWords(dirname+"/", item);
  }
}

countDir('chapters');
countDir('drabbles');
console.log('TOTAL = '+total);
