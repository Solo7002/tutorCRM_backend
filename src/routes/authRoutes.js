const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController');
const authenticateToken=require('../middlewares/authMiddleware');

router.post('/register',authController.register);
router.post('/login',authController.login);

//Примеи защищенного  маршрута
router.get('/profile',authenticateToken,(req,res)=>{
    res.json({ message: 'Welcome to your profile!', user: req.user });
})

module.exports=router;