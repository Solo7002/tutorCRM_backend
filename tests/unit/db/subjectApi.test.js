const httpMocks = require('node-mocks-http');
const { Subject } = require('../../../src/models/dbModels');
const subjectController = require('../../../src/controllers/dbControllers/subjectController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Subject: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Subject Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createSubject should create a new subject', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        SubjectName: 'Mathematics',
      },
    });
    const res = httpMocks.createResponse();

    Subject.create.mockResolvedValue(req.body);

    await subjectController.createSubject(req, res);

    expect(Subject.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getSubjects should return all subjects', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockSubjects = [
      {
        SubjectId: 1,
        SubjectName: 'Mathematics',
      },
      {
        SubjectId: 2,
        SubjectName: 'Physics',
      },
    ];

    Subject.findAll.mockResolvedValue(mockSubjects);

    await subjectController.getSubjects(req, res);

    expect(Subject.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSubjects);
  });

  test('getSubjectById should return subject if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSubject = {
      SubjectId: 1,
      SubjectName: 'Mathematics',
    };

    Subject.findByPk.mockResolvedValue(mockSubject);

    await subjectController.getSubjectById(req, res);

    expect(Subject.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSubject);
  });

  test('searchSubjects should return matching subjects', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        subjectName: 'Math',
      },
    });
    const res = httpMocks.createResponse();

    const mockSubjects = [
      {
        SubjectId: 1,
        SubjectName: 'Mathematics',
      },
    ];

    Subject.findAll.mockResolvedValue(mockSubjects);

    await subjectController.searchSubjects(req, res);

    expect(Subject.findAll).toHaveBeenCalledWith({
      where: {
        SubjectName: { [Op.like]: '%Math%' },
      },
      attributes: ['SubjectId', 'SubjectName'],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockSubjects);
  });

  test('updateSubject should update an existing subject', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { SubjectName: 'Updated Mathematics' },
    });
    const res = httpMocks.createResponse();

    const mockSubject = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        SubjectId: 1,
        SubjectName: 'Updated Mathematics',
      },
      toJSON: jest.fn(() => ({ ...mockSubject.dataValues })),
    };

    Subject.findByPk.mockResolvedValue(mockSubject);

    await subjectController.updateSubject(req, res);

    expect(mockSubject.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      SubjectId: 1,
      SubjectName: 'Updated Mathematics',
    });
    expect(mockSubject.toJSON).toHaveBeenCalled();
  });

  test('deleteSubject should remove a subject', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSubject = { destroy: jest.fn().mockResolvedValue(1) };

    Subject.findByPk.mockResolvedValue(mockSubject);

    await subjectController.deleteSubject(req, res);

    expect(mockSubject.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getSubjectById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    Subject.findByPk.mockResolvedValue(null);

    await subjectController.getSubjectById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Subject not found' });
  });

  test('searchSubjects should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { subjectName: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    Subject.findAll.mockResolvedValue([]);

    await subjectController.searchSubjects(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No subjects found matching the criteria.' });
  });
});