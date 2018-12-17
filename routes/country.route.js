const {Router} = require('express');
const router = Router();
const {post, getAll, get, put, remove} = require('../controllers/country.controller');
//const {verifiedSuperAdmin,verifiedToken} = require('../middlewares/verifyToken')

//Get Country by Id
router.get('/:id', (req, res) => {
  if (req.params.id) {
    get(req.params.id, (err, result) => {
      if (err) {
        res.statusCode = 200
        res.json({success:0, error:err.error})
      }else if(result == null){
        res.statusCode = 200
        res.json({success:0, error: "No country available with this Id"})
      }
      else {
        res.statusCode = 200
        res.json({success:1, response: result})
      }
    });
  }
  else {
    res.statusCode = 200
    res.json({success:0, error: "Please enter country id"})
  }
});

//Get All Country
router.get('/',(req,res) => {
  getAll((err,result) => {
    if(err){
      res.statusCode=200
      res.json({success:0, error:err.error})
    }else if(result.length == 0){
      res.statusCode = 200
      res.json({success:0, error:'No countries available yet'})
    }else{
      res.statusCode=200
      res.json({success:1, response:result})
    }
  })
})

//Delete Country By Id
router.delete('/:id',(req,res) => {
  if(req.params.id){
    remove(req.params.id,(err,result) => {
      if(err){
        res.statusCode = 200
        res.json({success:0, error:err.error})
      }else if(result.length == 0){
        res.statusCode = 200
        res.json({success:0, error:'Cannot delete country because no country available with such Id'})
      }else{
        res.statusCode = 200
        res.json({success:1, response:result})
      }
    })
  }else{
    res.statusCode=200
    res.json({success:0, error:"Please enter country id"})
  }
})

//Update Country By Id
router.put('/:id',(req,res) => {
  if(req.params.id){
    put(req.params.id,req.body,(err,result) => {
      if(err){
        res.statusCode = 200
        res.json({success:0, error:err.error})
      }else if(result.length == 0){
        res.statusCode = 200
        res.json({success:0, error:'Cannot update country because no country available with such id'})
      }else{
        res.statusCode=200
        res.json({success:1, response:result})
      }
    })
  }else{
    res.statusCode=200
    res.json({success:0, error:"Please enter country id"})
  }
})

//Create Country
router.post('/', (req, res) => {
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

module.exports = router;