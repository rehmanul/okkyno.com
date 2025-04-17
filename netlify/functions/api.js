import { createRequestHandler } from '../dist/index.js';
import serverless from 'serverless-http';

// Create request handler from the compiled server code
const handler = serverless(createRequestHandler());

export const handler = async (event, context) => {
  // Return the response from the server
  return await handler(event, context);
};