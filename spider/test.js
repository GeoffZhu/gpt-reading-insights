const spider = require('gz-spider');
const setData = require('../core');

globalThis.log = console.log

spider.setFetcher({ headless: false })
spider.setProcesser('treasuryUS', require('./treasuryUS'));

(async () => {
  for (let name of spider.getAllProcessers()) {
    log(`${name}-任务开始`);
    const newsList = await spider.getData(name)
    log(`${name}-爬取完成`);
    await setData(newsList);
    log(`${name}-入库完成`);
  }
})()
