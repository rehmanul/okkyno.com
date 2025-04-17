import express from 'express';
import serverless from 'serverless-http';
import session from 'express-session';
import MemoryStore from 'memorystore';
import passport from 'passport';
import { storage } from '../../server/storage.js';
import { registerRoutes } from '../../server/routes.js';

// Initialize Express app
const app = express();
const MemoryStoreSession = MemoryStore(session);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    cookie: {
      maxAge: 86400000, // 24 hours
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000, // 24 hours
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'okkyno-secret-key',
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Register API routes
registerRoutes(app);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Export the serverless function
export const handler = serverless(app);