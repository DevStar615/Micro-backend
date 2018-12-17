const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const customer = require('./customer.schema');

const customerBalanceSchema = db.define('CustomerBalance',{
  id:{
    type: Sequelize.BIGINT,
    autoIncrement:true,
    primaryKey:true
  },
  customerId:{
    type:Sequelize.BIGINT,
    allowNull:false,
    unique:true,
    validate:{
      notEmpty:{msg:'Please Enter Customer Id'},
    }
  },
  balance:{
    type:Sequelize.DOUBLE,
    allowNull:false
  },
  isDeleted:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  },
})

customerBalanceSchema.belongsTo(customer,{foreignKey:'customerId'})

customerBalanceSchema.sync({force:false}).then((res) => {
  console.log('Customer Balance Table Created Successfully');
}).catch((error) => {
  console.log(error);
})

module.exports = customerBalanceSchema;