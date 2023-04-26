const {Sequelize, DataTypes} = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
});
 
module.exports = sequelize