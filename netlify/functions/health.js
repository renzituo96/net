// 移除所有外部依赖，确保Netlify能正常执行
exports.handler = async function(event, context) {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        message: error.message
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};