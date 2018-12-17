const {Router} = require('express');
const router = Router();
const {post, getAll, get, put, remove, getState,getCitiesByCountryId} = require('../controllers/city.controller');
//const {verifiedSuperAdmin,verifiedToken} = require('../middlewares/verifyToken')

//Get City by Id
router.get('/:id', (req, res) => {
  if (req.params.id) {
    get(req.params.id, (err, result) => {
      if (err) {
        res.statusCode = 200;
        res.json({success:0, error:err.error});
      }else if(result == null){
        res.statusCode = 200;
        res.json({success:0, error:"No city available with this id"});
      }
      else {
        res.statusCode = 200;
        res.json({success:1, response:result});
      }
    });
  }
  else {
    res.statusCode = 200;
    res.json({success:0, error:"Please enter city id"})
  }
});

//Get all cities
router.get('/',(req,res) => {
  getAll((err,result) => {
    if(err){
      res.statusCode=200;
      res.json({success:0, error:err.error});
    }else if(result.length == 0){
      res.statusCode = 200;
      res.json({success:0, error:'No cities available yet'});
    }else{
      res.statusCode=200;
      res.json({success:1, response:result});
    }
  })
})

//Delete city by Id
router.delete('/:id',(req,res) => {
  if(req.params.id){
    remove(req.params.id,(err,result) => {
      if(err){
        res.statusCode = 200
        res.json({success:0, error:err.error});
      }else if(result.length == 0){
        res.statusCode = 200
        res.json({success:0, error:'Cannot delete city because no city available with such Id'})
      }else{
        res.statusCode = 200
        res.json({success:1, response:result});
      }
    })
  }else{
    res.statusCode=200;
    res.json({success:0, error:"Please enter city id"})
  }
})

//Update City by Id
router.put('/:id',(req,res) => {
  if(req.params.id){
    put(req.params.id,req.body,(err,result) => {
      if(err){
        res.statusCode = 200
        res.json({success:0, error:err.error});
      }else if(result.length == 0){
        res.statusCode = 200;
        res.json({success:0, error:'Cannot update city because no city available with such id'});
      }else{
        res.statusCode=200;
        res.json({success:1, response:result});
      }
    })
  }else{
    res.statusCode=200;
    res.json({success:0, error:"Please enter city id"})
  }
})

//Create City
router.post('/', (req, res) => {
  post(req.body, (err, result) => {
    if (err) {
      res.statusCode = 200;
      res.json({success:0, error:err.error});
    }
    else {
      res.statusCode = 202;
      res.json({success:1, response:result});
    }
  });
});

//Get all cities by stateID
router.get('/state/:stateId',(req,res) => {
  if (req.params.stateId) {
    getState(req.params.stateId, (err, result) => {
      if (err) {
        res.statusCode = 200;
        res.json({success:0, error:err.error});
      }else if(result.length == 0){
        res.statusCode = 200;
        res.json({success:0, error:'No cities available with this state ID'});
      }
      else {
        res.statusCode = 200
        res.json({success:1, response:result});
      }
    });
  }
  else {
    res.statusCode = 200;
    res.json({success:0, error:"Please enter state id"})
  }
})

//Get all cities by countryID
router.get('/country/:countryId',(req,res) => {
  if (req.params.countryId) {
    getCitiesByCountryId(req.params.countryId, (err, result) => {
      if (err) {
        res.statusCode = 200;
        res.json({success:0, error:err.error});
      }else if(result.length == 0){
        res.statusCode = 200;
        res.json({success:0, error:'No cities available with this country Id'});
      }
      else {
        res.statusCode = 200
        res.json({success:1, response:result});
      }
    });
  }
  else {
    res.statusCode = 200;
    res.json({success:0, error:"Please enter country id"})
  }
})

module.exports = router;