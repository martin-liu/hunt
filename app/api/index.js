const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body')({ multipart: true });
const fs = require('fs');
const app = new Koa();
const os = require('os');
const path = require('path');
const JSONStream = require('JSONStream');

const util = require('./util');
const DB = require('./db');
const Resume = require('./resume');

const logger = require('electron-log');

logger.info("starting koa...");

router
  .get('/search/:query', async (ctx) => {
    let stream = await DB.search(ctx.params.query.trim());
    ctx.set('Content-Type', 'application/json');
    ctx.body = stream.pipe(JSONStream.stringify());
  })
  .get('/resume/:id', async (ctx) => {
    ctx.body = await DB.get(ctx.params.id);
  })
  .delete('/resume/:id', async (ctx) => {
    ctx.body = await DB.delete(ctx.params.id);
  })
// file upload handler
  .post('/resume', koaBody, async (ctx) => {

    const file = ctx.request.body.files.file;
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
    reader.pipe(stream);
    logger.info('uploading %s -> %s', file.name, stream.path);

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

      let resume = await Resume.process(text);
      if (resume && resume.id) await DB.add(resume);
    } catch (e) {
      return ctx.throw(e);
    }

    return ctx.body = text;
  });

app.use(router.routes());

// listen
let _server = app.listen(3000);
logger.info("started koa on port 3000!");

module.exports = {
  close: async () => {
    _server.close();
    return await DB.close();
  }
};
