const { ensureDBOpened , db } = require('../database')
const financialAnalystRole = require('../advisers/politicalEconomyReporter')

const updateReport = (href, gptReport) => {
  // 更新数据
  const stmt = db.prepare(`UPDATE 'public-bank-china' SET gptReport = ? WHERE href = ?`);
  stmt.run(gptReport, href);
  stmt.finalize();
}

const updateNotReport = async () => {
  await ensureDBOpened()

  // 计算7天前的日期
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 将日期转换为TIMESTAMP格式（Unix时间戳）
  const sevenDaysAgoTimestamp = sevenDaysAgo.getTime();

  // 查询表中所有数据
  const query = `
    SELECT * FROM 'public-bank-china'
    WHERE publishTime >= ?
  `;
  db.all(query, sevenDaysAgoTimestamp, async (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    // 逐条调用financialAnalystRole方法并更新数据
    for (const row of rows) {
      console.log(`current: ${rows.indexOf(row) + 1}, total: ${rows.length}`)
      const { href, content, gptReport } = row;
      // if (!gptReport) {
        try {
          const report = await financialAnalystRole(content)
          updateReport(href, report)
        } catch(e) {
          console.log(`获取gpt分析错误${e.message}`, row.href)
        }
      // }
    }
  });
}

updateNotReport()