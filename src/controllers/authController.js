const authService = require('../services/authService');
const logger = require('../utils/logger');
const teacherContoller=require('./dbControllers/teacherController');

require('dotenv').config();

//регистрация
const register = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await authService.registerUser(userData);
        logger.info(`User registered: ${newUser.id}`);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const { user, token } = await authService.loginUser(Email, Password);
        logger.info(`User logged in: ${user.id}`);
        res.status(200).json({ message: 'Login successful', user, token: token });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }

}

const resetPassword = async (req, res) => {
    try {
        const { Email } = req.body;
        await authService.resetPasswordByService(Email);
        logger.info(`Password reset email sent to: ${Email}`);
        res.status(200).json({ message: 'Reset password send on Email' });
    } catch (error) {
        logger.error(`Reset password error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
}

const changePassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { NewPassword } = req.body;
        await authService.resetAndChangePassword(token, NewPassword);
        logger.info(`Password changed for token: ${token}`);
        res.status(200).json({ message: 'Change password succesfully' });
    } catch (error) {
        logger.error(`Change password error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }

}

const resetPasswordWithNew = async (req, res) => {
    try {
        const { Email } = req.body;
        await authService.resetPasswordWithNew(Email);
        logger.info(`New password reset email sent to: ${Email}`);
        res.status(200).json({ message: 'Новый пароль отправлен на Email' });
    } catch (error) {
        logger.error(`Reset new password error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

const sendConfirmEmail = async (req, res) => {
    try {
        const userData = req.body;
        await authService.registerAndSendEmailConfirmation(userData);
        logger.info(`Confirmation email sent to: ${userData.Email}`);
        res.status(200).json({ message: 'A confirmation sheet has been sent to your email.' });
    } catch (error) {
        logger.error(`Send confirmation email error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }

}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const newUser = await authService.verifyEmailAndRegisterUser(token);
        logger.info(`Email confirmed for user: ${newUser.id}`);
        res.status(201).json({ message: 'User registered successfully and confirm email', user: newUser });
    } catch (error) {
        logger.error(`Email confirmation error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }

}


const sendVerificationCode = async (req, res) => {
    try {
        const userData = req.body;
        await authService.registerAndSendEmailCode(userData);
        logger.info(`Verification code sent to: ${userData.Email}`);
        res.status(200).json({ message: 'Verification code has been sent to your email.' });
    } catch (error) {
        logger.error(`Send verification code error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

const confirmEmailWithCode = async (req, res) => {
    try {
        const { Email, Code } = req.body;
        const userData = req.body;
        const newUser = await authService.verifyEmailCodeAndRegisterUser(Email, Code, userData);
        logger.info(`Email confirmed for user: ${newUser.id}`);
        res.status(201).json({ message: 'User registered successfully and email confirmed', user: newUser });
    } catch (error) {
        logger.error(`Email confirmation with code error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};


/*const oauthCallback=async(req,res)=>{
    try{
            const user=req.user;
            const token =authService.loginToOuth2(user);
            logger.info(`OAuth login successful for user: ${user.Username}`);
            res.status(200).json({ message: 'Login successful', user, token:token });
    }catch(error){
        logger.error(`OAuth login error: ${error.message}`);
        res.status(400).json({message:error.message});
    }
}*/

const oauthCallback = async (req, res) => {
    try {
        const user = req.user;
        const token = authService.loginToOuth2(user);
        logger.info(`OAuth login successful for user: ${user}`);
         console.log("user: ", user);
          
        if (user.UserId) {
            const isTeacher=teacherContoller.checkIfTeacher(user.UserId);

            console.log("----- url_params: ", `${process.env.BASE_REACT_URL}/auth/login/${token}`);
 
            if(isTeacher)
                 res.redirect(`${process.env.BASE_REACT_URL}/auth/login/${token}/${isTeacher}`);

            else
                res.redirect(`${process.env.BASE_REACT_URL}/auth/login/${token}/${isTeacher}`);
             
            
        } else {
            const firstName = user.Firstname || '';
            const lastName = user.Lastname || '';
            res.redirect(`${process.env.BASE_REACT_URL}/auth/register?token=${token}&email=${user.Email}&firstName=${firstName}&lastName=${lastName}`);
        }
    } catch (error) {
        logger.error(`OAuth login error: ${error.message}`);
        res.redirect(`${process.env.BASE_REACT_URL}/auth/login?error=${encodeURIComponent(error.message)}`);
    }
};

const changeProfilePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newPassword } = req.body;
        
        const result = await authService.changeProfilePassword(userId, newPassword);
        logger.info(`Password changed for user: ${userId}`);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Change profile password error: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    resetPassword,
    changePassword,
    resetPasswordWithNew,
    sendConfirmEmail,
    confirmEmail,
    oauthCallback,
    sendVerificationCode,
    confirmEmailWithCode,
    changeProfilePassword
}