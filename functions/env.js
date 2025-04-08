// Netlify function to provide environment variables to the client
// This helps avoid hardcoding values in the frontend

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    // Only return non-sensitive environment variables
    // Never include API keys or secrets here
    const clientEnv = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      SITE_URL: process.env.URL || 'http://localhost:8888',
      API_ENDPOINT: '/.netlify/functions/api'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(clientEnv)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to load environment configuration' })
    };
  }
};