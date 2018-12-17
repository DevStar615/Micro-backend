
const Sequelize = require('sequelize');

exports.url = 'mysql://root:root@localhost:3306/MicroCredits'

exports.db = new Sequelize('MicroCredits','root','"7x\'#.[N[E',{
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  dialectOptions: {
    socketPath:'/var/lib/mysql/mysql.sock'
  },
});


/*const Sequelize = require('sequelize');

exports.url = 'mysql://root:root@localhost:3306/MicroCredits'

exports.db = new Sequelize('MicroCredits','root','root',{
  host: '127.0.0.1',
  port: 8081,
  dialect: 'mysql',
  dialectOptions: {
    socketPath: '/var/run/mysqld/mysqld.sock'
  },
});*/
