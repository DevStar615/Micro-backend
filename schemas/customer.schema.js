const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
var bcrypt = require('bcrypt');
const city = require('./city.schema');
const state = require('./state.schema');
const country = require('./country.schema');

const customerSchema = db.define('Customer',{
  id:{
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  firstName:{
    type: Sequelize.STRING,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'first name is required field'}
    }
  },
  lastName:{
    type: Sequelize.STRING,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'last name is required field'}
    }
  },
  streetNo:{
    type: Sequelize.STRING,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'Street no is required field.'},
    }
  },
  cityId:{
    type: Sequelize.BIGINT,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'City is required field.'},
    }
  },
  stateId:{
    type: Sequelize.BIGINT,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'State is required field.'},
    }
  },
  postalCode:{
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      isNumeric: {msg: 'Postal code must contain digits only'},
      notEmpty: { msg: 'Postal code is required field.'},
    }
  },
  countryId:{
    type: Sequelize.BIGINT,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'Country is required field.'},
    }
  },
  dateOfBirth:{
    type: Sequelize.DATE,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'Date of birth is required field.'},
    }
  },
  countryCode: {
    type: Sequelize.STRING,
    validate: {
      isNumeric: {msg: 'Country code must contain digits only'},
      notEmpty: {msg: 'Country code is required field'}
    }
  },
  phoneNumber:{
    type: Sequelize.STRING,
    unique:true,
    validate: {
      isNumeric:{msg: 'Phone number must contain digits only.'},
      notEmpty: { msg: 'PhoneNumber is required field.'},
      /*validatePhone: (value) => {
        if(!(/\d{10}/.test(value))){
          throw new Error('Please Enter Valid PhoneNumber.')
        }
      }*/
    }
  },
  email:{
    type: Sequelize.STRING,
    unique:true,
    validate: {
      notEmpty: { msg: 'Email is required field.'},
      isEmail: { msg: 'Please Enter valid email.'}
    }
  },
  password:{
    type: Sequelize.STRING,
    allowNull : false,
    validate: {
      notEmpty: { msg: 'Password is required field.'},
    }
  },
  deviceType: {
    type: Sequelize.ENUM('Android', 'iOS', 'Web'),
    allowNull: true
  },
  otp:{
    type:Sequelize.INTEGER,
    validate:{
      notEmpty: { msg: 'Please Enter Otp.'},
    }
  },
  otpCreationDate:{
    type:Sequelize.DATE,
    validate:{
      notEmpty: true
    }
  },
  isVerified:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isDisabled:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isDeleted:{
    type:Sequelize.BOOLEAN,
    defaultValue: false,
  },
},
  {
    hooks: {
      beforeCreate: function(customer, options) {
        return new Promise((resolve, reject) => {
          bcrypt.hash(customer.password, 10, (err, data) => {
            if (err) reject(err);
            customer.password = data;
            resolve();
          })
        });
      },
    },
  })

customerSchema.belongsTo(city,{foreignKey:'cityId'})
customerSchema.belongsTo(state,{foreignKey:'stateId'})
customerSchema.belongsTo(country,{foreignKey:'countryId'})

customerSchema.sync({force:false}).then((res) => {
  console.log('Customer Table Created Successfully');
}).catch((error) => {
  console.log(error);
})

module.exports = customerSchema;