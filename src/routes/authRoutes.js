const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController');
const authenticateToken=require('../middlewares/authMiddleware');
const checkRole=require('../middlewares/checkRole');
const passport=require('passport');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       properties:
 *         Username:
 *           type: string
 *           description: The username of the user
 *         Password:
 *           type: string
 *           description: The password of the user
 *         LastName:
 *           type: string
 *           description: The last name of the user
 *         FirstName:
 *           type: string
 *           description: The first name of the user
 *         Email:
 *           type: string
 *           description: The email of the user
 *         ImageFilePath:
 *           type: string
 *           description: The file path of the user's image
 *         Role:
 *           type: string
 *           description: The role of the user (Student or Teacher)
 *         SchoolName:
 *           type: string
 *           description: The school name (for students)
 *         Grade:
 *           type: string
 *           description: The grade (for students)
 *         AboutTeacher:
 *           type: string
 *           description: Information about the teacher (for teachers)
 *         LessonPrice:
 *           type: integer
 *           description: The price of a lesson (for teachers)
 *         LessonType:
 *           type: string
 *           description: The type of lesson (group or solo) (for teachers)
 *         MeetingType:
 *           type: string
 *           description: The type of meeting (offline or online) (for teachers)
 *         SubscriptionLevelId:
 *           type: integer
 *           description: The subscription level ID (for teachers)
 *     LoginUser:
 *       type: object
 *       properties:
 *         Email:
 *           type: string
 *           description: The email of the user
 *         Password:
 *           type: string
 *           description: The password of the user
 *     ResetPassword:
 *       type: object
 *       properties:
 *         Email:
 *           type: string
 *           description: The email of the user
 *     ChangePassword:
 *       type: object
 *       properties:
 *         NewPassword:
 *           type: string
 *           description: The new password of the user
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register',authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login',authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome to your profile
 */
//Пример защищенного  маршрута
router.get('/profile',authenticateToken,(req,res)=>{
    res.json({ message: 'Welcome to your profile!', user: req.user });
})

/**
 * @swagger
 * /api/auth/profile/student:
 *   get:
 *     summary: Get student profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome to your student profile
 */
//Пример защищенного  маршрута,доступ только для студента
router.get('/profile/student',authenticateToken,checkRole('Student'),(req,res)=>{
    res.json({ message: 'Welcome to your student profile!', user: req.user });
})


/**
 * @swagger
 * /api/auth/profile/teacher:
 *   get:
 *     summary: Get teacher profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome to your teacher profile
 */
//Пример защищенного  маршрута,доступ только для учителя
router.get('/profile/teacher',authenticateToken,checkRole('Teacher'),(req,res)=>{
    res.json({ message: 'Welcome to your teacher profile!', user: req.user });
});

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Reset password sent on Email
 */
//Маршрут до отправки сброса пароля по Email 
router.post('/request-password-resest/',authController.resetPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Change password successfully
 */
//Маршрут после отправки сброса пароля по Email
router.post('/reset-password/:token',authenticateToken,authController.changePassword);

/**
 * @swagger
 * /api/auth/register-email:
 *   post:
 *     summary: Register and send confirmation email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       200:
 *         description: A confirmation sheet has been sent to your email
 */
//Маршрут регистрации через потверждение Email
router.post('/register-email', authController.sendConfirmEmail);

/**
 * @swagger
 * /api/auth/confirm-email/{token}:
 *   post:
 *     summary: Confirm email and register user
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The confirmation token
 *     responses:
 *       201:
 *         description: User registered successfully and confirm email
 */
//Маршрут потверждения почты и регистрации 
router.post('/confirm-email/:token',authenticateToken, authController.confirmEmail);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
//Вход через Gmail(Oauth2)
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

/**
 * @swagger
 * /api/auth/google-callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.get('/google-callback',passport.authenticate('google',{session:false}),authController.oauthCallback);


/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Login with Facebook
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Facebook for authentication
 */
//Вход через Facebook(Oauth2)
router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));

/**
 * @swagger
 * /api/auth/facebook-callback:
 *   get:
 *     summary: Facebook OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.get('/facebook-callback',passport.authenticate('facebook',{session:false}),authController.oauthCallback);

module.exports=router;