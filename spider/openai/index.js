const OPEN_PAGE_TIME_OUT = 60000

module.exports = async (fetcher) => {
  await fetcher.page.goto('https://openai.com/news/?limit=10', {
    timeout: OPEN_PAGE_TIME_OUT,
  })

  await fetcher.page.waitForSelector(
    '#results > div:nth-child(2) > div'
  )

  const newsList = await fetcher.page.evaluate(() => {
    const dom = document.querySelectorAll(
      '#results > div:nth-child(2) > div > div'
    )
    return Array.from(dom).map((item) => {
      const link = item.querySelector('a')

      return {
        href: link.href,
        title: link.attributes['aria-label'].value,
      }
    })
  })

  for (const news of newsList) {
    await fetcher.page.goto(news.href, {
      timeout: OPEN_PAGE_TIME_OUT,
    })

    const extraData = await fetcher.page.evaluate(() => {
      const contentDOM = document.querySelector(
        '#main'
      )
      // 部分文章没有标注时间
      const timeDOM = contentDOM.querySelector(
        'p.text-caption.mb-4xs'
      )
      return {
        sourceType: `OpenAI`,
        publishTime: new Date(timeDOM?.innerText).getTime(),
        content: contentDOM.innerText,
        sourceHtml: contentDOM.innerHTML,
      }
    })

    Object.assign(news, extraData)
  }

  return newsList
}
