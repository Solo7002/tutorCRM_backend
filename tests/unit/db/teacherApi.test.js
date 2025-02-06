const { Teacher } = require('../../../src/models/dbModels');
const teacherController = require('../../../src/controllers/dbControllers/teacherController');
const httpMocks = require('node-mocks-http');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Teacher: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Teacher Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createTeacher should create a new teacher', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        AboutTeacher: 'Experienced tutor',
        LessonPrice: 50,
        LessonType: 'solo',
        MeetingType: 'online',
        UserId: 1,
      },
    });
    const res = httpMocks.createResponse();
    Teacher.create.mockResolvedValue(req.body);
    await teacherController.createTeacher(req, res);
    expect(Teacher.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getTeachers should return all teachers', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();
    const mockTeachers = [
      { TeacherId: 1, AboutTeacher: 'Experienced tutor', LessonType: 'solo', MeetingType: 'online', UserId: 1 },
    ];
    Teacher.findAll.mockResolvedValue(mockTeachers);
    await teacherController.getTeachers(req, res);
    expect(Teacher.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTeachers);
  });

  test('getTeacherById should return teacher if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockTeacher = {
      TeacherId: 1,
      AboutTeacher: 'Experienced tutor',
      LessonType: 'solo',
      MeetingType: 'online',
      UserId: 1,
    };
    Teacher.findByPk.mockResolvedValue(mockTeacher);
    await teacherController.getTeacherById(req, res);
    expect(Teacher.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTeacher);
  });

  test('searchTeachers should return matching teachers', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { lessonType: 'solo', meetingType: 'online', aboutTeacher: 'tutor' },
    });
    const res = httpMocks.createResponse();
    const mockTeachers = [
      { TeacherId: 1, AboutTeacher: 'Experienced tutor', LessonType: 'solo', MeetingType: 'online', UserId: 1 },
    ];
    Teacher.findAll.mockResolvedValue(mockTeachers);
    await teacherController.searchTeachers(req, res);
    expect(Teacher.findAll).toHaveBeenCalledWith({
      where: {
        LessonType: 'solo',
        MeetingType: 'online',
        AboutTeacher: { [Op.like]: '%tutor%' },
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockTeachers);
  });

  test('updateTeacher should update an existing teacher', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { AboutTeacher: 'Updated tutor info' },
    });
    const res = httpMocks.createResponse();

    const mockTeacher = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        TeacherId: 1,
        AboutTeacher: 'Updated tutor info',
        LessonType: 'solo',
        MeetingType: 'online',
        UserId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockTeacher.dataValues })),
    };

    Teacher.findByPk.mockResolvedValue(mockTeacher);

    await teacherController.updateTeacher(req, res);

    expect(mockTeacher.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      TeacherId: 1,
      AboutTeacher: 'Updated tutor info',
      LessonType: 'solo',
      MeetingType: 'online',
      UserId: 1,
    });
    expect(mockTeacher.toJSON).toHaveBeenCalled();
  });

  test('deleteTeacher should remove a teacher', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockTeacher = { destroy: jest.fn().mockResolvedValue(1) };
    Teacher.findByPk.mockResolvedValue(mockTeacher);
    await teacherController.deleteTeacher(req, res);
    expect(mockTeacher.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Teacher deleted' });
  });

  test('getTeacherById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();
    Teacher.findByPk.mockResolvedValue(null);
    await teacherController.getTeacherById(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Teacher not found' });
  });

  test('searchTeachers should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { lessonType: 'group' } });
    const res = httpMocks.createResponse();
    Teacher.findAll.mockResolvedValue([]);
    await teacherController.searchTeachers(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No teachers found.' });
  });
});