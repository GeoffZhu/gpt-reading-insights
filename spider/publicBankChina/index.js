const OPEN_PAGE_TIME_OUT = 60000

module.exports = async (fetcher) => {
  await fetcher.page.goto(
    `http://www.pbc.gov.cn/goutongjiaoliu/113456/113469/index.html`,
    {
      timeout: OPEN_PAGE_TIME_OUT,
    }
  )

  const newsList = await fetcher.page.evaluate(() => {
    const selector =
      '#\\31 1040 > div:nth-child(2) > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table a'
    const aElements = document.querySelectorAll(selector)

    return Array.from(aElements).map((a) => {
      return {
        href: a.href,
        title: a.innerHTML,
      }
    })
  })

  for (const news of newsList) {
    await fetcher.page.goto(news.href, {
      timeout: OPEN_PAGE_TIME_OUT,
    })

    const extraData = await fetcher.page.evaluate(() => {
      const contentDOM = document.querySelector('#zoom')
      const timeDOM = document.querySelector(
        '#\\31 0929 > div:nth-child(2) > div > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(4)'
      )
      const typeDOM = document.querySelector('#laiyuan')
      return {
        content: contentDOM.innerText,
        sourceHtml: contentDOM.innerHTML,
        sourceType: `中国人民银行-${typeDOM.innerText}`,
        publishTime: new Date(timeDOM.innerText).getTime(),
      }
    })

    Object.assign(news, extraData)
  }

  return newsList
}
