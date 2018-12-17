const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const state = require('./state.schema');

const citySchema = db.define('City',{
  id:{
    type: Sequelize.BIGINT,
    autoIncrement:true,
    primaryKey:true
  },
  cityName:{
    type:Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:{msg:'Please Enter City Name'},
    }
  },
  stateId:{
    type:Sequelize.BIGINT,
    allowNull:false
  },
  isDeleted:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  }
})

citySchema.belongsTo(state,{foreignKey:'stateId'})

citySchema.sync({force:false}).then((res) => {
  console.log('City Table Created Successfully');
}).catch((error) => {
  console.log(error);
})

module.exports = citySchema;