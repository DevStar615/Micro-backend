const CreditParameter = require('../schemas/creditParameters.schema')
const{generateErrorJSON} = require('../shared/common')
const {creditAttributes}= require('./../configs/general')

exports.getAll = (done) => {
  CreditParameter.findAll({where:{isDeleted:false}, raw:true, attributes: creditAttributes})
    .then((credits) => {
      done(null,credits);
    }).catch((err) => {
    done(generateErrorJSON(err.message, err));
  })
}

exports.post = (body, done) => {
  CreditParameter.find({where:{key:body.key, isDeleted:false}}).
    then((creditRecord) => {
      if(creditRecord)
        done(generateErrorJSON('This key is already available'))
      else {
        CreditParameter.create(body).then((credit) => {
          if(credit)
            done(null, credit)
        }).catch((err) => {
          done(generateErrorJSON(err.message,err))
        })
      }
  }).catch((err) => {
    done(generateErrorJSON(err.message,err))
  })
}

exports.put = (id, body, done) => {
  CreditParameter.update(body, {where:{id:id, isDeleted:false}}).
    then((updated) => {
      if(updated[0]) {
        CreditParameter.find({where:{id: id, isDeleted:false}}).
          then((creditRecord) => {
            done(null, creditRecord)
        }).catch((err) => {
          done(generateErrorJSON(err.message, err))
        })
      }else {
        done(generateErrorJSON('Credit record does not exist with this id'))
      }
  }).catch((err) => {
    done(generateErrorJSON(err.message, err))
  })
}