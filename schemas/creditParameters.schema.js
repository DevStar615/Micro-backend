const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');

const creditParametersSchema = db.define('CreditParameters',{
  id:{
    type: Sequelize.BIGINT,
    autoIncrement:true,
    primaryKey:true
  },
  key:{
    type:Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:{msg:'Key is required field'},
    }
  },
  value:{
    type:Sequelize.STRING,
    allowNull:false,
    validate:{
      notEmpty:{msg:'Value is required field'},
    }
  },
  isDeleted:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  }
})

creditParametersSchema.sync({force:false}).then( (res) => {
  console.log('CreditParameters Table Created Successfully');
}).catch((error) => {
  console.log(error);
})

module.exports = creditParametersSchema;