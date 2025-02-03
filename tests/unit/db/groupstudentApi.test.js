const httpMocks = require('node-mocks-http');
const { GroupStudent, Group, Student } = require('../../../src/models/dbModels');
const groupStudentController = require('../../../src/controllers/dbControllers/groupStudentController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  GroupStudent: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Group: jest.fn(() => ({ name: 'Group' })),
  Student: jest.fn(() => ({ name: 'Student' })),
}));

describe('GroupStudent Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createGroupStudent should create a new group student', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        GroupId: 1,
        StudentId: 1,
      },
    });
    const res = httpMocks.createResponse();

    GroupStudent.create.mockResolvedValue(req.body);

    await groupStudentController.createGroupStudent(req, res);

    expect(GroupStudent.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getGroupStudents should return all group students', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockGroupStudents = [
      {
        GroupId: 1,
        StudentId: 1,
      },
    ];

    GroupStudent.findAll.mockResolvedValue(mockGroupStudents);

    await groupStudentController.getGroupStudents(req, res);

    expect(GroupStudent.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockGroupStudents);
  });

  test('getGroupStudentById should return group student if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockGroupStudent = {
      GroupId: 1,
      StudentId: 1,
    };

    GroupStudent.findByPk.mockResolvedValue(mockGroupStudent);

    await groupStudentController.getGroupStudentById(req, res);

    expect(GroupStudent.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockGroupStudent);
  });

  test('searchGroupStudents should return matching group students', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { groupId: '1', studentId: '1' },
    });
    const res = httpMocks.createResponse();

    const mockGroupStudents = [
      {
        GroupId: 1,
        StudentId: 1,
        Group: { GroupId: 1, GroupName: 'Math Group' },
        Student: { StudentId: 1, FirstName: 'John', LastName: 'Doe' },
      },
    ];

    GroupStudent.findAll.mockResolvedValue(mockGroupStudents);

    await groupStudentController.searchGroupStudents(req, res);

    expect(GroupStudent.findAll).toHaveBeenCalledWith({
      where: {
        GroupId: '1',
        StudentId: '1',
      },
      include: [
        {
          model: expect.any(Function),
          as: 'Group',
          attributes: ['GroupId', 'GroupName'],
        },
        {
          model: expect.any(Function),
          as: 'Student',
          attributes: ['StudentId', 'FirstName', 'LastName'],
        },
      ],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockGroupStudents);
  });

  test('updateGroupStudent should update an existing group student', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { GroupId: 2 },
    });
    const res = httpMocks.createResponse();

    const mockGroupStudent = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        GroupId: 2,
        StudentId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockGroupStudent.dataValues })),
    };

    GroupStudent.findByPk.mockResolvedValue(mockGroupStudent);

    await groupStudentController.updateGroupStudent(req, res);

    expect(mockGroupStudent.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      GroupId: 2,
      StudentId: 1,
    });
    expect(mockGroupStudent.toJSON).toHaveBeenCalled();
  });

  test('deleteGroupStudent should remove a group student', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockGroupStudent = { destroy: jest.fn().mockResolvedValue(1) };

    GroupStudent.findByPk.mockResolvedValue(mockGroupStudent);

    await groupStudentController.deleteGroupStudent(req, res);

    expect(mockGroupStudent.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getGroupStudentById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    GroupStudent.findByPk.mockResolvedValue(null);

    await groupStudentController.getGroupStudentById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'GroupStudent not found' });
  });

  test('searchGroupStudents should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { groupId: '999' } });
    const res = httpMocks.createResponse();

    GroupStudent.findAll.mockResolvedValue([]);

    await groupStudentController.searchGroupStudents(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No group students found matching the criteria.' });
  });
});