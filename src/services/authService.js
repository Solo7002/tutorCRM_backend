const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Teacher, Trophies, OctoCoins } = require('../models/dbModels');
const { JWT_SECRET, JWT_EXPIRATION, JWT_TEMPTIME } = process.env;
const emailService = require('../services/emailService');
const crypto = require('crypto');
const { setCache, getCache, deleteCache } = require('../utils/cacheUtils');

const saltRounds = 10;

function generateRandomPassword() {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const special = "_-$%!";
    let passwordChars = [];

    for (let i = 0; i < 2; i++) {
        passwordChars.push(special.charAt(Math.floor(Math.random() * special.length)));
    }
    for (let i = 0; i < 6; i++) {
        passwordChars.push(letters.charAt(Math.floor(Math.random() * letters.length)));
    }
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }
    return passwordChars.join('');
}

//Хеширование пароля
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

//Сравнение паролей
const comparePassword = async (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
}

//Валидация пароля
const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 128;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);
    const allowedChars = /^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/.test(password);

    if (password.length < minLength || password.length > maxLength) {
        throw new Error(`Password must be between ${minLength} and ${maxLength} characters`);
    }
    if (!hasLowercase) {
        throw new Error("Password must contain at least one lowercase letter (a-z)");
    }
    if (!hasUppercase) {
        throw new Error("Password must contain at least one uppercase letter (A-Z)");
    }
    if (!hasDigit) {
        throw new Error("Password must contain at least one digit (0-9)");
    }
    if (!hasSpecial) {
        throw new Error("Password must contain at least one special character (!@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)");
    }
    if (!allowedChars) {
        throw new Error("Password contains invalid characters. Only letters, digits, and special characters (!@#$%^&*()_+-=[]{};:'\"\\|,.<>/?) are allowed");
    }
};

//Регистрация пользователя
const registerUser = async (user) => {
    try {

        validatePassword(user.Password);

        const hashPassworde = await hashPassword(user.Password);

        const newUser = await User.create({
            Username: user.Username,
            Password: hashPassworde,
            LastName: user.LastName,
            FirstName: user.FirstName,
            Email: user.Email,
            ImageFilePath: user.ImageFilePath,
        });

        if (user.Role === 'Student') {
            const newStudent = await Student.create({
                UserId: newUser.UserId,
                SchoolName: user.SchoolName,
                Grade: user.Grade
            });

            const trophy = await Trophies.create({
                StudentId: newStudent.StudentId,
                Amount: 0,
            });
            await newStudent.update({ TrophyId: trophy.TrophyId });
            await newStudent.reload();

            additionalId = newStudent.StudentId;
            await newUser.update({ StudentId: additionalId });
        } else if (user.Role === 'Teacher') {
            const newTeacher = await Teacher.create({
                UserId: newUser.UserId,
                AboutTeacher: user.AboutTeacher,
                LessonPrice: user.LessonPrice,
                LessonType: user.LessonType,
                MeetingType: user.MeetingType,
                SubscriptionLevelId: user.SubscriptionLevelId,
            });

            const octoCoin = await OctoCoins.create({
                TeacherId: newTeacher.TeacherId,
                Amount: 0,
            });
            await newTeacher.update({ OctoCoinId: octoCoin.OctoCoinId });
            await newTeacher.reload();

            additionalId = newTeacher.TeacherId;
            await newUser.update({ TeacherId: additionalId });
        }

        return newUser;
    } catch (error) {
        throw new Error('Error registering user:' + error.message);
    }
}

//Регистрация пользователя с потверждением Email 
const registerAndSendEmailConfirmation = async (user) => {
    try {
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_TEMPTIME });
        const link = `${process.env.BASE_URL}/api/auth/confirm-email/${token}`;
        await emailService.sendRegistrationEmail(user.Email, user.Username, link)

    } catch (error) {

        throw new Error('Error registering user:' + error.message);
    }
}
//Регистрация пользователя после потверждения Email
const verifyEmailAndRegisterUser = async (token) => {
    try {
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
            const trophy = await Trophies.create({
                StudentId: newStudent.StudentId,
                Amount: 0,
            });
            await newStudent.update({ TrophyId: trophy.TrophyId });
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
            const octoCoin = await OctoCoins.create({
                TeacherId: newTeacher.TeacherId,
                Amount: 0,
            });
            await newTeacher.update({ OctoCoinId: octoCoin.OctoCoinId });
            additionalId = newTeacher.TeacherId;
            await newUser.update({ TeacherId: additionalId });
        }

        return newUser;
    } catch (error) {
        throw new Error('Error registering user:', error.message);
    }
}

const registerAndSendEmailCode = async (user) => {
    try {
        const verificationCode = crypto.randomInt(100000, 999999).toString();
       
        const redisKey = `email_verification_${user.Email}`;

        await setCache(redisKey, verificationCode, 600);

        await emailService.sendVerificationCode(user.Email, user.Username, verificationCode);
    } catch (error) {
        throw new Error('Ошибка отправки кода подтверждения: ' + error.message);
    }
};

/**
 * Подтверждение кода и регистрация пользователя
 * @param {string} email - Email пользователя
 * @param {string} code - Введенный код
 * @param {Object} userData - Данные пользователя для регистрации
 */
const verifyEmailCodeAndRegisterUser = async (email, code, userData) => {
    try {
        const redisKey = `email_verification_${email}`;
        const storedCode = await getCache(redisKey);

        if (!storedCode || storedCode !== code) {
            throw new Error(`Неверный или просроченный код подтверждения`);
        }

        const hashPassworde = await hashPassword(userData.Password);

        const newUser = await User.create({
            Username: userData.Username,
            Password: hashPassworde,
            LastName: userData.LastName,
            FirstName: userData.FirstName,
            Email: userData.Email,
            ImageFilePath: userData.ImageFilePath,
        });

        let additionalId;
        if (userData.Role === 'Student') {
            const newStudent = await Student.create({
                UserId: newUser.UserId,
                SchoolName: "-1",
                Grade: "-1",
            });
            const trophy = await Trophies.create({
                StudentId: newStudent.StudentId,
                Amount: 0,
            });
            await newStudent.update({ TrophyId: trophy.TrophyId });
            additionalId = newStudent.StudentId;
            await newUser.update({ StudentId: additionalId });
        } else if (userData.Role === 'Teacher') {
            const newTeacher = await Teacher.create({
                UserId: newUser.UserId,
                AboutTeacher: null,
                LessonPrice: null,
                LessonType: null,
                MeetingType: null,
                SubscriptionLevelId: null,
            });
            const octoCoin = await OctoCoins.create({
                TeacherId: newTeacher.TeacherId,
                Amount: 0,
            });
            await newTeacher.update({ OctoCoinId: octoCoin.OctoCoinId });
            additionalId = newTeacher.TeacherId;
            await newUser.update({ TeacherId: additionalId });
        }

        await deleteCache(redisKey);

        return newUser;
    } catch (error) {
        throw new Error('Ошибка подтверждения кода и регистрации: ' + error.message);
    }
};

const loginUser = async (Email, Password) => {
    try {
        const user = await User.findOne({ where: { Email: Email } });
        if (!user) {
            throw new Error("User not found or invalid password");
        }
        const isPasswordValid = await comparePassword(Password, user.Password);
        if (!isPasswordValid) {
            throw new Error("User not found or invalid password");
        }
        const token = jwt.sign({ id: user.UserId, email: user.Email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
        return { user, token };
    } catch (error) {
        throw new Error(error.message);
    };

};

/*const loginToOuth2=(user)=>{
    try{
        if(!user){
            throw new Error("User not found");
        }
        const token=jwt.sign({id:user.UserId,email:user.Email},JWT_SECRET,{expiresIn:JWT_EXPIRATION})
        return token;
    }catch(error){
        throw new Error(error.message);
    }
}*/

const loginToOuth2 = (user) => {
    try {
        if (!user) {
            return null;
        }
        const token = jwt.sign({ id: user.UserId, email: user.Email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
        return token;
    } catch (error) {
        throw new Error("erorr: " + error.message);
    }
}

const resetPasswordByService = async (Email) => {
    try {
        const user = await User.findOne({ where: { Email: Email } });
        if (!user) {
            throw new Error("User not found");
        }
        const token = jwt.sign({ id: user.UserId, email: user.Email }, JWT_SECRET, { expiresIn: JWT_TEMPTIME });
        const link = `${process.env.BASE_URL}/api/auth/reset-password/${token}`;

        emailService.sendResetPasswordEmail(user.Email, user.Username, link);

    } catch (error) {
        throw new Error(error.message);
    }
}

const resetAndChangePassword = async (token, NewPassword) => {
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ where: { UserId: decode.id } });
        if (!user) {
            throw new Error("User not found");
        }
        const hashPassworde = await hashPassword(NewPassword);
        await user.update({ Password: hashPassworde });

    } catch (error) {
        throw new Error(error.message);
    }
}

const resetPasswordWithNew = async (Email) => {
    try {
        const user = await User.findOne({ where: { Email } });
        if (!user) {
            throw new Error("User not found");
        }
        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await user.update({ Password: hashedPassword });
        await emailService.sendResetPasswordWithNewEmail(user.Email, user.Username, newPassword);
    } catch (error) {
        throw new Error(error.message);
    }
};

const changeProfilePassword = async (userId, newPassword) => {
    try {
        const user = await User.findOne({ where: { UserId: userId } });
        if (!user) {
            throw new Error("User not found");
        }

        validatePassword(newPassword);
        const hashedPassword = await hashPassword(newPassword);
        await user.update({ Password: hashedPassword });

        return { message: "Password updated successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    loginUser,
    registerUser,
    resetPasswordByService,
    resetAndChangePassword,
    resetPasswordWithNew,
    registerAndSendEmailConfirmation,
    verifyEmailAndRegisterUser,
    registerAndSendEmailCode,
    verifyEmailCodeAndRegisterUser,
    loginToOuth2,
    validatePassword,
    changeProfilePassword
}
