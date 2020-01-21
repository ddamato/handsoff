import Router from 'koa-router';

export default new Router().post('/api', (ctx) => {
  console.log(ctx);
});
