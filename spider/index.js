const spider = require('gz-spider')
const setDataToDB = require('../backend/scripts/setDataToDB')

globalThis.log = console.log

spider.setFetcher({ headless: true })
spider.setProcesser('publicBankChina', require('./publicBankChina'))
spider.setProcesser('federalReserveBank', require('./federalReserveBank'))
spider.setProcesser('treasuryUS', require('./treasuryUS'))

;(async () => {
  for (let name of spider.getAllProcessers()) {
    log(`${name}-任务开始`)
    const data = await spider.getData(name)
    log(`${name}-爬取完成`)
    await setDataToDB(data)
    log(`${name}-入库完成`)
  }
  process.exit()
})()
