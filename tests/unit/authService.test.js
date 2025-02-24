const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Teacher } = require('../../src/models/dbModels');
const emailService = require('../../src/services/emailService');
const authService = require('../../src/services/authService');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/dbModels', () => ({
  User: { create: jest.fn(), findOne: jest.fn(), update: jest.fn() },
  Student: { create: jest.fn() },
  Teacher: { create: jest.fn() },
}));
jest.mock('../../src/services/emailService', () => ({
  sendRegistrationEmail: jest.fn(),
  sendResetPasswordEmail: jest.fn(),
}));

const { JWT_SECRET, JWT_EXPIRATION, JWT_TEMPTIME } = process.env;

describe('Auth Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser should create a new user', async () => {
    const mockUser = {
        Username: 'testUser',
        Password: 'Password123!',
        LastName: 'Doe',
        FirstName: 'John',
        Email: 'john.doe22@example.com',
        ImageFilePath: '/images/profile.jpg',
        Role: 'Student',
        SchoolName: 'Springfield High',
        Grade: '10th',
    };

    const mockSalt = 'mockedSalt'; 
    const mockHashedPassword = 'hashedPassword'; 

    
    bcrypt.genSalt.mockResolvedValue(mockSalt);

 
    bcrypt.hash.mockImplementation((password, salt) => {
        expect(password).toBe(mockUser.Password); 
        expect(salt).toBe(mockSalt); 
        return Promise.resolve(mockHashedPassword);
    });

  
    User.create.mockResolvedValue({ UserId: 1, Email: 'john.doe22@example.com', update: jest.fn() });
    Student.create.mockResolvedValue({ StudentId: 1 });


    const result = await authService.registerUser(mockUser);

   
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);

   
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.Password, mockSalt);

    
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        Username: mockUser.Username,
        Password: mockHashedPassword,
        LastName: mockUser.LastName,
        FirstName: mockUser.FirstName,
        Email: mockUser.Email,
        ImageFilePath: mockUser.ImageFilePath,
    }));
    expect(Student.create).toHaveBeenCalledWith(expect.objectContaining({
        UserId: 1,
        SchoolName: mockUser.SchoolName,
        Grade: mockUser.Grade,
    }));

    
    expect(result).toHaveProperty('UserId', 1);
});
  
  
  

  test('registerAndSendEmailConfirmation should generate token and send email', async () => {
    const mockUser = {
      Username: 'testUser',
      Email: 'john.doe@example.com',
      Password: 'Password123!',
    };

    const mockToken = 'mockToken123';
    jwt.sign.mockReturnValue(mockToken);

    await authService.registerAndSendEmailConfirmation(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith(mockUser, JWT_SECRET, { expiresIn: JWT_TEMPTIME });
    expect(emailService.sendRegistrationEmail).toHaveBeenCalledWith(mockUser.Email, mockUser.Username, expect.stringContaining(mockToken));
  });

  test('loginUser should return token for valid user', async () => {
    const mockUser = {
      UserId: 1,
      Email: 'john.doe@example.com',
      Password: 'hashedPassword',
    };

    const mockInput = { Email: 'john.doe@example.com', Password: 'Password123!' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockToken123');

    const result = await authService.loginUser(mockInput.Email, mockInput.Password);

    expect(bcrypt.compare).toHaveBeenCalledWith(mockInput.Password, mockUser.Password);
    expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.UserId, email: mockUser.Email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    expect(result).toHaveProperty('token', 'mockToken123');
  });

  test('loginUser should throw error for invalid password', async () => {
    const mockUser = {
      UserId: 1,
      Email: 'john.doe@example.com',
      Password: 'hashedPassword',
    };

    const mockInput = { Email: 'john.doe@example.com', Password: 'wrongPassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.loginUser(mockInput.Email, mockInput.Password)).rejects.toThrow('User not found or invalid password');
  });

  test('loginToOuth2 should return token for valid user', async () => {
    const mockUser = { UserId: 1, Email: 'john.doe@example.com' };
    jwt.sign.mockReturnValue('mockToken123');

    const result = await authService.loginToOuth2(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.UserId, email: mockUser.Email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    expect(result).toBe('mockToken123');
  });

  test('resetPasswordByService should send reset password email', async () => {
    const mockUser = { UserId: 1, Email: 'john.doe@example.com', Username: 'john.doe' };
    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue('mockToken123');

    await authService.resetPasswordByService(mockUser.Email);

    expect(emailService.sendResetPasswordEmail).toHaveBeenCalledWith(mockUser.Email, mockUser.Username, expect.stringContaining('mockToken123'));
  });

  test('resetAndChangePassword should reset the password', async () => {
    const mockUser = {
        UserId: 1,
        Email: 'john.doe@example.com',
        Password: 'hashedPassword',
        update: jest.fn().mockResolvedValue([1]), 
    };
    const mockToken = jwt.sign({ id: mockUser.UserId, email: mockUser.Email }, JWT_SECRET, { expiresIn: JWT_TEMPTIME });
    const mockNewPassword = 'newPassword123!';
    jwt.verify.mockReturnValue({ id: mockUser.UserId });
    bcrypt.hash.mockResolvedValue('newHashedPassword');
    User.findOne.mockResolvedValue(mockUser);

    await authService.resetAndChangePassword(mockToken, mockNewPassword);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockNewPassword, expect.any(String));
    expect(mockUser.update).toHaveBeenCalledWith({ Password: 'newHashedPassword' });
});




});
