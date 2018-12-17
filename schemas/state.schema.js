const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const country = require('./country.schema');

const stateSchema = db.define('State',{
  id:{
    type: Sequelize.BIGINT,
    autoIncrement:true,
    primaryKey:true
  },
  stateName:{
    type:Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:{msg:'Please Enter State Name'},
    }
  },
  countryId:{
    type:Sequelize.BIGINT,
    allowNull:false
  },
  isDeleted:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  },
})

stateSchema.belongsTo(country,{foreignKey:'countryId'})

stateSchema.sync({force:false}).then((res) => {
  console.log('State Table Created Successfully');
}).catch((error) => {
  console.log(error);
})

module.exports = stateSchema;