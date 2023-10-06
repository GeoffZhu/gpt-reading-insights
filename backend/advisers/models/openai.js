const OpenAI = require('openai')
const Config = require('../../../config.json')

const openai = new OpenAI({
  apiKey: Config.OPENAI_API_KEY,
  baseURL: Config.OPENAI_BASE_URL
});

module.exports = openai