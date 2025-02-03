const { Course } = require('../../../src/models/dbModels');
const courseController = require('../../../src/controllers/dbControllers/courseController');
const httpMocks = require('node-mocks-http');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Course: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Teacher: jest.fn().mockReturnValue({ name: 'Teacher' }),
  Subject: jest.fn().mockReturnValue({ name: 'Subject' }),
  Location: jest.fn().mockReturnValue({ name: 'Location' }),
}));

describe('Course Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createCourse should create a new course', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        CourseName: 'Mathematics 101',
        ImageFilePath: 'http://example.com/image.jpg',
      },
    });
    const res = httpMocks.createResponse();

    Course.create.mockResolvedValue(req.body);

    await courseController.createCourse(req, res);

    expect(Course.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getCourses should return all courses', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockCourses = [
      { CourseId: 1, CourseName: 'Mathematics 101', ImageFilePath: 'http://example.com/image.jpg' },
    ];

    Course.findAll.mockResolvedValue(mockCourses);

    await courseController.getCourses(req, res);

    expect(Course.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockCourses);
  });

  test('getCourseById should return course if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockCourse = {
      CourseId: 1,
      CourseName: 'Mathematics 101',
      ImageFilePath: 'http://example.com/image.jpg',
    };

    Course.findByPk.mockResolvedValue(mockCourse);

    await courseController.getCourseById(req, res);

    expect(Course.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockCourse);
  });

  test('searchCourses should return matching courses', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { courseName: 'Math', teacherId: '1', subjectId: '2', locationId: '3' },
    });
    const res = httpMocks.createResponse();

    const mockCourses = [
      {
        CourseId: 1,
        CourseName: 'Mathematics 101',
        ImageFilePath: 'http://example.com/image.jpg',
        Teacher: { TeacherId: 1, Name: 'John Doe' },
        Subject: { SubjectId: 2, SubjectName: 'Mathematics' },
        Location: { LocationId: 3, LocationName: 'Main Campus' },
      },
    ];

    Course.findAll.mockResolvedValue(mockCourses);

    await courseController.searchCourses(req, res);

    expect(Course.findAll).toHaveBeenCalledWith({
      where: {
        CourseName: { [Op.like]: '%Math%' },
        TeacherId: '1',
        SubjectId: '2',
        LocationId: '3',
      },
      include: [
        { model: expect.any(Function), as: 'Teacher', attributes: ['TeacherId', 'Name'] },
        { model: expect.any(Function), as: 'Subject', attributes: ['SubjectId', 'SubjectName'] },
        { model: expect.any(Function), as: 'Location', attributes: ['LocationId', 'LocationName'] },
      ],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockCourses);
  });

  test('updateCourse should update an existing course', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { CourseName: 'Updated Course Name' },
    });
    const res = httpMocks.createResponse();

    const mockCourse = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        CourseId: 1,
        CourseName: 'Updated Course Name',
        ImageFilePath: 'http://example.com/image.jpg',
      },
      toJSON: jest.fn(() => ({ ...mockCourse.dataValues })),
    };

    Course.findByPk.mockResolvedValue(mockCourse);

    await courseController.updateCourse(req, res);

    expect(mockCourse.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      CourseId: 1,
      CourseName: 'Updated Course Name',
      ImageFilePath: 'http://example.com/image.jpg',
    });
    expect(mockCourse.toJSON).toHaveBeenCalled();
  });

  test('deleteCourse should remove a course', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockCourse = { destroy: jest.fn().mockResolvedValue(1) };

    Course.findByPk.mockResolvedValue(mockCourse);

    await courseController.deleteCourse(req, res);

    expect(mockCourse.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getCourseById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    Course.findByPk.mockResolvedValue(null);

    await courseController.getCourseById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Course not found' });
  });

  test('searchCourses should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { courseName: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    Course.findAll.mockResolvedValue([]);

    await courseController.searchCourses(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No courses found matching the criteria.' });
  });
});