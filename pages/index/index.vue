<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
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
				<input class="input" v-model="form.password" type="password" placeholder="请输入密码" password="true" />
			</view>
			
			<button class="register-btn" @click="handleRegister" :disabled="isLoading">{{ isLoading ? '注册中...' : '注册' }}</button>
			
			<view v-if="message" class="message" :class="{'success': isSuccess, 'error': !isSuccess}">
				{{ message }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: '',
					email: '',
					password: ''
				},
				isLoading: false,
				message: '',
				isSuccess: false,
				// API基础URL - 现在通过后端服务调用，不再暴露Supabase凭证
				// 针对uni-app环境优化的URL设置
				apiBaseUrl: 'http://localhost:3000/api'
			}
		},
		onLoad() {
			// 页面加载时的初始化逻辑
			// 在uni-app中，我们根据运行环境自动适配
			// 开发环境使用localhost，生产环境使用当前域名
			const isDev = __DEV__ || (typeof location !== 'undefined' && location.hostname === 'localhost');
			if (!isDev) {
				this.apiBaseUrl = (typeof location !== 'undefined' ? 'https://' + location.host : '') + '/api';
			}
			console.log('API基础URL:', this.apiBaseUrl);
		},
		methods: {
			// 验证表单
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
			
			// 显示消息
			showMessage(message, isSuccess) {
				this.message = message
				this.isSuccess = isSuccess
				// 3秒后自动清除消息
				setTimeout(() => {
					this.message = ''
				}, 3000)
			},
			

			
			// 处理注册 - 现在通过后端API注册
		handleRegister() {
			try {
				// 使用已有的表单验证方法
				if (!this.validateForm()) {
					return;
				}
				
				this.isLoading = true;
				this.showMessage('正在提交注册信息...', false);
				
				console.log('准备发送注册请求...');
				const registerUrl = this.apiBaseUrl + '/register';
				console.log('发送注册请求，URL:', registerUrl);
				console.log('注册数据:', { username: this.form.username, email: this.form.email, password: '******' }); // 不打印实际密码
				
				// 发送注册请求到后端API
				uni.request({
					url: registerUrl,
					method: 'POST',
					data: {
						username: this.form.username,
						email: this.form.email,
						password: this.form.password
					},
					header: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					timeout: 15000, // 设置超时时间为15秒
					success: (res) => {
						console.log('注册响应状态码:', res.statusCode);
						console.log('注册响应数据:', res.data);
						
						const data = res.data || {};
						if (res.statusCode === 200) {
							if (data.success) {
								this.showMessage(data.message || '注册成功！', true);
								// 清空表单
								this.form = {
									username: '',
									email: '',
									password: ''
								};
							} else {
								this.showMessage(data.message || '注册失败！', false);
							}
						} else if (res.statusCode === 409) {
							this.showMessage('用户名或邮箱已存在', false);
						} else if (res.statusCode === 400) {
							this.showMessage('请求参数错误: ' + (data.message || '请检查输入信息'), false);
						} else if (res.statusCode === 401) {
							this.showMessage('认证失败，请稍后重试', false);
						} else {
							this.showMessage('注册失败，状态码: ' + res.statusCode, false);
						}
					},
					fail: (err) => {
						console.error('注册请求失败:', err);
						console.error('错误详情:', JSON.stringify(err));
						if (err.errMsg && err.errMsg.includes('timeout')) {
							this.showMessage('请求超时，请检查后端服务是否运行', false);
						} else if (err.errMsg && err.errMsg.includes('request:fail')) {
							this.showMessage('网络请求失败: ' + err.errMsg, false);
						} else {
							this.showMessage('注册请求失败: ' + (err.errMsg || '未知错误'), false);
						}
					},
					complete: () => {
						console.log('注册请求完成');
						this.isLoading = false;
					}
				});
			} catch (error) {
				console.error('注册过程异常:', error);
				this.showMessage('程序错误: ' + (error.message || '未知错误'), false);
				this.isLoading = false;
			}
		}
	}
}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
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
	}

	.register-btn:disabled {
			background-color: #ccc;
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
		}

		.test-btn:disabled {
			background-color: #ccc;
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
