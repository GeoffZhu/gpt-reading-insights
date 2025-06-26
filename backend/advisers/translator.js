const openai = require('./models/openai')
const Config = require('../../config.json')

const prompt = `你是一名翻译人员，你需要将任何下面的输入都翻译为中文，标签符号也要与原文一致，不要输出任何其他内容。`

const translator = async (content, extraPrompt = '') => {
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