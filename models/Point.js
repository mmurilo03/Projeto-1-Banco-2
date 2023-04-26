const Sequelize = require("sequelize")

const sequelize = require("../database/db")
const { DataTypes } = require("sequelize")

const Point = sequelize.define('Point', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    geometria: {
        type: DataTypes.GEOMETRY,
        allowNull: false,
        // allowNull defaults to true
    }
}, {
    // Other model options go here
});

module.exports = Point;