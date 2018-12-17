const Country = require('../schemas/country.schema');
const State = require('../schemas/state.schema');
const Customer = require('../schemas/customer.schema');
const {generateErrorJSON} = require('../shared/common');
const {countryAttributes}= require('./../configs/general');

exports.get = (id, done) => {
  Country.find({where:{id:id, isDeleted:false}, raw:true, attributes: countryAttributes}).
  then((country) => {
    done(null,country);
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  });
}

exports.getAll = (done) => {
  Country.findAll({where:{isDeleted:false}, raw:true, attributes: countryAttributes})
  .then((country) => {
      done(null,country)
    }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.remove = (id,done) => {
  State.findAll({where:{countryId:id, isDeleted:false}}).
  then((states) => {
    if(states.length == 0){
      Customer.findAll({where:{countryId:id, isDeleted:false}}).
      then((customers) => {
        if(customers.length == 0) {
          Country.find({where:{id:id, isDeleted:false}}).then((country) => {
            if(country) {
              country.updateAttributes({
                isDeleted: true
              }).
              then((deletedCountry) => {
                done(null, deletedCountry)
              }).
              catch((err) => {
                done(generateErrorJSON(err.message, err));
              })
            }else{
              done(generateErrorJSON("Country does not exist with this id"));
            }
          })
        }else {
          done(generateErrorJSON('Cannot delete Country because it is used in customers table. Please delete all customers related to this country'));
        }
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON('Cannot delete Country because it is used in State table. Please delete all states related to this country'));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.put = (id, body, done) => {
  Country.update(body,{where:{id:id, isDeleted:false}}).
  then((isUpdated) => {
    if(isUpdated[0]){
      Country.find({where:{id:id},raw:true,attributes: countryAttributes}).
      then((country) => {
        done(null, country);
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else{
      done(generateErrorJSON("Country does not exist with this id"));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.post = (body, done) => {
  Country.create(body).
  then((newCountry) => {
    if(newCountry){
      done(null,newCountry);
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}