const axios = require('axios');
require('dotenv').config();

// 从环境变量获取Supabase配置
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bomcaovuvfnoystxrrqf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWNhb3Z1dmZub3lzdHhycnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY2MDksImV4cCI6MjA3NjAwMjYwOX0.-L13h5RR9fFZV4H9Bj3bGf9e3S5N_isWa8kuzqjlhHs';

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({
          success: false,
          message: '方法不允许，请使用POST请求'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    const data = JSON.parse(event.body || '{}');
    const { username, email, password } = data;
    
    // 简单的参数验证
    if (!username || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: '请求参数错误，请检查输入'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: '请输入有效的邮箱地址'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
    
    // 验证密码长度
    if (password.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: '密码长度不能少于6位'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
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
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: '注册成功！用户信息已保存'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    } else {
      // 处理错误响应
      if (response.status === 409) {
        return {
          statusCode: 409,
          body: JSON.stringify({
            success: false,
            message: '用户名或邮箱已存在'
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }
      
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          message: `注册失败，状态码: ${response.status}`
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    
    if (error.response) {
      if (error.response.status === 409) {
        return {
          statusCode: 409,
          body: JSON.stringify({
            success: false,
            message: '用户名或邮箱已存在'
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }
      
      return {
        statusCode: error.response.status || 500,
        body: JSON.stringify({
          success: false,
          message: `服务器错误: ${error.response.status || '未知错误'}`
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    } else if (error.request) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: '网络请求失败，请检查网络连接'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: `程序错误: ${error.message || '未知错误'}`
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
  }
};