const CustomerBalance = require('../schemas/customerBalance.schema')
const {generateErrorJSON} = require('../shared/common');
const Customer = require('../schemas/customer.schema');
const {customerBalanceAttributes} = require('../configs/general')
const {db} = require('../configs/database')

exports.post = (body, done) => {
  Customer.find({
    where: {
      id: body.customerId,
      isDeleted: false,
      isDisabled: false
    }
  }).
  then((customer) => {
    if(customer){
      CustomerBalance.find({
        where: {
          customerId: body.customerId,
          isDeleted: false
        }
      }).
      then((record) => {
        if(record){
          done(generateErrorJSON({message: "Customer balance account already available"}));
        }else{
          CustomerBalance.create(body).
          then((newBalance) => {
            done(null, newBalance);
          }).
          catch((err) => {
            done(generateErrorJSON(err.message, err));
          })
        }
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON({message: "Please enter valid customer ID"}));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.put = (customerId, balance, done) => {
  Customer.find({
    where: {
      id: customerId,
      isDeleted: false,
      isDisabled: false
    }
  }).
  then((customer) => {
    if(customer){
      db.query('UPDATE CustomerBalances SET balance = balance + ' + balance +
        ' WHERE customerId = ' + customerId +
        ' and isDeleted = 0').
      spread((data) => {
        if(data){
          CustomerBalance.find({
            where: {
              customerId: customerId
            },
            raw: true,
            attributes: customerBalanceAttributes
          }).
          then((customerBalance) => {
            if(customerBalance.balance < 0){
              db.query('UPDATE CustomerBalances SET balance = balance - ' + balance +
                ' WHERE customerId = ' + customerId +
                ' and isDeleted = 0')
              done(generateErrorJSON("Insufficient balance"))
            }else{
              done(null, customerBalance)
            }
          }).
          catch((err) => {
            done(generateErrorJSON(err.message, err));
          })
        }else{
          done(generateErrorJSON("Balance record does not exist for this Customer Id"));
        }
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON({message: "Please enter valid customer ID"}));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.get = (customerId, done) => {
  Customer.find({
    where: {
      id: customerId,
      isDeleted: false,
      isDisabled: false
    }
  }).
  then((customer) => {
    if(customer){
      CustomerBalance.find({
        where: {
          customerId: customerId,
          isDeleted: false
        },
        raw: true,
        attributes:customerBalanceAttributes
      }).
      then((data) => {
        done(null, data)
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON({message: "Please enter valid customer ID"}));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.getAll = (done) => {
  CustomerBalance.findAll({where:{isDeleted:false}, raw:true, attributes:customerBalanceAttributes}).
  then((balances) => {
    done(null,balances)
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}