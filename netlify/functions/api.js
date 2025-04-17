
import serverless from 'serverless-http';
import { createRequestHandler } from '../../dist/index.js';

// Create the Express app and handle as serverless function
export const handler = async (event, context) => {
  const app = createRequestHandler();
  const handler = serverless(app);
  return await handler(event, context);
};
