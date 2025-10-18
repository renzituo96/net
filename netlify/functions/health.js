exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
};