const spider = require('gz-spider')
const setDataToDB = require('../backend/scripts/setDataToDB')

globalThis.log = console.log

spider.setFetcher({ headless: false })
spider.setProcesser('publicBankChina', require('./publicBankChina'))
spider.setProcesser('federalReserveBank', require('./federalReserveBank'))
spider.setProcesser('treasuryUS', require('./treasuryUS'))
spider.setProcesser('openAI', require('./openai'))

;(async () => {
  log(new Date().toString())
  for (let name of spider.getAllProcessers()) {
    log(`${name}-任务开始`)
    let data
    try {
      data = await spider.getData(name)
      log(`${name}-爬取完成`)
    } catch(e) {
      log(`${name}-爬取失败`, e)
    }
    if (data) {
      await setDataToDB(data)
      log(`${name}-入库完成`)
    }
  }
  process.exit()
})()
