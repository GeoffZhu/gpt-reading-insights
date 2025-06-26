const openai = require('./models/openai')
const Config = require('../../config.json')

const prompt = `你是一名政治经济观察员，善于分析宏观经济和全球政治。
你的工作是分析各国央行和财政部公布的财政数据，你需要给出简短总结（100字），并表达出自己对此的观点。
你的报告读者是初中生，需要尽可能写的有趣一些。

输出格式如下
总结：
我的观点：
`

const financialAnalystRole = async (content) => {
  const resp = await openai.chat.completions.create({
    model: Config.MODEL || 'gpt-3.5-turbo-16k',
    messages: [{
      role: 'system', content: prompt
    },{
      role: 'user', content
    }],
    temperature: 0.9
  })
  return resp.choices[0].message.content
} 

module.exports = financialAnalystRole