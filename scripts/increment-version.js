/* eslint-disable @typescript-eslint/no-var-requires */
// const { Command } = require('commander');
// // console.log(JSON.stringify(commander, null, 2));
// const program = new Command();


// // commander.program.version('0.0.1');
const fs = require('fs');
const readline = require('readline');
const process = require('process');
const bumpVersion = require('semver-increment');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let package = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
let fvttModule = JSON.parse(fs.readFileSync('./static/module.json', { encoding: 'utf8' }));
const previousVersion = fvttModule.version;

rl.question('Which version to increment? 1: Major - 2: Minor - 3: Patch\n', function(answer) {
  const version = incrementVersion(answer);
  updateDownloadLink(version);

  rl.question('Does this new version contain a notice? yes/no\n', function (answer) {
    switch(answer) {
    case 'yes':
    case 'y':
      addVersionToNoticesList(version);
      break;
    }

    writeToFile();
    rl.close();
  });
});

function incrementVersion(answer) {
  let major = 0;
  let minor = 0;
  let patch = 0;
  const mask = [major,minor,patch];

  switch(answer) {
  case '1':
    major = 1;
    break;

  case '2':
    minor = 1;
    break;

  case '3':
    patch = 1;
    break;
  }

  const newVersion = bumpVersion(mask, fvttModule.version);
  package.version = newVersion;
  fvttModule.version = newVersion;

  return newVersion;
}

function updateDownloadLink(newVersion) {
  let link = fvttModule.download;
  link = link.replace(previousVersion, newVersion);
  fvttModule.download = link;
  console.log(link, link.includes(previousVersion))
}

function addVersionToNoticesList(newVersion) {
  fvttModule.versionsWithNotices.push(newVersion);
}

function writeToFile() {
  fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
  fs.writeFileSync('./static/module.json', JSON.stringify(fvttModule, null, 2));
}
