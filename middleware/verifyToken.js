const jwt = require('jsonwebtoken');
const {jwtConfig} = require('../configs/general');
const {generateErrorJSON} = require('../shared/common');

exports.verifiedToken = (req,res,next) => {
  const token = req.headers['authorization'];
  if(token){
    jwt.verify(token,jwtConfig.secret,(err, decoded) => {
      if(err){
        res.statusCode = 400
        return res.json(generateErrorJSON(err.message,err))
      }
      req.decoded = decoded;
      next();
    })
  }else{
    res.statusCode = 403
    res.json({success:0, error:'Token is required.'})
  }
}