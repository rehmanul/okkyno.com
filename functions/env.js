// Environment variables function
exports.handler = async function(event, context) {
  // Add any environment variables you want to expose to the client
  const clientEnvVars = {
    SITE_URL: process.env.URL || 'http://localhost:8888',
    API_URL: '/.netlify/functions/api'
  };
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clientEnvVars)
  };
};
