const os = require('os');
const yuno = require('yunodb');
const through = require('through2');
const pumpify = require('pumpify');
const _ = require('lodash');
const logger = require('electron-log');

const dbopts = {
  location: `${os.homedir()}/.hunt/db`,
  keyField: 'id',
  indexMap: ['raw', 'time']
};

let db;

function processQueryString(query) {
  let quoted = /["']([^"']+?)['"]/gmi;
  let matchs = (query.match(quoted) || []).map(d => d.replace(/["']/g, ''));

  // remove quoted contents
  query = query.replace(quoted, '');

  let queries = query.split(' ').concat(matchs).filter(d => !!d).map(_.trim);

  return queries;
}

function processQuery(query, opts) {
  let searchOpts = _.defaults(opts, {});

  let queries = processQueryString(query);

  let naturalizedQueries = queries.map(d => db.preprocessor.naturalize(d)).filter(d => d && d.length);

  let q = {
    query: naturalizedQueries.map(d => ({
      AND: {
        '*': d
      }
    })),
    pageSize: searchOpts.limit || 1000
  };

  return {q, opts: searchOpts};
}

function customizeSearch(query, searchOpts, processQueryFunc) {
  let self = db;

  if (!processQueryFunc || !_.isFunction(processQueryFunc)) {
    processQueryFunc = processQuery;
  }

  let { q, opts } = processQueryFunc(query, searchOpts);

  let lookup = through.obj(function (data, enc, cb) {
    if (typeof data === 'string') data = JSON.parse(data.toString('utf8'));

    self.docstore.get(data.id, function (err, doc) {
      if (err) return cb(err);
      data.document = doc;
      return cb(null, data);
    });
  });

  return pumpify.obj(self.index.search(q, opts), lookup);
}

async function getDB() {
  return new Promise((rs, rj) => {
    if (db) {
      rs(db);
    } else {
      yuno(dbopts, (err, dbInstance) => {
        if (err) return rj(err);

        db = dbInstance;
        db.search = customizeSearch;
        return rs(db);
      });
    }
  });
}

module.exports = {
  get: async (key) => {
    let db = await getDB();
    return new Promise((rs, rj) => {
      db.get(key, (err, data) => {
        if (err) return rj(err);

        return rs(data);
      });
    });
  },

  add: async (docs) => {
    if (!_.isArray(docs)) {
      docs = [docs];
    }

    let db = await getDB();
    return new Promise((rs, rj) => {
      let stream = db.add((err) => {
        if (err) {
          rj(err);
        } else rs(true);
      });

      docs.forEach(d => stream.write(d));
      stream.end();
    });
  },

  delete: async (key) => {
    let db = await getDB();
    return new Promise((rs, rj) => {
      db.del(key, (err) => {
        if (err) return rj(err);

        return rs(true);
      });
    });
  },

  search: async (query, limit) => {
    let db = await getDB();
    return db.search(query, {limit: limit || 1000});
  },

  latest: async (time, limit) => {
    let db = await getDB();
    return db.search(time, {}, (time, opts) => {
      return {
        q: {
          query: {
            AND: {
              time: [{
                gte: time,
                lte: new Date().getTime()
              }]
            }
          }
        },
        opts: {
          ...opts,
          limit: limit || 1000
        }
      };
    });
  },

  close: async () => {
    let db = await getDB();
    logger.info('closing yunodb...');
    db.close(() => logger.info('closed yunodb!'));
  }
};
