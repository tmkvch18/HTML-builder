const { readdir, stat } = require('fs/promises');
const path = require('path');
const filePath = path.resolve(__dirname, 'secret-folder');

async function showOnlyFilesInfo() {
  try {
    const files = await readdir(filePath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const fileStat = await stat(path.join(filePath, file.name));
        const fileExt = path.extname(file.name);
        const fileName = path.basename(file.name, fileExt);
        const fileSize = fileStat.size / 1024;
        const output = `${fileName} - ${fileExt.slice(1)} - ${fileSize} KB`;

        // process.stdout.write(`${output}\n`);
        console.log(output);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

showOnlyFilesInfo();
