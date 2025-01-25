const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { User, Student, Teacher } = require('../models/dbModels');
const{JWT_SECRET,JWT_EXPIRATION,JWT_TEMPTIME}=process.env;
const emailService=require('../services/emailService');
//Хеширование пароля
const hashPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10);
    return bcrypt.hash(password,salt);
}

//Сравнение паролей
const comparePassword=async(password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword);
}

//Регистрация пользователя
const registerUser=async(user)=>{
    try{
     
        const hashPassworde = await hashPassword(user.Password); 
       
        const newUser = await User.create({
            Username: user.Username,
            Password: hashPassworde,
            LastName: user.LastName,
            FirstName: user.FirstName,
            Email: user.Email,
            ImageFilePath: user.ImageFilePath,
          });
        
        if(user.Role==='Student'){
            const newStudent =await Student.create({
                UserId:newUser.UserId,
                SchoolName:user.SchoolName,
                Grade:user.Grade
            });
            additionalId = newStudent.StudentId;
            await newUser.update({ StudentId: additionalId });
        }else if(user.Role==='Teacher'){
            const newTeacher = await Teacher.create({
                UserId:newUser.UserId,
                AboutTeacher: user.AboutTeacher,
                LessonPrice: user.LessonPrice,
                LessonType: user.LessonType,
                MeetingType: user.MeetingType,
                SubscriptionLevelId: user.SubscriptionLevelId,
                
            });
            additionalId = newTeacher.TeacherId;
            await newUser.update({ TeacherId: additionalId });
        }

       
        return newUser;

    }catch(error){

        throw new Error('Error registering user:'+error.message);
    }
}

//Регистрация пользователя с потверждением Email 
const registerAndSendEmailConfirmation=async(user)=>{
    try{  
    const token=jwt.sign(user,JWT_SECRET,{expiresIn:JWT_TEMPTIME});
    const link=`${process.env.BASE_URL}/api/auth/confirm-email/${token}`;
    await emailService.sendRegistrationEmail(user.Email,user.Username,link)
        
    }catch(error){

        throw new Error('Error registering user:'+error.message);
    }
}
//Регистрация пользователя после потверждения Email
const verifyEmailAndRegisterUser = async(token)=>{
    try{
        const decodedData = jwt.verify(token, JWT_SECRET);
        const hashPassworde = await hashPassword(decodedData.Password); 
      
       
        const newUser = await User.create({
            Username: decodedData.Username,
            Password: hashPassworde,
            LastName: decodedData.LastName,
            FirstName: decodedData.FirstName,
            Email: decodedData.Email,
            ImageFilePath: decodedData.ImageFilePath,
        });
        
        let additionalId;
        if (decodedData.Role === 'Student') {
            const newStudent = await Student.create({
                UserId: newUser.UserId,
                SchoolName: decodedData.SchoolName,
                Grade: decodedData.Grade,
            });
            additionalId = newStudent.StudentId;
            await newUser.update({ StudentId: additionalId }); 
        } else if (decodedData.Role === 'Teacher') {
            const newTeacher = await Teacher.create({
                UserId: newUser.UserId,
                AboutTeacher: decodedData.AboutTeacher,
                LessonPrice: decodedData.LessonPrice,
                LessonType: decodedData.LessonType,
                MeetingType: decodedData.MeetingType,
                SubscriptionLevelId: decodedData.SubscriptionLevelId,
            });
            additionalId = newTeacher.TeacherId;
            await newUser.update({ TeacherId: additionalId }); 
        }
    
        return newUser;
    }catch(error){
        throw new Error('Error registering user:',error.message);
    }
}

const loginUser=async(Email,Password)=>{
    try{
        const user=await User.findOne({where:{Email:Email}});
        if(!user){
            throw new Error("User not found or invalid password");
        }
        const isPasswordValid=await comparePassword(Password,user.Password);
        if(!isPasswordValid){
            throw new Error("User not found or invalid password");
        }
        const token=jwt.sign({id:user.UserId,email:user.Email},JWT_SECRET,{expiresIn:JWT_EXPIRATION})
        return {user,token};
    }catch(error){
        throw new Error(error.message);
    };

};

const resetPasswordByService=async(Email)=>{
    try{
        const user=await User.findOne({where:{Email:Email}});
        if(!user){
            throw new Error("User not found");
        }
        const token=jwt.sign({id:user.UserId,email:user.Email},JWT_SECRET,{expiresIn:JWT_TEMPTIME});
        const link=`${process.env.BASE_URL}/api/auth/reset-password/${token}`;
      
        emailService.sendResetPasswordEmail(user.Email,user.Username,link);

    }catch(error)
    {
        throw new Error(error.message);
    }
}

const resetAndChangePassword=async(token,NewPassword)=>{
    try{
       const decode=jwt.verify(token,JWT_SECRET);
      const user=await User.findOne({where:{UserId:decode.id}});
       if(!user){
        throw new Error("User not found");
        }
        const hashPassworde = await hashPassword(NewPassword); 
        await user.update({Password:hashPassworde});
      
    }catch(error){
        throw new Error(error.message);
    }
}


module.exports={
    loginUser,
    registerUser,
    resetPasswordByService,
    resetAndChangePassword,
    registerAndSendEmailConfirmation,
    verifyEmailAndRegisterUser
}
