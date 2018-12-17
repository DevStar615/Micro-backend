const {Router} = require('express');
const router = Router();
const {post, getAll, get, put, remove, getStateByCountryId} = require('../controllers/state.controller');
//const {verifiedToken,verifiedSuperAdmin} = require('../middlewares/verifyToken')

//Get State from id
router.get('/:id',(req, res) => {
  if (req.params.id) {
    get(req.params.id, (err, result) => {
      if (err) {
        res.statusCode = 200;
        res.json({success:0, error:err.error});
      }else if(result == null){
        res.statusCode = 200;
        res.json({success:0, error:'No state available with this ID'});
      }
      else {
        res.statusCode = 200;
        res.json({success:1, response:result});
      }
    });
  }
  else {
    res.statusCode = 200;
    res.json({success:0, error:"Please enter state id"})
  }
});

//Get All States
router.get('/',(req,res) => {
  getAll((err,result) => {
    if(err){
      res.statusCode=200;
      res.json({success:0, error:err.error});
    }else if(result.length == 0){
      res.statusCode = 200;
      res.json({success:0, error:'No states available yet'});
    }else{
      res.statusCode=200;
      res.json({success:1, response:result});
    }
  })
})

//Delete State by Id
router.delete('/:id',(req,res) => {
  if(req.params.id){
    remove(req.params.id,(err,result) => {
      if(err){
        res.statusCode = 200
        res.json({success:0, error:err.error})
      }else if(result.length == 0){
        res.statusCode = 200
        res.json({success:0, error:'Cannot delete state because no state available with such Id'})
      }else{
        res.statusCode = 200
        res.json({success:1, response:result})
      }
    })
  }else{
    res.statusCode=200;
    res.json({success:0, error:"Please enter state id"})
  }
})

//Update State by Id
router.put('/:id',(req,res) => {
  if(req.params.id){
    put(req.params.id,req.body,(err,result) => {
      if(err){
        res.statusCode = 200;
        res.json({success:0, error:err.error})
      }else if(result.length == 0){
        res.statusCode = 200;
        res.json({success:0, error:'Cannot update state because no state available with such id'});
      }else{
        res.statusCode=200;
        res.json({success:1, response:result});
      }
    })
  }else{
    res.statusCode=200;
    res.json({success:0, error:"Please enter state id"})
  }
})

//Create State
router.post('/',(req, res) => {
  post(req.body, (err, result) => {
    if (err) {
      res.statusCode = 200
      res.json({success:0, error:err.error})
    }
    else {
      res.statusCode = 200
      res.json({success:1, response:result})
    }
  });
});

//Get all States by countryID
router.get('/country/:countryId',(req,res) => {
  if (req.params.countryId) {
    getStateByCountryId(req.params.countryId, (err, result) => {
      if (err) {
        res.statusCode = 200;
        res.json({success:0, error:err.error});
      }else if(result.length == 0){
        res.statusCode = 200;
        res.json({success:0, error:'No states available with this country ID'});
      }
      else {
        res.statusCode = 200
        res.json({success:1, response:result})
      }
    });
  }
  else {
    res.statusCode = 200
    res.json({success:0, error:"Please enter state id"})
  }
})

module.exports = router;