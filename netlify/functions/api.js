
import serverless from 'serverless-http';
import { createRequestHandler } from '../../server/index.js';

// Create the Express app
const app = createRequestHandler();

// Export the serverless function
export const handler = serverless(app);
