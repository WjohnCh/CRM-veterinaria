require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.NODE_PORT || '3000',
  dbuser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbNAME: process.env.DB_NAME,
  dbPORT: process.env.DB_PORT,
}

module.exports = {config};