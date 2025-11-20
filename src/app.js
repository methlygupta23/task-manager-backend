const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Configure CORS for production and development
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      tasks: '/api/tasks'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', taskRoutes);

module.exports = app;
