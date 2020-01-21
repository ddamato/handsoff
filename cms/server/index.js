import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static-server';
import { resolve } from 'path';

import router from './router.js';
import render from './middleware/render.js';

const port = 9000;
const app = new Koa();

app.use(serve({
  rootDir: resolve(__dirname, '..', 'client-src'),
  rootPath: '/static',
}));

app.use((ctx, next) => {
  ctx.state.base = '';
  return next();
});

app.use(bodyParser());
app.use(router.routes());
app.use(render);

app.listen(port);
console.log(`Go to: http://localhost:${port}`);
