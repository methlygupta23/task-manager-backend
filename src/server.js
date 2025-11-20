const app = require('./app');
const { sequelize, connectToDatabase } = require('./config/database');

const DEFAULT_PORT = 5000;
const PORT = process.env.PORT || DEFAULT_PORT;

const startServer = async () => {
  try {
    await connectToDatabase();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}${
          process.env.PORT ? '' : ` (set PORT env variable to change)`
        }`
      );
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${PORT} is already in use. Set the PORT env variable to a free port or stop the conflicting process.`
        );
      }
      throw err;
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();