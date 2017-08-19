const os = require('os');
const yuno = require('yunodb');
const _ = require('lodash');

const dbopts = {
  location: `${os.homedir()}/.hunt/db`,
  keyField: 'id',
  indexMap: ['text']
};

let db;

async function getDB() {
  return new Promise((rs, rj) => {
    if (db) {
      rs(db);
    } else {
      yuno(dbopts, (err, dbInstance) => {
        if (err) return rj(err);

        db = dbInstance;
        return rs(db);
      });
    }
  });
}

module.exports = {
  add: async (docs) => {
    if (!_.isArray(docs)) {
      docs = [docs];
    }

    let db = await getDB();
    return new Promise((rs, rj) => {
      console.log(docs);
      let stream = db.add((err) => {
        if (err) {
          rj(err);
        } else rs(true);
      });

      docs.forEach(d => stream.write(d));
      stream.end();
    });
  },

  search: async (query, limit) => {
    let db = await getDB();
    return db.search(query, {limit: limit || 100});
  },

  close: async () => {
    let db = await getDB();
    console.log('closing yunodb...');
    db.close();
  }
};
