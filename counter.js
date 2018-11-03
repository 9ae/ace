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
    // if (item === 'README.md') continue;
    countWords(dirname+"/", item);
  }
}

countDir('chapters');
countDir('drabbles');
countDir('world');
results.push('\n**TOTAL = '+total+"**\n\n");

var all = results.join('\n');

// Append to logfile
if (process.argv.includes('log')) {
  fs.appendFile(
    'notes/nanowrimo.md',
    all,
    'utf8',
    function(err){ if (err) console.log(err) }
  )
  console.log('append to log file')
}

// Update wordcount on nanowrimo
if (process.argv.includes('send')) {
  var key = process.env.NANO_KEY;
  var user = process.env.NANO_USR;
  if (!key || !user) {
    console.log('missing env vars'); return;
  }
  if (!total) return;

  var sha1 = require('sha1');
  var req = require('request');

  var url = 'https://nanowrimo.org/api/wordcount';
  var combo = key + user + total;
  var hash = sha1(combo);
  var data = {
      hash: hash,
      name: user,
      wordcount: total
    };

  console.log(data);

  req.put(
    { url: url,
      formData: data
    }
  , function (error, response, body) {
      if(response.statusCode == 200){
        console.log('updated nano word count');
      } else {
        console.log('error: '+ response.statusCode)
        console.log(body)
      }
    }
  )
}

console.log(all);
