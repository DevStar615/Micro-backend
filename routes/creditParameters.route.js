const {Router} = require('express');
const router = Router();
const {getAll, post, put} = require('../controllers/creditParameters.controller');

router.get('/',(req,res) => {
  getAll((err,result) => {
    if(err){
      res.statusCode=200;
      res.json({success:0, error:err.error});
    }else if(result.length == 0){
      res.statusCode = 200;
      res.json({success:0, error:'No credit details available yet'});
    }else{
      res.statusCode=200;
      res.json({success:1, response:result});
    }
  })
})

router.post('/', (req, res) => {
  post(req.body, (err, result) => {
    if(err){
      res.statusCode = 200;
      res.json({success:0, error:err.error});
    }
    else {
      res.statusCode = 200;
      res.json({success:1, response:result});
    }
  })
})

router.put('/:id', (req, res) => {
  if(req.params.id){
    put(req.params.id,req.body,(err,result) => {
      if(err){
        res.statusCode = 200;
        res.json({success:0, error:err.error})
      }else if(result.length == 0){
        res.statusCode = 200;
        res.json({success:0, error:'Cannot update credit record because no credit data available with such id'});
      }else{
        res.statusCode=200;
        res.json({success:1, response:result});
      }
    })
  }else{
    res.statusCode=200;
    res.json({success:0, error:'Credit id not available'})
  }
})

module.exports = router;