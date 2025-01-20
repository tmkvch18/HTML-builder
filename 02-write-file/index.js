const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const { stdin, stdout } = process;
const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(filePath, 'utf-8');
const rl = createInterface({
  input: stdin,
  output: stdout,
});

function finalize(type) {
  stdout.write(`${type} | Good luck! Have fun!`);
  rl.close();
  process.exit();
}

stdout.write('Hello! Enter text:\n');
// rl.prompt();

rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    finalize('EXIT');
  } else {
    stream.write(`${line}\n`);
    // rl.prompt();
  }
});

rl.on('SIGINT', () => finalize('CTRL + C'));
