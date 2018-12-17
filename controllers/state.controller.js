const City = require('../schemas/city.schema');
const State = require('../schemas/state.schema');
const Customers = require('../schemas/customer.schema');
const Country = require('../schemas/country.schema');
const {generateErrorJSON} = require('../shared/common');
const {stateAttributes}= require('./../configs/general');

exports.get = (id, done) => {
  State.find({where:{id:id, isDeleted:false}, raw:true, attributes: stateAttributes}).
  then((state) => {
    done(null,state);
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  });
}

exports.getAll = (done) => {
  State.findAll({where:{isDeleted:false}, raw:true, attributes: stateAttributes}).
  then((states) => {
      done(null,states)
    }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.remove = (id,done) => {
  City.findAll({where:{stateId:id, isDeleted:false}}).
  then((cities) => {
    if(cities.length ==0){
      Customers.findAll({where:{stateId:id, isDeleted:false}}).
      then((customers) => {
        if(customers.length == 0) {
          State.find({where:{id:id, isDeleted:false}}).
          then((state) => {
            if(state) {
              state.updateAttributes({
                isDeleted: true
              }).
              then((deletedState) => {
                done(null, deletedState)
              }).
              catch((err) => {
                done(generateErrorJSON(err.message, err));
              })
            }else{
              done(generateErrorJSON("State does not exist with this id"));
            }
          }).
          catch((err) => {
            done(generateErrorJSON(err.message, err));
          })
        }else {
          done(generateErrorJSON('Cannot delete State because it is used in customer table. Please delete all customers related to this state'));
        }
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else {
      done(generateErrorJSON('Cannot delete State because it is used in City table. Please delete all cities related to this state'));
    }
  }).catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.put = (id, body, done) => {
  State.update(body,{where:{id:id, isDeleted:false}}).
  then((isUpdated) => {
    if(isUpdated[0]){
      State.find({where:{id:id},raw:true,attributes: stateAttributes}).
      then((state) => {
        done(null, state);
      }).
      catch((err) => {
        done(generateErrorJSON(err.message, err));
      })
    }else{
      done(generateErrorJSON("State does not exist with this id"));
    }
  }).
  catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.post = (body, done) => {
  Country.find({
    where: {
      id: body.countryId,
      isDeleted: false
    }
  }).
  then((country) => {
    if(country) {
      State.create(body).
      then((newState) => {
        if (newState) {
          done(null, newState);
        }
      }).
      catch((err) => {
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

exports.getStateByCountryId = (id, done) => {
  Country.find({
    where: {
      id: id,
      isDeleted: false
    }
  }).
  then((country) => {
    if(country) {
      State.findAll({
        where: {
          countryId: id,
          isDeleted: false
        },
        raw: true,
        attributes: stateAttributes
      }).
      then((state) => {
        done(null, state)
      }).
      catch((err) => {
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