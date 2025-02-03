const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController');
const authenticateToken=require('../middlewares/authMiddleware');
const checkRole=require('../middlewares/checkRole');
const passport=require('passport');

router.post('/register',authController.register);
router.post('/login',authController.login);

//Пример защищенного  маршрута
router.get('/profile',authenticateToken,(req,res)=>{
    res.json({ message: 'Welcome to your profile!', user: req.user });
})

//Пример защищенного  маршрута,доступ только для студента
router.get('/profile/student',authenticateToken,checkRole('Student'),(req,res)=>{
    res.json({ message: 'Welcome to your student profile!', user: req.user });
})


//Пример защищенного  маршрута,доступ только для учителя
router.get('/profile/teacher',authenticateToken,checkRole('Teacher'),(req,res)=>{
    res.json({ message: 'Welcome to your teacher profile!', user: req.user });
})
//Маршрут до отправки сброса пароля по Email 
router.post('/request-password-resest/',authController.resetPassword);
//Маршрут после отправки сброса пароля по Email
router.post('/reset-password/:token',authenticateToken,authController.changePassword);

//Маршрут регистрации через потверждение Email
router.post('/register-email', authController.sendConfirmEmail);
//Маршрут потверждения почты и регистрации 
router.post('/confirm-email/:token',authenticateToken, authController.confirmEmail);

//Вход через Gmail(Oauth2)
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google-callback',passport.authenticate('google',{session:false}),authController.oauthCallback);

//Вход через Facebook(Oauth2)
router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));
router.get('/facebook-callback',passport.authenticate('facebook',{session:false}),authController.oauthCallback);

module.exports=router;