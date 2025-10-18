// 简单的测试函数
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: '测试函数正常工作',
      timestamp: new Date().toISOString(),
      path: event.path
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
};