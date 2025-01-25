const authService=require('../services/authService');

//регистрация
const register=async(req,res)=>{
    try{
        const userData=req.body;
        const newUser=await authService.registerUser(userData);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }catch (error) {
        res.status(400).json({ message: error.message });
      }
}

const login=async(req,res)=>{
    try{
        const { Email, Password } = req.body;
        const { user, token } = await authService.loginUser(Email, Password);
        res.status(200).json({ message: 'Login successful', user, token });

    }catch (error) {
        res.status(400).json({ message: error.message });
      }

}
const resetPassword=async(req,res)=>{
    try{
        const{Email}=req.body;
        await authService.resetPasswordByService(Email);
        res.status(200).json({message:'Reset password send on Email'});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

const changePassword=async(req,res)=>{
    try{
        const {token}=req.params;
        const {NewPassword}=req.body;
        await authService.resetAndChangePassword(token,NewPassword);
        res.status(200).json({message:'Change password succesfully'});
    }catch(error){
        res.status(400).json({message: error.message}); 
    }
    
}

const sendConfirmEmail=async(req,res)=>{
    try{
        const userData = req.body;
        await authService.registerAndSendEmailConfirmation(userData);
        res.status(200).json({message:'A confirmation sheet has been sent to your email.'});
    }catch(error){
        res.status(400).json({message: error.message}); 
    }
    
}

const confirmEmail=async(req,res)=>{
    try{
        const {token}=req.params;
        const newUser=await authService.verifyEmailAndRegisterUser(token);
        res.status(201).json({ message: 'User registered successfully and confirm email', user: newUser });
    }catch(error){
        res.status(400).json({message: error.message}); 
    }
    
}

module.exports={
    register,
    login,
    resetPassword,
    changePassword,
    sendConfirmEmail,
    confirmEmail
}