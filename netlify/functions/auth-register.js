// 简化版的注册函数，避免语法错误
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bomcaovuvfnoystxrrqf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWNhb3Z1dmZub3lzdHhycnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjY2MDksImV4cCI6MjA3NjAwMjYwOX0.-L13h5RR9fFZV4H9Bj3bGf9e3S5N_isWa8kuzqjlhHs';

// 导入node-fetch
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // 处理预检请求
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: ''
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: false, message: '方法不允许' })
      };
    }

    // 解析请求体
    let data;
    try {
      data = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: '无效的JSON格式' })
      };
    }

    // 简化的参数验证
    if (!data.username || !data.email || !data.password) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: '缺少必要参数' })
      };
    }

    // 这里只是返回成功响应，暂不调用实际的Supabase API
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: '注册请求已接收',
        user: { username: data.username, email: data.email }
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, message: '服务器错误' })
    };
  }
};