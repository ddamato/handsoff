import nunjucks from 'nunjucks';
import { readFileSync } from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import database from '../../../gen/database.json';

const md = new MarkdownIt({ html: true });
const readmeContent = readFileSync(path.resolve(__dirname, '..', '..', '..', 'README.md'), 'utf-8');
const readme = md.render(readmeContent);
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
    tagList: Object.keys(database).sort(),
    content,
    readme,
  });
}
