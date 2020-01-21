import nunjucks from 'nunjucks';
import { readFileSync } from 'fs';
import path from 'path';
import database from '../../../gen/database.json';

const template = readFileSync(path.resolve(__dirname, '..', 'templates', 'index.html'), 'utf-8');
const renderTemplate = nunjucks.compile(template);

export default async function render(ctx) {
  const tagName = path.basename(ctx.request.url);
  let content = null;
  if (database[tagName]) {
    content = { name: tagName, ...database[tagName] };
  }
  ctx.body = renderTemplate.render({
    base: ctx.state.base,
    tagList: Object.keys(database),
    content,
  });
}
