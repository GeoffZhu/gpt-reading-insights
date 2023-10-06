const OPEN_PAGE_TIME_OUT = 60000

module.exports = async (fetcher) => {
  await fetcher.page.goto(
    'https://www.federalreserve.gov/newsevents/pressreleases.htm',
    {
      timeout: OPEN_PAGE_TIME_OUT,
    }
  )

  await fetcher.page.waitForSelector(
    '#article > div.angularEvents.Press_Release.ng-scope > div.row.ng-scope > div.eventlist__event > p:nth-child(1) a'
  )

  const newsList = await fetcher.page.evaluate(() => {
    const selector =
      '#article > div.angularEvents.Press_Release.ng-scope > div.row.ng-scope'
    const dom = document.querySelectorAll(selector)
    return Array.from(dom).map((item) => {
      const link = item.querySelector('div.eventlist__event > p:nth-child(1) a')
      const type = item.querySelector('div.eventlist__event > p:nth-child(2)')
      const time = item.querySelector('div.eventlist__time')

      return {
        href: link.href,
        title: link.innerText,
        sourceType: `美联储-${type.innerText}`,
        publishTime: new Date(time.innerText).getTime(),
      }
    })
  })

  for (const news of newsList) {
    await fetcher.page.goto(news.href, {
      timeout: OPEN_PAGE_TIME_OUT,
    })

    const extraData = await fetcher.page.evaluate(() => {
      const contentDOM = document.querySelector('#article')
      return {
        content: contentDOM.innerText,
        sourceHtml: contentDOM.innerHTML,
      }
    })

    Object.assign(news, extraData)
  }

  return newsList
}
