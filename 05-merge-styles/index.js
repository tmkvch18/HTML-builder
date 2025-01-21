const fs = require('fs');
const { readdir, readFile } = require('fs/promises');
const path = require('path');
const srcPath = path.join(__dirname, 'styles');
const projectDistPath = path.join(__dirname, 'project-dist', 'bundle.css');
const stream = fs.createWriteStream(projectDistPath, 'utf-8');

async function createCSS() {
  try {
    const files = await readdir(srcPath, {
      withFileTypes: true,
    });

    for (const file of files) {
      if (path.extname(file.name) === '.css') {
        const css = await readFile(path.join(srcPath, file.name), 'utf-8');
        stream.write(`${css}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

createCSS();
