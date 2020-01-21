import nunjucks from 'nunjucks';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const template = readFileSync(resolve(__dirname, '..', 'templates', 'index.html'), 'utf-8');
const renderTemplate = nunjucks.compile(template);

export default async function render(ctx) {
  ctx.body = renderTemplate.render({
    base: ctx.state.base,
  });
}
