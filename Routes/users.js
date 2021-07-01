const express = require('express');
const router = express.Router();

router.get('/login',(req,res)=>{
    const user = {id:1, mail:"test@mailru"};
    res.json(user);
});

module.exports = router;