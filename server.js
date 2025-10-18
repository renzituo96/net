const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./api/auth');
require('dotenv').config(); // 加载环境变量

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({ origin: '*' })); // 允许跨域请求，生产环境应配置具体域名
app.use(bodyParser.json());

// API路由
app.use('/api', authRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 处理404错误
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API端点不存在'
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints:`);
  console.log(`- POST http://localhost:${PORT}/api/register`);
});

// 导出app供Vercel使用
module.exports = app;