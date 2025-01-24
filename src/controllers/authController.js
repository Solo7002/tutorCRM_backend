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

module.exports={
    register,
    login
}