const Customer = require('../schemas/customer.schema');
const CustomerBalance = require('../schemas/customerBalance.schema');
const {generateErrorJSON} = require('../shared/common');
const {timeDurationOfDates, otptimeout, customerAttributes, jwtConfig}= require('./../configs/general');
const jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

//method for generating password while updating user password
var generateHash = (password) => {
  return bcrypt.hash(password, 10);
}

//method for validating password while logging in
var validPassword = (password,hash) => {
  return bcrypt.compare(password, hash);
}

exports.getAll = (done) => {
  Customer.findAll({
    where: {
      isDeleted: false,
      isDisabled: false,
      isVerified: true
    },
    raw: true,
    attributes: customerAttributes
  }).
  then((customers) => {
    done(null, customers)
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err))
  })
}

exports.get = (id, done) => {
  Customer.find({
    where: {
      id: id,
      isDeleted: false,
      isDisabled:false
    },
    raw: true,
    attributes: customerAttributes
  }).
  then((customer) => {
    if(customer){
      if(!customer.isVerified) {
        done(generateErrorJSON("Customer is not verified yet. Please verify first"))
      }else {
        done(null, customer)
      }
    }else {
      done(generateErrorJSON("Customer is not registered."))
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err))
  })
}

exports.put = async (id, body, done) => {
  if(body.password){
    body.password = await generateHash(body.password)
  }
  Customer.update(body,{where:{id:id,isVerified:true,isDeleted:false,isDisabled:false}}).
  then((isUpdated) => {
    if(isUpdated[0]){
      Customer.find({where:{id:id},raw:true,attributes: customerAttributes}).
      then((customer) => {
        done(null, customer);
      }).
      catch((err) => {
        done(geerateErrorJSON(err.message, err));
      })
    }else{
      done(generateErrorJSON('Customer does not exist with this Id.'));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.post = (body, done) => {
  Customer.find({
    where:
      {$or:
          [{email:{$eq: body.email}}, {phoneNumber:{$eq: body.phoneNumber}}],
        isDeleted:false,
        isDisabled:false
      }
  }).
  then((customer) => {
    if(customer)
      done(generateErrorJSON('Email or Phone Number is already registered'))
    else {
      Customer.create(body).
      then((customer) => {
        if(customer){
          const balance = {
            "customerId":customer.id,
            "balance":0
          }
          CustomerBalance.create(balance)
          done(null, customer);
        }
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err))
      })
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err))
  })
}

exports.login = (body, done) => {
  Customer.find({
    where: {
      $or: [
        {email:{$eq: body.username}}, {phoneNumber:{$eq: body.username}}
      ],
      isDeleted: false,
      isDisabled: false
    }
  }).
    then(async (customer) => {
      if(customer){
        if(customer.isVerified){
          if(await validPassword(body.password,customer.password)){
            if(body.deviceType) {
              customer.updateAttributes({
                deviceType: body.deviceType
              })
            }
            done(null,customer, true);
          } else {
            done(null, false, true)
          }
        }else {
          done(null, customer, false)
        }
      }else {
        done(generateErrorJSON("Customer is not registered."))
      }
  }).
    catch((err) => {
      done(generateErrorJSON(err.message, err))
  })
}

exports.updateOtp = (id,otp,done) => {
  Customer.find({where:{id:id,isDeleted:false,isDisabled:false}}).
  then((data) => {
    if(data){
      data.updateAttributes({
        otp:otp,
        otpCreationDate:new Date().toISOString()
      }).then((data1) => {
        done(null,data1)
      }).catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else{
      done(generateErrorJSON('Customer does not exist with this Id'));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  });
}

exports.verifiedOtp = (id,otp,done) => {
  Customer.find({where:{id:id,isDeleted:false,isDisabled:false}}).
  then((customer) => {
    if(customer){
      if(!customer.isVerified) {
        if (customer.otp == otp) {
          const startDate = new Date().toISOString();
          const endDate = customer.otpCreationDate.toISOString();
          const duration = timeDurationOfDates(startDate, endDate)
          var minutes = duration.minutes();
          if (minutes <= otptimeout) {
            customer.updateAttributes({
              isVerified: true,
            }).then((data1) => {
              const JWTToken = jwt.sign({
                  email: data1.email,
                  _id: data1.id,
                },
                jwtConfig.secret,
                {
                  expiresIn : jwtConfig.expireTime
                });
              done(null, data1, JWTToken)
            }).catch((err) => {
              done(generateErrorJSON(err.message, err));
            })
          } else {
            done(generateErrorJSON('Your otp has been timed out. Please request for new OTP.'));
          }
        } else {
          done(generateErrorJSON('You have entered incorrect OTP'));
        }
      }else {
        done(generateErrorJSON('Customer is already verified'));
      }
    }else{
      done(generateErrorJSON('Customer with this id is not available'));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  });
}