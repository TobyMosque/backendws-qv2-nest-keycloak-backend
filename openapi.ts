import { copyFile } from 'fs';
import { promisify } from 'util';

const copyFileAsync = promisify(copyFile);

async function main() {
  await copyFileAsync('./swagger.json', '../api/swagger.json');
}

export default main();
