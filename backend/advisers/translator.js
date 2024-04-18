const openai = require('./models/openai')
const Config = require('../../config.json')

const prompt = `直接翻译用户的输入为中文，标签符号按原文处理，不要额外添加标点符号`

const translator = async (content, extraPrompt) => {
  const resp = await openai.chat.completions.create({
    model: Config.MODEL || 'gpt-3.5-turbo-16k',
    messages: [{
      role: 'system', content: `${prompt}\n${extraPrompt}`
    },{
      role: 'user', content
    }],
    temperature: 0.9
  })
  return resp.choices[0].message.content
}

module.exports = translator