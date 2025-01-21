const fs = require('fs');
const { readdir, readFile, mkdir, rm, copyFile } = require('fs/promises');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const projectDistPath = path.join(__dirname, 'project-dist');
// const stream = fs.createWriteStream(projectDistPath, 'utf-8');

init();

async function createDirectories() {
  try {
    const directories = await readdir(assetsPath, { withFileTypes: true });

    for (const dir of directories) {
      if (dir.isDirectory()) {
        const newDir = path.join(projectDistPath, 'assets', dir.name);
        await mkdir(path.join(newDir), {
          recursive: true,
        });

        copyFilesAssets(newDir, dir.name);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function copyFilesAssets(newDir, nameDir) {
  try {
    const files = await readdir(path.join(assetsPath, nameDir), {
      withFileTypes: true,
    });
    for (const file of files) {
      // console.log(filePath, file.name)
      await copyFile(
        path.join(assetsPath, nameDir, file.name),
        path.join(newDir, file.name),
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function createCSS() {
  try {
    const files = await readdir(stylesPath, {
      withFileTypes: true,
    });

    const stream = fs.createWriteStream(
      path.join(projectDistPath, 'style.css'),
      'utf-8',
    );

    for (const file of files) {
      if (path.extname(file.name) === '.css') {
        const css = await readFile(path.join(stylesPath, file.name), 'utf-8');

        stream.write(`${css}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function createHTML() {
  try {
    const templatePath = path.resolve(__dirname, 'template.html');

    const stream = fs.createWriteStream(
      path.join(projectDistPath, 'index.html'),
      'utf-8',
    );

    let html = await readFile(templatePath, 'utf-8');

    const components = await readdir(componentsPath, {
      withFileTypes: true,
    });

    // const streamComponents = fs.createWriteStream(
    //   path.join(projectDistPath, 'components'),
    //   'utf-8',
    // );

    for (const component of components) {
      if (component.isFile()) {
        const componentExt = path.extname(component.name);
        const componentName = path.basename(component.name, componentExt);

        if (html.includes(`{{${componentName}}}`)) {
          const regex = new RegExp(`{{${componentName}}}`, 'g');
          const componentString = readFile(
            path.join(componentsPath, component.name),
            'utf-8',
          );

          html = html.replace(regex, (await componentString).toString());
        }
      }
    }

    stream.write(html);
  } catch (error) {
    console.error(error);
  }
}

async function init() {
  await rm(projectDistPath, { force: true, recursive: true });
  await mkdir(path.join(projectDistPath, 'assets'), {
    recursive: true,
  });

  await createDirectories();
  await createCSS();
  await createHTML();
}
