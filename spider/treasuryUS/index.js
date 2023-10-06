const OPEN_PAGE_TIME_OUT = 60000

module.exports = async (fetcher) => {
  await fetcher.page.goto('https://home.treasury.gov/news/press-releases', {
    timeout: OPEN_PAGE_TIME_OUT,
  })

  await fetcher.page.waitForSelector(
    '#block-hamilton-content > div > div > div.content--2col__body'
  )

  const newsList = await fetcher.page.evaluate(() => {
    const dom = document.querySelectorAll(
      '#block-hamilton-content > div > div > div.content--2col__body > div'
    )
    return Array.from(dom).map((item) => {
      const link = item.querySelector('h3 a')

      return {
        href: link.href,
        title: link.innerText,
      }
    })
  })

  for (const news of newsList) {
    await fetcher.page.goto(news.href, {
      timeout: OPEN_PAGE_TIME_OUT,
    })

    const extraData = await fetcher.page.evaluate(() => {
      const contentDOM = document.querySelector(
        '#block-hamilton-content > article'
      )
      const timeDOM = document.querySelector(
        '#block-hamilton-content > article > div > div.date-format.field.field--name-field-news-publication-date.field--type-datetime.field--label-hidden.field__item > time'
      )
      return {
        sourceType: `美国财政部`,
        publishTime: new Date(timeDOM.getAttribute('datetime')).getTime(),
        content: contentDOM.innerText,
        sourceHtml: contentDOM.innerHTML,
      }
    })

    Object.assign(news, extraData)
  }

  return newsList
}
