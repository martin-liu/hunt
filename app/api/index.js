const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body')({ multipart: true });
const fs = require('fs');
const app = new Koa();
const os = require('os');
const path = require('path');

const util = require('./util');

router
  .get('/', async (ctx) => {
    ctx.body = {a: 'come on'};
  })
// file upload handler
  .post('/resume', koaBody, async (ctx) => {

    const file = ctx.request.body.files.file;
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
    reader.pipe(stream);
    console.log('uploading %s -> %s', file.name, stream.path);

    let text;
    try {
      text = await new Promise((rs, rj) => {
        stream.on('finish', () => {
          util.extractText(util.getMime(file.name), stream.path)
            .then(rs)
            .catch(rj);
        })
          .on('error', rj);
      });
    } catch (e) {
      return ctx.throw(e);
    }

    return ctx.body = text;
  });

app.use(router.routes());

// listen
app.listen(3000);
console.log('listening on port 3000');
