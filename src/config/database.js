const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const {
  DB_URL,
  DB_NAME = 'task_manager',
  DB_USERNAME = 'postgres',
  DB_PASSWORD = 'Password',
  DB_HOST = '127.0.0.1',
  DB_PORT = 4000,
  NODE_ENV = 'development',
  DB_DIALECT,
  SQLITE_STORAGE,
} = process.env;

const logging =
  NODE_ENV === 'development'
    ? (msg) => console.log(`[sequelize] ${msg}`)
    : false;

const effectiveDialect = (() => {
  if (DB_URL) {
    return 'postgres';
  }
  if (DB_DIALECT) {
    return DB_DIALECT;
  }
  return 'sqlite';
})();

let sequelize;

if (effectiveDialect === 'postgres') {
  const baseConfig = {
    dialect: 'postgres',
    logging,
    dialectModule: require('pg'),
  };

  if (DB_URL) {
    sequelize = new Sequelize(DB_URL, baseConfig);
  } else {
    sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
      ...baseConfig,
      host: DB_HOST,
      port: DB_PORT,
      dialectOptions:
        NODE_ENV === 'production'
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : {},
    });
  }
} else if (effectiveDialect === 'sqlite') {
  const defaultStorage = path.resolve(__dirname, '../../data/database.sqlite');
  const storagePath = SQLITE_STORAGE || defaultStorage;
  const storageDir = path.dirname(storagePath);

  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  console.log(`[sequelize] Using SQLite storage at ${storagePath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging,
  });
} else {
  throw new Error(
    `Unsupported DB_DIALECT "${effectiveDialect}". Supported values are "postgres" and "sqlite".`
  );
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectToDatabase,
};
