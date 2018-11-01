/*
@author: mienaikoe
*/

const fs = require('fs');
const wordcount = require('wordcount');


var total = 0;
var results = [new Date().toLocaleString()];

function countWords(path, filename ){
  var file = fs.readFileSync(path + filename, "utf8");
  var count = wordcount(file);
  total += count;
  let tabs = "\t";
  results.push(`* ${filename}:${tabs}${count} words`);
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
results.push('\n**TOTAL = '+total+"**\n\n");

var all = results.join('\n');
fs.appendFile(
  'notes/nanowrimo.md',
  all,
  'utf8',
  function(err){ if (err) console.log(err) }
)

console.log(all);
