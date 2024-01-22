const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('node:process');
const readline = require('node:readline');

const writeStream = fs.createWriteStream(
  path.resolve(__dirname, 'text.txt'),
  'utf-8',
);

stdout.write('Hello, how are you?\n');
stdout.write('Write a couple of lines!\n');
stdin.on('data', (data) => {
  if (data.toString().includes('exit')) {
    process.on('exit', () => stdout.write('exit?\nGood luck!'));
    process.exit();
  } else {
    writeStream.write(data, 'utf-8');
  }
});

process.on('SIGINT', () => {
  process.on('exit', () => stdout.write('CTRL + C?\nGood job!'));
  process.exit();
});
