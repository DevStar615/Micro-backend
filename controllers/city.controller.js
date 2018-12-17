const City = require('../schemas/city.schema');
const Customer = require('../schemas/customer.schema');
const State = require('../schemas/state.schema');
const Country = require('../schemas/country.schema');
const {generateErrorJSON} = require('../shared/common');
const {cityAttributes}= require('./../configs/general');
const {db} = require('./../configs/database.js');

exports.get = (id, done) => {
  City.find({where:{id:id, isDeleted:false}, raw:true, attributes: cityAttributes}).
  then((city) => {
    done(null,city);
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  });
}

exports.getAll = (done) => {
  City.findAll({where:{isDeleted:false}, raw:true, attributes: cityAttributes}).
  then((city) => {
    done(null,city)
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.remove = (id,done) => {
  Customer.findAll({where:{cityId:id, isDeleted:false}}).
  then((customers) => {
    if(customers.length == 0){
      City.find({where:{id:id, isDeleted:false}}).
      then((city) => {
        if(city) {
          city.updateAttributes({
            isDeleted: true
          }).
          then((deletedCity) => {
            done(null, deletedCity)
          }).
          catch((err) =>{
            done(generateErrorJSON(err.message, err));
          })
        }else{
          done(generateErrorJSON("City does not exist with this Id"));
        }
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON('Cannot delete City because it is used in customers table. Please delete all customers related to this city'));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.put = (id, body, done) => {
  City.update(body,{where:{id:id, isDeleted: false}}).
  then((isUpdated) => {
    if(isUpdated[0]){
      City.find({where:{id:id},raw:true,attributes: cityAttributes}).
      then((city) => {
        done(null, city);
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else{
      done(generateErrorJSON("City does not exist with this Id"));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.post = (body, done) => {
  State.find({
    where: {
      id: body.stateId,
      isDeleted: false
    }
  }).
  then((state) => {
    if(state) {
      City.create(body).
      then((newCity) => {
        if (newCity) {
          done(null, newCity);
        }
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON({message: "Please enter valid state ID"}));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.getState = (id, done) => {
  State.find({
    where: {
      id: id,
      isDeleted: false
    }
  }).
  then((state) => {
    if(state) {
      City.findAll({
        where: {
          stateId: id,
          isDeleted: false
        },
        raw: true,
        attributes: cityAttributes
      }).
      then((city) => {
        done(null, city)
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON({message: "Please enter valid state ID"}));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.getCitiesByCountryId = (id, done) => {
  Country.find({
    where: {
      id:id,         
      isDeleted: false
    }
  }).
  then((country) => {
    if(country){
      db.query("SELECT id, cityName FROM `Cities` WHERE stateId in (SELECT id FROM `States` WHERE countryId = "+id+" and isDeleted = 0) and isDeleted = 0").
      spread((data) => {
        if(data)
          done(null, data)
        else
          done(generateErrorJSON({message: "Problem while fetching data"}));
      }).
      catch((err) => {
        if(err)
          done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON({message: "Please enter valid country ID"}));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })

}