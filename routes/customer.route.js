const {Router} = require('express');
const router = Router();
const otpGenerator = require('otp-generator');
const Customer = require('../schemas/customer.schema');
const {post, updateOtp, verifiedOtp, login, getAll, get, put} = require('../controllers/customer.controller');
const {accountSid, authToken, phoneNumber, listId, apiKey, jwtConfig} = require('./../configs/general');
const client = require('twilio')(accountSid,authToken);
const jwt = require('jsonwebtoken');
/*const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(apiKey);*/

//function for sending otp on email
function sendOtpOnEmail(customerId, customerEmail, res){
  const staticOtp = otpGenerator.generate(4,{alphabets:false, upperCase:false, specialChars:false});

  updateOtp(customerId, staticOtp, (err, data) => {
    if(err){
      res.statusCode = 200;
      res.json({success:0, error: err.error});
    }else {
      res.statusCode = 200;
      res.json({success:1, response: "OTP has been sent on this email: "+customerEmail+". Your OTP will expire in 5 minutes."});
    }
  })
  /*mailchimp.post(`lists/${listId}`, { members: [{
      email_address:'rajkapoordev@gmail.com',
      status: "subscribed"
    }]
  }).then((result) => {

    //return res.send(result);
  }).catch((error) => {
    console.log(error)
    return res.send(error);
  });*/
}

//function for registration with otp on email
function registerWithOtpOnEmail(data, res){
  const staticOtp = otpGenerator.generate(4,{alphabets:false, upperCase:false, specialChars:false});

  delete data.type
  data.otp = staticOtp
  data.otpCreationDate = new Date().toISOString()

  post(data, (err,result) => {
    if(err){
      res.statusCode=200;
      res.json({success:0, error: err.error});
    }
    else {
      res.statusCode = 200;
      delete result.dataValues.password;
      delete result.dataValues.isDeleted;
      delete result.dataValues.isDisabled;
      delete result.dataValues.isVerified;
      delete result.dataValues.createdAt;
      delete result.dataValues.updatedAt;
      res.json({success:1, response:"OTP has been sent on this email: "+data.email+". Your OTP will expire in 5 minutes.", customer:result})
    }
  })
}

//function for sending otp on phone
function sendOtpOnPhone(customerId, customerCCode, customerPhno, res){
  const staticOtp = otpGenerator.generate(4,{alphabets:false, upperCase:false, specialChars:false});
  const customerNumber = customerCCode+customerPhno;

  client.messages
    .create({
      body: 'Your OTP is ' + staticOtp,
      from: phoneNumber,
      to: customerNumber
    }, (err, success) => {
      if(!err){
        updateOtp(customerId, staticOtp, (error, result) => {
          if(error){
            res.statusCode = 200;
            res.json({success:0, error: error.error});
          }
          else {
            res.statusCode = 200;
            res.json({success:1, response: "OTP has been sent on this phone number: "+customerPhno+". Your OTP will expire in 5 minutes."});
          }
        })
      }else {
        res.statusCode = 200
        res.json({success:0, error: err.message})
      }
    })
}

//function for registration with otp on phone
function registerWithOtpOnPhone(data, res){
  const staticOtp = otpGenerator.generate(4,{alphabets:false, upperCase:false, specialChars:false});
  const customerNumber = data.countryCode+data.phoneNumber

  client.messages
    .create({
      body: 'Your OTP is ' + staticOtp,
      from: phoneNumber,
      to: customerNumber
    }, (err, success) => {
      if(!err){
        delete data.type
        data.otp = staticOtp
        data.otpCreationDate = new Date().toISOString()

        post(data, (err,result) => {
          if(err){
            res.statusCode=200;
            res.json({success:0, error: err.error});
          }
          else {
            res.statusCode = 200;
            delete result.dataValues.password;
            delete result.dataValues.isDeleted;
            delete result.dataValues.isDisabled;
            delete result.dataValues.isVerified;
            delete result.dataValues.createdAt;
            delete result.dataValues.updatedAt;
            res.json({success:1, response:"OTP has been sent on this phone number: "+data.phoneNumber+". Your OTP will expire in 5 minutes.", customer:result})
          }
        })
      }else {
        res.statusCode = 200
        res.json({success:0, error: err.message})
      }
    })
}

//fetching all customers route
router.get('/', (req, res) => {
  getAll((err, result) => {
    if(err){
      res.statusCode=200;
      res.json({success:0, error: err.error});
    }else if(result.length == 0) {
      res.statusCode=200;
      res.json({success:0, error: "No customers registered yet"});
    }else {
      res.statusCode=200;
      res.json({success:1, response: result});
    }
  })
})

//fetching specific customer detail
router.get('/:id', (req, res) => {
  get(req.params.id, (err, result) => {
    if(err) {
      res.statusCode=200;
      res.json({success:0, error: err.error});
    }else if(result == null){
      res.statusCode=200;
      res.json({success:0, error: "No user registered with this id"});
    }else {
      res.statusCode=200
      res.json({success:1, response: result});
    }
  })
})

//Update customer
router.put('/:id', (req, res) => {
  if (req.params.id) {
    put(req.params.id, req.body, (err, result) => {
      if (err) {
        res.statusCode=200
        res.json({success:0, error: err.error})
      }
      else if(result.length == 0){
        res.statusCode = 200
        res.json({message:'Cannot update customer because no customer with such Id available'})
      }
      else {
        res.statusCode=200
        res.json({success:1, response:result})
      }
    })
  }else {
    res.statusCode=200
    res.json({success:0, error: "Customer id is required"})
  }
});

//customer registration route
/*router.post('/customerSignUp', (req, res) =>{
  post(req.body, (err,result) => {
    if(err){
      res.statusCode=200;
      res.json({success:0, error: err.error});
    }
    else {
      res.statusCode = 200;
      delete result.dataValues.password;
      delete result.dataValues.isDeleted;
      delete result.dataValues.isDisabled;
      delete result.dataValues.isVerified;
      delete result.dataValues.createdAt;
      delete result.dataValues.updatedAt;
      res.json({success:1, response:result})
    }
  })
});*/

//customer login route
router.post('/login', (req, res) => {
   //if((req.body.email && req.body.password) || (req.body.phoneNumber && req.body.password)){
  if(req.body.username && req.body.password){
    login(req.body, (err, customer, isVerified) => {
      if(err) {
        res.statusCode = 200;
        res.json({success:0, error:err.error})
      }else if(!isVerified){
        res.statusCode=200;
        delete customer.dataValues.password;
        delete customer.dataValues.isDeleted;
        delete customer.dataValues.isDisabled;
        delete customer.dataValues.createdAt;
        delete customer.dataValues.updatedAt;
        delete customer.dataValues.otp;
        delete customer.dataValues.otpCreationDate;
        res.json({success:0, error: 'Customer is not verified. Please get yourself verified first', customer:customer.dataValues});
      }else if(!customer) {
        res.statusCode=200;
        res.json({success:0, error: 'Invalid password'});
      }else {
        res.statusCode = 200;

        const JWTToken = jwt.sign({
            email: customer.email,
            _id: customer.id,
          },
          jwtConfig.secret,
          {
            expiresIn : jwtConfig.expireTime
          });

        delete customer.dataValues.password;
        delete customer.dataValues.isDeleted;
        delete customer.dataValues.isDisabled;
        delete customer.dataValues.createdAt;
        delete customer.dataValues.updatedAt;
        delete customer.dataValues.otp;
        delete customer.dataValues.otpCreationDate;
        res.json({success:1, response:customer.dataValues, token:JWTToken});
      }
    })
  }else {
    res.statusCode=200
    res.json({success: 0, error: "Login credentials are required"})
  }
})

//Send/resend OTP on
router.post('/otp', (req, res) => {
  if(req.body.id && req.body.type) {
    if(req.body.type == 'email') {
      Customer.find({where: {id:req.body.id, isDeleted: false}}).
        then((customer) => {
          if(customer){
            sendOtpOnEmail(req.body.id, customer.email, res);
          }else {
            res.statusCode = 200;
            res.json({success:0, error:"Customer with this id is not registered"})
          }
      }).catch((err) => {
        res.statusCode = 200;
        res.json({success:0, error: err.message})
      })
    }else if(req.body.type == 'phoneNumber'){
       Customer.find({where: {id:req.body.id, isDeleted: false}}).
      then((customer) => {
        if(customer){
          sendOtpOnPhone(req.body.id, customer.countryCode, customer.phoneNumber, res);
        }else {
          res.statusCode = 200;
          res.json({success:0, error:"Customer with this id is not registered"})
        }
      }).catch((err) => {
        res.statusCode = 200;
        res.json({success:0, error: err.message})
      })
    }
  }else {
    res.statusCode = 200;
    res.json({success:0, error:'Customer id and type is required'});
  }
})

//Send/resend OTP on
router.post('/customerSignUp', (req, res) => {
  if(req.body.type == 'email') {
    Customer.find({
      where:
        {$or:
            [{email:{$eq: req.body.email}}, {phoneNumber:{$eq: req.body.phoneNumber}}],
          isDeleted:false,
          isDisabled:false
        }
    }).then((customer) => {
      if(customer) {
        res.statusCode = 200;
        res.json({success: 0, error: "Email or Phone Number is already registered"})
      }
      else {
        registerWithOtpOnEmail(req.body, res);
      }
    }).
    catch((err) => {
      res.statusCode = 200;
      res.json({success:0, error: err.message})
    })
  }else if(req.body.type == 'phoneNumber'){
    Customer.find({
      where:
        {$or:
            [{email:{$eq: req.body.email}}, {phoneNumber:{$eq: req.body.phoneNumber}}],
          isDeleted:false,
          isDisabled:false
        }
    }).then((customer) => {
      if(customer) {
        res.statusCode = 200;
        res.json({success: 0, error: "Email or Phone Number is already registered"})
      }
      else {
        registerWithOtpOnPhone(req.body, res);
      }
    }).
    catch((err) => {
      res.statusCode = 200;
      res.json({success:0, error: err.message})
    })
  }else if(!req.body.type ){
    res.statusCode = 200;
    res.json({success:0, error: "Please select verification type"})
  }else {
    res.statusCode = 200;
    res.json({success:0, error: "Invalid type"})
  }
})

//verified customer by checking otp
router.get('/checkforotp/:id/:otp', (req,res) => {
  if(req.params.id && req.params.otp){
    verifiedOtp(req.params.id,req.params.otp,(err,result, token) => {
      if (err) {
        res.statusCode=200;
        res.json({success:0, error: err.error});
      }
      else if(result == null){
        res.statusCode = 200
        res.json({success:0, error:'Invalid Id supplied'})
      }
      else {
        res.statusCode=200

        delete result.dataValues.password;
        delete result.dataValues.isDeleted;
        delete result.dataValues.isDisabled;
        delete result.dataValues.createdAt;
        delete result.dataValues.updatedAt;
        delete result.dataValues.otp;
        delete result.dataValues.otpCreationDate;

        res.json({success:1, response: "Customer verified successfully.",customer:result, token})
      }
    })
  }else{
    res.statusCode=200
    res.json({success:0, error: "Customer id and otp is required"})
  }
})

module.exports = router;