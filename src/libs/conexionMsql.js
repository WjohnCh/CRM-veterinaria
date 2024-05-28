const { Sequelize } = require('sequelize');


const { config: { dbuser, dbPassword, dbHost, dbNAME, dbPORT } } = require('../config')
// codifica datos sensibles con URI
const USER = encodeURIComponent(dbuser);
const PASSWORD = encodeURIComponent(dbPassword);

const URI = `mysql://${USER}:${PASSWORD}@${dbHost}:${dbPORT}/${dbNAME}`

// CREAMOS LA CONEXIÓN MEDIANTE SEQUELIZE
const sequelize = new Sequelize(URI, {
  dialect: 'mysql',
  logging: console.log
});

module.exports = sequelize;