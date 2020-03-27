const Sequelize = require('sequelize');
var mysql = require('mysql');


const dbName = 'changelab';
const userTable = 'users';
const howToAskTable = 'howtoasks';
const roundTableTable = 'roundtables';

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

connection.connect((err1, success1) => {
  if (!err1) {
    var sqlQuery = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
    connection.query(sqlQuery, (err2, success2) => {
      if (!err2) {
        console.log(`Database '${dbName}' successfully created`);
      } else {
        console.log('err 2: ', err2)
      }
    });
  } else {
    console.log("err 1: ", err1);
  }
});


const sequelize = new Sequelize(dbName, 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
  },
  logging: false,
  pool: { maxConnections: 20, maxIdleTime: 30 }
});

const User = sequelize.define(userTable, {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cookie: {
    type: Sequelize.STRING,
    allowNull: true
  },
  cookieExpireTime: {
    type: Sequelize.DATE,
    allowNull: true
  },
});


const HowToAsk = sequelize.define(howToAskTable, {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  JenTelScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  JenMeetScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  SharrelTelScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  SharrelMeetScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  JPTelScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  JPMeetScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  tutorial: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
});


const RoundTable = sequelize.define(roundTableTable, {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  Jen: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Sharrel: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  JP: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  tutorial: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
});

sequelize.sync({ force: false }) // set to TRUE, only when the schema is changed, this will drop the existing table & database.
  .then(() => console.log(`Table ${userTable} has been synced.`))
  .catch(error => console.log(error));



module.exports = { User, HowToAsk, RoundTable };