const {Router} = require('express');
const router = Router();
const {post, getAll, get, put} = require('../controllers/customerBalance.controller');

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

router.get('/:customerId', (req, res) => {
  if (req.params.customerId) {
    get(req.params.customerId, (err, result) => {
      if (err) {
        res.statusCode = 200
        res.json({success:0, error:err.error})
      }else if(result == null){
        res.statusCode = 200
        res.json({success:0, error: "No balance record available for this customer"})
      }
      else {
        res.statusCode = 200
        res.json({success:1, response: result})
      }
    });
  }
  else {
    res.statusCode = 200
    res.json({success:0, error: "Please enter customer id"})
  }
});

router.get('/',(req,res) => {
  getAll((err,result) => {
    if(err){
      res.statusCode=200
      res.json({success:0, error:err.error})
    }else if(result.length == 0){
      res.statusCode = 200
      res.json({success:0, error:'No balance record available yet'})
    }else{
      res.statusCode=200
      res.json({success:1, response:result})
    }
  })
})

router.put('/:customerId',(req,res) => {
  if(req.params.customerId){
    put(req.params.customerId,req.body.balance,(err,result) => {
      if(err){
        res.statusCode = 200
        res.json({success:0, error:err.error})
      }else if(result == null){
        res.statusCode = 200
        res.json({success:0, error:'Cannot update balance because no record available with this customer id'})
      }else{
        res.statusCode=200
        res.json({success:1, response:result})
      }
    })
  }else{
    res.statusCode=200
    res.json({success:0, error:"Please enter customer id"})
  }
})

module.exports = router;