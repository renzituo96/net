// 直接返回注册页面HTML内容，不依赖文件读取
exports.handler = async function(event, context) {
  try {
    // 直接构建完整的注册页面HTML，包含所有必要的Vue组件内容
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
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        /* 注册页面样式 */
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40rpx;
            width: 100%;
            max-width: 600rpx;
            margin: 0 auto;
        }

        .logo {
            height: 200rpx;
            width: 200rpx;
            margin-top: 100rpx;
            margin-bottom: 50rpx;
        }

        .register-form {
            width: 100%;
            max-width: 600rpx;
            padding: 40rpx;
            background-color: #f8f8f8;
            border-radius: 20rpx;
            box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
        }

        .form-title {
            font-size: 36rpx;
            font-weight: bold;
            text-align: center;
            margin-bottom: 40rpx;
            color: #333;
        }

        .input-group {
            margin-bottom: 30rpx;
        }

        .label {
            display: block;
            font-size: 28rpx;
            color: #666;
            margin-bottom: 10rpx;
        }

        .input {
            width: 100%;
            height: 80rpx;
            padding: 0 20rpx;
            border: 1rpx solid #ddd;
            border-radius: 10rpx;
            font-size: 28rpx;
            background-color: #fff;
        }

        .register-btn {
            width: 100%;
            height: 88rpx;
            line-height: 88rpx;
            background-color: #007aff;
            color: #fff;
            font-size: 32rpx;
            border-radius: 10rpx;
            margin-top: 20rpx;
            border: none;
            cursor: pointer;
        }

        .register-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .test-btn {
            width: 100%;
            height: 88rpx;
            line-height: 88rpx;
            background-color: #5856d6;
            color: #fff;
            font-size: 32rpx;
            border-radius: 10rpx;
            margin-top: 20rpx;
            border: none;
            cursor: pointer;
        }

        .test-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .message {
            margin-top: 30rpx;
            padding: 20rpx;
            border-radius: 10rpx;
            font-size: 28rpx;
            text-align: center;
        }

        .message.success {
            background-color: #e8f5e8;
            color: #4caf50;
        }

        .message.error {
            background-color: #ffebee;
            color: #f44336;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
</head>
<body>
    <div id="app">
        <view class="content">
            <div class="logo-placeholder" style="width: 100px; height: 100px; background-color: #007aff; border-radius: 20px; margin-bottom: 20px;"></div>
            <view class="register-form">
                <view class="form-title">用户注册</view>
                
                <view class="input-group">
                    <text class="label">用户名</text>
                    <input class="input" v-model="form.username" placeholder="请输入用户名" />
                </view>
                
                <view class="input-group">
                    <text class="label">邮箱</text>
                    <input class="input" v-model="form.email" type="email" placeholder="请输入邮箱" />
                </view>
                
                <view class="input-group">
                    <text class="label">密码</text>
                    <input class="input" v-model="form.password" type="password" placeholder="请输入密码" />
                </view>
                
                <button class="register-btn" @click="handleRegister" :disabled="isLoading">{{ isLoading ? '注册中...' : '注册' }}</button>
                
                <button class="test-btn" @click="goToTestPage">跳转到测试部署页面</button>
                
                <view v-if="message" class="message" :class="{'success': isSuccess, 'error': !isSuccess}">
                    {{ message }}
                </view>
            </view>
        </view>
    </div>
    
    <script>
        // API基础URL
        const apiBaseUrl = 'https://wtsdfhf.netlify.app/.netlify/functions';
        
        // 定义Vue实例
        new Vue({
            el: '#app',
            data: {
                form: {
                    username: '',
                    email: '',
                    password: ''
                },
                isLoading: false,
                message: '',
                isSuccess: false
            },
            methods: {
                // 验证表单
                validateForm() {
                    if (!this.form.username.trim()) {
                        this.showMessage('请输入用户名', false);
                        return false;
                    }
                    if (!this.form.email.trim()) {
                        this.showMessage('请输入邮箱', false);
                        return false;
                    }
                    // 简单的邮箱格式验证
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.form.email)) {
                        this.showMessage('请输入有效的邮箱地址', false);
                        return false;
                    }
                    if (!this.form.password) {
                        this.showMessage('请输入密码', false);
                        return false;
                    }
                    if (this.form.password.length < 6) {
                        this.showMessage('密码长度不能少于6位', false);
                        return false;
                    }
                    return true;
                },
                
                // 显示消息
                showMessage(message, isSuccess) {
                    this.message = message;
                    this.isSuccess = isSuccess;
                    // 3秒后自动清除消息
                    setTimeout(() => {
                        this.message = '';
                    }, 3000);
                },
                
                // 处理注册
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
                        .then(res => {
                            if (!res.ok) {
                                throw new Error('网络响应异常: ' + res.status);
                            }
                            return res.json();
                        })
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
                            this.showMessage('注册请求失败: ' + (err.message || '未知错误'), false);
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
                
                // 跳转到测试部署页面
                goToTestPage() {
                    try {
                        console.log('跳转到测试部署页面');
                        window.location.href = 'https://wtsdfhf.netlify.app';
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
    console.error('生成页面时出错:', error);
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