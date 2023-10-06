const path = require('path');
const sqlite3 = require('sqlite3').verbose();
var nodeCleanup = require('node-cleanup');

const db = new sqlite3.Database(path.resolve(__dirname, './sqlite.db'));

const ensureDBOpened = (() => {
  let isReady = false
  return () => {
    return new Promise(resolve => {
      if (isReady) {
        resolve(db)
      } else {
        db.serialize(async () => {
          // 创建表
          db.run(`CREATE TABLE IF NOT EXISTS 'public-bank-china' (
            href TEXT PRIMARY KEY,
            title TEXT,
            content TEXT,
            sourceHtml TEXT,
            sourceType TEXT,
            publishTime TIMESTAMP,
            gptReport TEXT
          )`, () => {
            isReady = true
            resolve(db)
          });
        })
      }
    })
  }
})()

nodeCleanup(() => {
  db.close();
});

module.exports = {
  db,
  ensureDBOpened
}