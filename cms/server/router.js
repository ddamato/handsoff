import Router from 'koa-router';
import path from 'path';
import fs from 'fs-extra';
import open from 'open';
import compile from '../../bin/compile.js';

const DATABASE_JSON_PATH = path.resolve(__dirname, '..', '..', 'gen', 'database.json');
const DIST_INDEX_PATH = path.resolve(__dirname, '..', '..', 'dist', 'index.html');

export default new Router()
  .post('/cms-api/:tag', updateDatabase)
  .get('/cms-compile', compileTags)
  .get('/cms-visit', visitSite);

function getDatabase() {
  try {
    return require(DATABASE_JSON_PATH);
  } catch (err) {
    compile();
    return getDatabase();
  }
}

function updateDatabase(ctx) {

  if (!ctx.database) {
    ctx.database = getDatabase();
  }

  const { body }  = ctx.request;
  if (ctx.database[ctx.params.tag]) {
    ctx.database[ctx.params.tag].value = body.value;
  }

  ctx.status = 200;
  ctx.body = JSON.stringify(body);
}

function writeFile(filePath, fileContents) {
  fs.ensureFileSync(filePath);
  fs.writeFileSync(filePath, fileContents, 'utf-8');
}

function compileTags(ctx) {
  if (!ctx.database) {
    ctx.database = getDatabase();
  }

  writeFile(DATABASE_JSON_PATH, JSON.stringify(ctx.database));
  compile();
  getDatabase();
  ctx.status = 200;
  ctx.body = JSON.stringify(ctx.database);
}

async function visitSite() {
  await open(DIST_INDEX_PATH);
}