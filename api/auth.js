const express = require('express');
const axios = require('axios');
const router = express.Router();

// 从环境变量获取Supabase配置
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bomcaovuvfnoystxrrqf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWNhb3Z1dmZub3lzdHhycnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY2MDksImV4cCI6MjA3NjAwMjYwOX0.-L13h5RR9fFZV4H9Bj3bGf9e3S5N_isWa8kuzqjlhHs';

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 简单的参数验证
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '请求参数错误，请检查输入'
      });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的邮箱地址'
      });
    }
    
    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度不能少于6位'
      });
    }
    
    // 发送注册请求到Supabase
    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/users`,
      data: {
        username,
        email,
        password
      },
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.status >= 200 && response.status < 300) {
      res.status(200).json({
        success: true,
        message: '注册成功！用户信息已保存'
      });
    } else {
      // 处理错误响应
      if (response.status === 409) {
        // 唯一性冲突
        const errorBody = response.data || {};
        let message = '用户名或邮箱已存在';
        
        if (errorBody.message) {
          if (errorBody.message.includes('username')) {
            message = '用户名已存在';
          } else if (errorBody.message.includes('email')) {
            message = '邮箱已被注册';
          }
        }
        
        return res.status(409).json({
          success: false,
          message
        });
      }
      
      res.status(response.status).json({
        success: false,
        message: `注册失败，状态码: ${response.status}`
      });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    
    // 处理不同类型的错误
    if (error.response) {
      // 服务器返回了错误响应
      if (error.response.status === 409) {
        return res.status(409).json({
          success: false,
          message: '用户名或邮箱已存在'
        });
      }
      
      res.status(error.response.status || 500).json({
        success: false,
        message: `服务器错误: ${error.response.status || '未知错误'}`
      });
    } else if (error.request) {
      // 请求已发送但没有收到响应
      res.status(500).json({
        success: false,
        message: '网络请求失败，请检查网络连接'
      });
    } else {
      // 其他错误
      res.status(500).json({
        success: false,
        message: `程序错误: ${error.message || '未知错误'}`
      });
    }
  }
});

module.exports = router;