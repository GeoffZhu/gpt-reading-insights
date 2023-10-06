const openai = require('./models/openai')

const prompt = `你是一名政治经济记者，善于分析宏观经济。
你的工作是分析央行公布的财政数据，给出 总结、数据波动背后的意义 以及 对未来的预测。
你的读者是五年级学生，报道要通俗易懂。

输出格式如下
总结：
意义：
未来预测：
`

const financialAnalystRole = async (content) => {
  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
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