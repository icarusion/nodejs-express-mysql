/**
 * Created by aresn on 16/5/11.
 */
var Sequelize = require('sequelize');
var config = require('.././config/config');
var BaseModel = require('./base');

var sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.passwd,
    {
        'dialect': 'mysql',
        'host': config.db.host,
        'port': config.db.port
    }
);

var User = sequelize.define('user', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        defaultValue: BaseModel.uid()
    },
    mail: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    passwd: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
}, {
    indexes: [
        {
            name: 'index_user_1',
            fields: ['mail'],
            unique: true
        },
        {
            name: 'index_user_2',
            fields: ['mail', 'passwd']
        }
    ],
    getterMethods: {
        to_dict: function() {
            return {
                id: this.id.toString(),
                name: this.name
            }
        }
    }
});

module.exports = User;