const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const path = require('path');
const filePath = path.resolve(__dirname, 'files');

async function createDir() {
  try {
    const copyDirPath = `${filePath}-copy`;

    await rm(copyDirPath, { force: true, recursive: true });
    await mkdir(copyDirPath, {
      recursive: true,
    });

    const files = await readdir(filePath, { withFileTypes: true });

    for (const file of files) {
      // console.log(filePath, file.name)
      await copyFile(
        path.join(filePath, file.name),
        path.join(copyDirPath, file.name),
      );
    }
  } catch (error) {
    console.error(error);
  }
}

createDir();
