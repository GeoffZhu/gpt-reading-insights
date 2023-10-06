const { ensureDBOpened , db } = require('../database')
const financialAnalystRole = require('./advisers/financialAnalystRole')

const updateReport = (href, gptReport) => {
  // 更新数据
  const stmt = db.prepare(`UPDATE 'public-bank-china' SET gptReport = ? WHERE href = ?`);
  stmt.run(gptReport, href);
  stmt.finalize();
}

const updateNotReport = async () => {
  await ensureDBOpened()

  // 查询表中所有数据
  const sql = `SELECT * FROM 'public-bank-china'`;
  db.all(sql, async (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    // 逐条调用financialAnalystRole方法并更新数据
    for (const row of rows) {
      const { href, content, gptReport } = row;
      if (!gptReport) {
        try {
          const report = await financialAnalystRole(content)
          updateReport(href, report)
        } catch(e) {
          console.log(`获取gpt分析错误${e.message}`, row.href)
        }
      }
    }
  });
}

updateNotReport()