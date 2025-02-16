import { createApp } from './config/app.js';
import { getMySQLInstance } from './infrastructure/database/mysql.js';

const startServer = async () => {
  try {
    await getMySQLInstance();
    const app = createApp();

    app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Server is running' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Fatal error during startup:', error);
    process.exit(1);
  }
};

startServer();
