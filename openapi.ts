import { copyFile, readFile, writeFile } from 'fs';
import { promisify } from 'util';

const copyFileAsync = promisify(copyFile);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

async function updateJson({ file = '', content = {}, map = (data) => data }) {
  const buffer = await readFileAsync(file, 'utf8');
  const json = buffer.toString();
  const data = JSON.parse(json);

  Object.assign(map(data), content);
  await writeFileAsync(file, JSON.stringify(data, null, 2));
}

async function main() {
  await copyFileAsync('./swagger.json', '../api/swagger.json');
  await updateJson({
    file: '../api/tsconfig.json',
    content: {
      target: 'es6',
      module: 'es6',
      moduleResolution: 'node',
    },
    map: (data) => data.compilerOptions,
  });
  await updateJson({
    file: '../api/package.json',
    content: {
      type: 'module',
    },
  });
}

export default main();
