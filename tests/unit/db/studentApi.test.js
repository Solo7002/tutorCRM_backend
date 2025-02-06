const { Student } = require('../../../src/models/dbModels');
const studentController = require('../../../src/controllers/dbControllers/studentController');
const httpMocks = require('node-mocks-http');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Student: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Student Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createStudent should create a new student', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: 1,
      },
    });
    const res = httpMocks.createResponse();
    Student.create.mockResolvedValue(req.body);
    await studentController.createStudent(req, res);
    expect(Student.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getStudents should return all students', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();
    const mockStudents = [{ StudentId: 1, SchoolName: 'Test School' }];
    Student.findAll.mockResolvedValue(mockStudents);
    await studentController.getStudents(req, res);
    expect(Student.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockStudents);
  });

  test('getStudentById should return student if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockStudent = { StudentId: 1, SchoolName: 'Test School' };
    Student.findByPk.mockResolvedValue(mockStudent);
    await studentController.getStudentById(req, res);
    expect(Student.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockStudent);
  });

  test('searchStudents should return matching students', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { schoolName: 'Test', grade: 'A' },
    });
    const res = httpMocks.createResponse();
    const mockStudents = [{ StudentId: 1, SchoolName: 'Test School', Grade: 'A' }];
    Student.findAll.mockResolvedValue(mockStudents);
    await studentController.searchStudents(req, res);
    expect(Student.findAll).toHaveBeenCalledWith({
      where: { SchoolName: { [Op.like]: '%Test%' }, Grade: { [Op.like]: '%A%' } },
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockStudents);
  });

  test('updateStudent should update an existing student', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { SchoolName: 'Updated School' },
    });
    const res = httpMocks.createResponse();
  
    const mockStudent = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: { StudentId: 1, SchoolName: 'Updated School', Grade: '10th', UserId: 1 },
      toJSON: jest.fn(() => ({ ...mockStudent.dataValues })),
    };
  
    Student.findByPk.mockResolvedValue(mockStudent);
  
    await studentController.updateStudent(req, res);
  
    expect(mockStudent.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
  
    expect(res._getJSONData()).toEqual({
      StudentId: 1,
      SchoolName: 'Updated School',
      Grade: '10th',
      UserId: 1,
    });
  
    expect(mockStudent.toJSON).toHaveBeenCalled();
  });
  

  test('deleteStudent should remove a student', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockStudent = { destroy: jest.fn().mockResolvedValue(1) };
    Student.findByPk.mockResolvedValue(mockStudent);
    await studentController.deleteStudent(req, res);
    expect(mockStudent.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Student deleted' });
  });

  test('getStudentById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();
    Student.findByPk.mockResolvedValue(null);
    await studentController.getStudentById(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Student not found' });
  });

  test('searchStudents should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { schoolName: 'Nonexistent' } });
    const res = httpMocks.createResponse();
    Student.findAll.mockResolvedValue([]);
    await studentController.searchStudents(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No students found.' });
  });
});