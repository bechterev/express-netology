const express = require('express');
const router = express.Router();


router.get("/",(req, res)=>{
    const user = {id:1, mail:"test@mailru"};
    res.render("users/index",
    {users:[user], title: "Users"})
})
module.exports = router;