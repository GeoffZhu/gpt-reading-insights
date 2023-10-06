function containsChinese(str) {
  return /[\u4e00-\u9fa5\u3400-\u4DBF\u{20000}-\u{2A6D6}]/u.test(str);
}

module.exports = {
  containsChinese
}