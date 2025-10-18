// 返回pages/index/index.vue内容的函数
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    // 构建Vue文件的绝对路径
    const vueFilePath = path.join(process.cwd(), 'pages', 'index', 'index.vue');
    
    // 读取Vue文件内容
    const vueContent = fs.readFileSync(vueFilePath, 'utf8');
    
    // 从Vue文件中提取模板、脚本和样式
    const templateMatch = vueContent.match(/<template[\s\S]*?>([\s\S]*?)<\/template>/);
    const scriptMatch = vueContent.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/);
    const styleMatch = vueContent.match(/<style[\s\S]*?>([\s\S]*?)<\/style>/);
    
    // 提取内容
    const template = templateMatch ? templateMatch[1] : '';
    const script = scriptMatch ? scriptMatch[1] : '';
    const style = styleMatch ? styleMatch[1] : '';
    
    // 构建完整的HTML页面
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户注册</title>
    <style>
        /* 全局样式重置 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
        }
        
        /* 从Vue文件中提取的样式 */
        ${style}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
    <script src="https://unpkg.com/uni-app@2.0.0/dist/uni-app.min.js"></script>
</head>
<body>
    <div id="app">
        ${template}
    </div>
    
    <script>
        // 修改API基础URL以适应当前环境
        const apiBaseUrl = 'https://wtsdfhf.netlify.app/.netlify/functions';
        
        // 定义Vue实例
        new Vue({
            el: '#app',
            data() {
                return {
                    form: {
                        username: '',
                        email: '',
                        password: ''
                    },
                    isLoading: false,
                    message: '',
                    isSuccess: false
                }
            },
            methods: {
                // 提取并修改原Vue文件中的方法
                validateForm() {
                    if (!this.form.username.trim()) {
                        this.showMessage('请输入用户名', false)
                        return false
                    }
                    if (!this.form.email.trim()) {
                        this.showMessage('请输入邮箱', false)
                        return false
                    }
                    // 简单的邮箱格式验证
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(this.form.email)) {
                        this.showMessage('请输入有效的邮箱地址', false)
                        return false
                    }
                    if (!this.form.password) {
                        this.showMessage('请输入密码', false)
                        return false
                    }
                    if (this.form.password.length < 6) {
                        this.showMessage('密码长度不能少于6位', false)
                        return false
                    }
                    return true
                },
                
                showMessage(message, isSuccess) {
                    this.message = message
                    this.isSuccess = isSuccess
                    setTimeout(() => {
                        this.message = ''
                    }, 3000)
                },
                
                handleRegister() {
                    try {
                        if (!this.validateForm()) {
                            return;
                        }
                        
                        this.isLoading = true;
                        this.showMessage('正在提交注册信息...', false);
                        
                        const registerUrl = apiBaseUrl + '/auth-register';
                        console.log('发送注册请求，URL:', registerUrl);
                        
                        // 使用fetch API发送请求
                        fetch(registerUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                username: this.form.username,
                                email: this.form.email,
                                password: this.form.password
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log('注册响应数据:', data);
                            if (data.success) {
                                this.showMessage(data.message || '注册成功！', true);
                                this.form = {
                                    username: '',
                                    email: '',
                                    password: ''
                                };
                            } else {
                                this.showMessage(data.message || '注册失败！', false);
                            }
                        })
                        .catch(err => {
                            console.error('注册请求失败:', err);
                            this.showMessage('注册请求失败: ' + err.message, false);
                        })
                        .finally(() => {
                            this.isLoading = false;
                        });
                    } catch (error) {
                        console.error('注册过程异常:', error);
                        this.showMessage('程序错误: ' + (error.message || '未知错误'), false);
                        this.isLoading = false;
                    }
                },
                
                goToTestPage() {
                    try {
                        console.log('跳转到测试部署页面');
                        window.location.href = 'https://wtsdfhf.netlify.app/.netlify/functions/auth/register';
                    } catch (error) {
                        console.error('跳转过程异常:', error);
                    }
                }
            }
        });
    </script>
</body>
</html>
    `;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: html
    };
  } catch (error) {
    console.error('读取Vue文件时出错:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: '服务器错误: ' + error.message
      })
    };
  }
};