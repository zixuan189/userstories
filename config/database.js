const Sequelize = require('sequelize')

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: process.env.INSTANCE_HOST,
    dialect: process.env.DIALECT,
    operatorsAliases: false,
    pool: {
      max: parseInt(process.env.POOL_MAX),
      min: parseInt(process.env.POOL_MIN),
      acquire: process.env.POOL_ACQUIRE,
      idle: process.env.POOL_IDLE
    }
  }
)