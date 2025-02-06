const httpMocks = require('node-mocks-http');
const { PlannedLesson } = require('../../../src/models/dbModels');
const plannedLessonController = require('../../../src/controllers/dbControllers/plannedLessonController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  PlannedLesson: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('PlannedLesson Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createPlannedLesson should create a new planned lesson', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        LessonHeader: 'Math Lesson',
        LessonDescription: 'Learn math basics',
        LessonPrice: 100.0,
        IsPaid: true,
        GroupId: 1,
      },
    });
    const res = httpMocks.createResponse();

    PlannedLesson.create.mockResolvedValue(req.body);

    await plannedLessonController.createPlannedLesson(req, res);

    expect(PlannedLesson.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getPlannedLessons should return all planned lessons', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockPlannedLessons = [
      {
        PlannedLessonId: 1,
        LessonHeader: 'Math Lesson',
        LessonDescription: 'Learn math basics',
        LessonPrice: 100.0,
        IsPaid: true,
        GroupId: 1,
      },
    ];

    PlannedLesson.findAll.mockResolvedValue(mockPlannedLessons);

    await plannedLessonController.getPlannedLessons(req, res);

    expect(PlannedLesson.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockPlannedLessons);
  });

  test('getPlannedLessonById should return planned lesson if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockPlannedLesson = {
      PlannedLessonId: 1,
      LessonHeader: 'Math Lesson',
      LessonDescription: 'Learn math basics',
      LessonPrice: 100.0,
      IsPaid: true,
      GroupId: 1,
    };

    PlannedLesson.findByPk.mockResolvedValue(mockPlannedLesson);

    await plannedLessonController.getPlannedLessonById(req, res);

    expect(PlannedLesson.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockPlannedLesson);
  });

  test('searchPlannedLessons should return matching planned lessons', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        lessonHeader: 'Math',
        lessonPrice: '100.0',
        isPaid: 'true',
        groupId: '1',
      },
    });
    const res = httpMocks.createResponse();

    const mockPlannedLessons = [
      {
        PlannedLessonId: 1,
        LessonHeader: 'Math Lesson',
        LessonDescription: 'Learn math basics',
        LessonPrice: 100.0,
        IsPaid: true,
        GroupId: 1,
      },
    ];

    PlannedLesson.findAll.mockResolvedValue(mockPlannedLessons);

    await plannedLessonController.searchPlannedLessons(req, res);

    expect(PlannedLesson.findAll).toHaveBeenCalledWith({
      where: {
        LessonHeader: { [Op.like]: '%Math%' },
        LessonPrice: 100.0,
        IsPaid: true,
        GroupId: '1',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockPlannedLessons);
  });

  test('updatePlannedLesson should update an existing planned lesson', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { LessonHeader: 'Updated Math Lesson' },
    });
    const res = httpMocks.createResponse();

    const mockPlannedLesson = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        PlannedLessonId: 1,
        LessonHeader: 'Updated Math Lesson',
        LessonDescription: 'Learn math basics',
        LessonPrice: 100.0,
        IsPaid: true,
        GroupId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockPlannedLesson.dataValues })),
    };

    PlannedLesson.findByPk.mockResolvedValue(mockPlannedLesson);

    await plannedLessonController.updatePlannedLesson(req, res);

    expect(mockPlannedLesson.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      PlannedLessonId: 1,
      LessonHeader: 'Updated Math Lesson',
      LessonDescription: 'Learn math basics',
      LessonPrice: 100.0,
      IsPaid: true,
      GroupId: 1,
    });
    expect(mockPlannedLesson.toJSON).toHaveBeenCalled();
  });

  test('deletePlannedLesson should remove a planned lesson', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockPlannedLesson = { destroy: jest.fn().mockResolvedValue(1) };

    PlannedLesson.findByPk.mockResolvedValue(mockPlannedLesson);

    await plannedLessonController.deletePlannedLesson(req, res);

    expect(mockPlannedLesson.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getPlannedLessonById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    PlannedLesson.findByPk.mockResolvedValue(null);

    await plannedLessonController.getPlannedLessonById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'PlannedLesson not found' });
  });

  test('searchPlannedLessons should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { lessonHeader: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    PlannedLesson.findAll.mockResolvedValue([]);

    await plannedLessonController.searchPlannedLessons(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No planned lessons found matching the criteria.' });
  });
});