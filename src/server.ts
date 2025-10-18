// src/server.ts
import app from './app';
import { config } from './config';

const port = config.port || 3000;

// ✅ Only start server if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, closing server...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

export default server; 