const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 创建SQLite3数据库连接
const db = new sqlite3.Database(path.join(__dirname, './database/sqlite.db'));

// 设置Express中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/recent-data', (req, res) => {
  // 计算7天前的日期
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 将日期转换为TIMESTAMP格式（Unix时间戳）
  const sevenDaysAgoTimestamp = sevenDaysAgo.getTime();

  // 查询数据库中最近7天的数据
  const query = `
    SELECT * FROM 'public-bank-china'
    WHERE publishTime >= ?
  `;

  db.all(query, sevenDaysAgoTimestamp, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // 将查询结果以JSON格式返回
    res.json({ data: rows.sort((a, b) => b.publishTime - a.publishTime)});
  });
});

// 启动Express应用程序
const port = 3001
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
