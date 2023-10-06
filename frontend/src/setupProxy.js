const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // 添加代理规则，将请求代理到后端API服务器
  app.use(
    '/api', // 当前项目中需要代理的API请求前缀
    createProxyMiddleware({
      target: 'http://localhost:3001', // 后端API服务器的地址
      changeOrigin: true, // 设置为true，以确保请求的主机头是正确的
    })
  );
};
