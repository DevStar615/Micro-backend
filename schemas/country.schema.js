const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');

const countrySchema = db.define('Country',{
  id:{
    type: Sequelize.BIGINT,
    autoIncrement:true,
    primaryKey:true
  },
  countryName:{
    type:Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:{msg:'Please Enter City Name'},
    }
  },
  isDeleted:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  }
})

countrySchema.sync({force:false}).then( (res) => {
  console.log('Country Table Created Successfully');
}).catch((error) => {
  console.log(error);
})

module.exports = countrySchema;