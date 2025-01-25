const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { User, Student, Teacher } = require('../models');
const{JWT_SECRET,JWT_EXPIRATION}=process.env;

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
        console.log("User data:", user);
        
        const hashPassworde = await hashPassword(user.Password); 
       
        const newUser = await User.create({
            Username: user.Username,
            Password: hashPassworde,
            LastName: user.LastName,
            FirstName: user.FirstName,
            Email: user.Email,
            ImageFilePath: user.ImageFilePath,
          });
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
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


module.exports={
    loginUser,
    registerUser
}
