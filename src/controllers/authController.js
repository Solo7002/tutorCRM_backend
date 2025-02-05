const authService=require('../services/authService');
const logger = require('../utils/logger');

//регистрация
const register=async(req,res)=>{
    try{
        const userData=req.body;
        const newUser=await authService.registerUser(userData);
        logger.info(`User registered: ${newUser.id}`);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(400).json({ message: error.message });
      }
}

const login=async(req,res)=>{
    try{
        const { Email, Password } = req.body;
        const { user, token } = await authService.loginUser(Email, Password);
        logger.info(`User logged in: ${user.id}`);
        res.status(200).json({ message: 'Login successful', user, token:token });

    }catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(400).json({ message: error.message });
      }

}
const resetPassword=async(req,res)=>{
    try{
        const{Email}=req.body;
        await authService.resetPasswordByService(Email);
        logger.info(`Password reset email sent to: ${Email}`);
        res.status(200).json({message:'Reset password send on Email'});
    }catch(error){
        logger.error(`Reset password error: ${error.message}`);
        res.status(400).json({message: error.message});
    }
}

const changePassword=async(req,res)=>{
    try{
        const {token}=req.params;
        const {NewPassword}=req.body;
        await authService.resetAndChangePassword(token,NewPassword);
        logger.info(`Password changed for token: ${token}`);
        res.status(200).json({message:'Change password succesfully'});
    }catch(error){
        logger.error(`Change password error: ${error.message}`);
        res.status(400).json({message: error.message}); 
    }
    
}

const sendConfirmEmail=async(req,res)=>{
    try{
        const userData = req.body;
        await authService.registerAndSendEmailConfirmation(userData);
        logger.info(`Confirmation email sent to: ${userData.Email}`);
        res.status(200).json({message:'A confirmation sheet has been sent to your email.'});
    }catch(error){
        logger.error(`Send confirmation email error: ${error.message}`);
        res.status(400).json({message: error.message}); 
    }
    
}

const confirmEmail=async(req,res)=>{
    try{
        const {token}=req.params;
        const newUser=await authService.verifyEmailAndRegisterUser(token);
        logger.info(`Email confirmed for user: ${newUser.id}`);
        res.status(201).json({ message: 'User registered successfully and confirm email', user: newUser });
    }catch(error){
        logger.error(`Email confirmation error: ${error.message}`);
        res.status(400).json({message: error.message}); 
    }
    
}


const oauthCallback=async(req,res)=>{
    try{
            const user=req.user;
            const token =authService.loginToOuth2(user);
            logger.info(`OAuth login successful for user: ${user.Username}`);
            res.status(200).json({ message: 'Login successful', user, token:token });
    }catch(error){
        logger.error(`OAuth login error: ${error.message}`);
        res.status(400).json({message:error.message});
    }
}

module.exports={
    register,
    login,
    resetPassword,
    changePassword,
    sendConfirmEmail,
    confirmEmail,
    oauthCallback
}