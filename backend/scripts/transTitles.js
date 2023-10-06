const { containsChinese } = require('../utils')
const { ensureDBOpened, db } = require('../database')
const translator = require('../advisers/translator')

const updateTitle = (href, gptReport) => {
  // 更新数据
  const stmt = db.prepare(
    `UPDATE 'public-bank-china' SET title = ? WHERE href = ?`
  )
  stmt.run(gptReport, href)
  stmt.finalize()
}

const updateEnglishTitle = async () => {
  await ensureDBOpened()

  // 查询表中所有数据
  const sql = `SELECT * FROM 'public-bank-china'`
  db.all(sql, async (err, rows) => {
    if (err) {
      console.error(err)
      return
    }

    for (const row of rows) {
      const { href, title } = row
      if (!containsChinese(title)) {
        try {
          const zhTitle = await translator(title)
          updateTitle(href, zhTitle)
        } catch (e) {
          console.log(`获取gpt分析错误 ${e.message}`, row.href)
        }
      }
    }
  })
}

updateEnglishTitle()
