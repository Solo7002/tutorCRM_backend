const httpMocks = require('node-mocks-http');
const { StudentCourseRating } = require('../../../src/models/dbModels');
const studentCourseRatingController = require('../../../src/controllers/dbControllers/studentCourseRatingController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  StudentCourseRating: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('StudentCourseRating Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createStudentCourseRating should create a new rating', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        Rating: 8.5,
        StudentId: 1,
        CourseId: 1,
      },
    });
    const res = httpMocks.createResponse();

    StudentCourseRating.create.mockResolvedValue(req.body);

    await studentCourseRatingController.createStudentCourseRating(req, res);

    expect(StudentCourseRating.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getStudentCourseRatings should return all ratings', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockRatings = [
      {
        Rating: 8.5,
        StudentId: 1,
        CourseId: 1,
      },
    ];

    StudentCourseRating.findAll.mockResolvedValue(mockRatings);

    await studentCourseRatingController.getStudentCourseRatings(req, res);

    expect(StudentCourseRating.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockRatings);
  });

  test('getStudentCourseRatingById should return rating if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockRating = {
      Rating: 8.5,
      StudentId: 1,
      CourseId: 1,
    };

    StudentCourseRating.findByPk.mockResolvedValue(mockRating);

    await studentCourseRatingController.getStudentCourseRatingById(req, res);

    expect(StudentCourseRating.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockRating);
  });

  test('searchStudentCourseRatings should return matching ratings', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        studentId: '1',
        courseId: '1',
        rating: '8.5',
      },
    });
    const res = httpMocks.createResponse();

    const mockRatings = [
      {
        Rating: 8.5,
        StudentId: 1,
        CourseId: 1,
      },
    ];

    StudentCourseRating.findAll.mockResolvedValue(mockRatings);

    await studentCourseRatingController.searchStudentCourseRatings(req, res);

    expect(StudentCourseRating.findAll).toHaveBeenCalledWith({
      where: {
        StudentId: '1',
        CourseId: '1',
        Rating: 8.5,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockRatings);
  });

  test('updateStudentCourseRating should update an existing rating', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { Rating: 9.0 },
    });
    const res = httpMocks.createResponse();

    const mockRating = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        Rating: 9.0,
        StudentId: 1,
        CourseId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockRating.dataValues })),
    };

    StudentCourseRating.findByPk.mockResolvedValue(mockRating);

    await studentCourseRatingController.updateStudentCourseRating(req, res);

    expect(mockRating.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      Rating: 9.0,
      StudentId: 1,
      CourseId: 1,
    });
    expect(mockRating.toJSON).toHaveBeenCalled();
  });

  test('deleteStudentCourseRating should remove a rating', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockRating = { destroy: jest.fn().mockResolvedValue(1) };

    StudentCourseRating.findByPk.mockResolvedValue(mockRating);

    await studentCourseRatingController.deleteStudentCourseRating(req, res);

    expect(mockRating.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getStudentCourseRatingById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    StudentCourseRating.findByPk.mockResolvedValue(null);

    await studentCourseRatingController.getStudentCourseRatingById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'StudentCourseRating not found' });
  });

  test('searchStudentCourseRatings should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { studentId: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    StudentCourseRating.findAll.mockResolvedValue([]);

    await studentCourseRatingController.searchStudentCourseRatings(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No ratings found.' });
  });
});