const { ensureDBOpened, db } = require('../database')
const financialAnalystRole = require('../advisers/politicalEconomyReporter')
const translator = require('../advisers/translator')
const { containsChinese } = require('../utils')

const checkIfExist = async (href) => {
  return new Promise((resolve, reject) => {
    // 查询表中是否已经存在相同href的数据
    const sql = `SELECT COUNT(*) AS count FROM 'public-bank-china' WHERE href = ?`
    db.get(sql, [href], (err, row) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      resolve(row.count > 0)
    })
  })
}

const insertLine = ({
  href,
  title,
  content,
  sourceHtml,
  sourceType,
  publishTime,
  gptReport,
}) => {
  // 插入数据
  const stmt = db.prepare(
    `INSERT INTO 'public-bank-china' VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
  stmt.run(href, title, content, sourceHtml, sourceType, publishTime, gptReport)
  stmt.finalize()
}

module.exports = async (newsList) => {
  await ensureDBOpened()

  for (const news of newsList) {
    const { href, content } = news
    if (await checkIfExist(href)) continue

    if (!containsChinese(news.title)) {
      news.title = await translator(news.title, '，结尾不要有句号')
    }
    try {
      news.gptReport = await financialAnalystRole(content)
    } catch (e) {
      console.log(`获取gpt分析错误 ${e.message}`, news)
    }
    insertLine(news)
  }
}
