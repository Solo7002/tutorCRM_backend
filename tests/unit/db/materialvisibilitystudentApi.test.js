const httpMocks = require('node-mocks-http');
const { MaterialVisibilityStudent, Material, Student } = require('../../../src/models/dbModels');
const materialVisibilityController = require('../../../src/controllers/dbControllers/materialVisibilityStudentController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  MaterialVisibilityStudent: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Material: jest.fn(() => ({ name: 'Material' })),
  Student: jest.fn(() => ({ name: 'Student' })),
}));

describe('MaterialVisibilityStudent Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createMaterialVisibilityStudent should create a new record', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        MaterialId: 1,
        StudentId: 1,
      },
    });
    const res = httpMocks.createResponse();

    MaterialVisibilityStudent.create.mockResolvedValue(req.body);

    await materialVisibilityController.createMaterialVisibilityStudent(req, res);

    expect(MaterialVisibilityStudent.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getMaterialVisibilityStudents should return all records', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockRecords = [
      {
        MaterialId: 1,
        StudentId: 1,
      },
    ];

    MaterialVisibilityStudent.findAll.mockResolvedValue(mockRecords);

    await materialVisibilityController.getMaterialVisibilityStudents(req, res);

    expect(MaterialVisibilityStudent.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockRecords);
  });

  test('getMaterialVisibilityStudentById should return record if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockRecord = {
      MaterialId: 1,
      StudentId: 1,
    };

    MaterialVisibilityStudent.findByPk.mockResolvedValue(mockRecord);

    await materialVisibilityController.getMaterialVisibilityStudentById(req, res);

    expect(MaterialVisibilityStudent.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockRecord);
  });

  test('searchMaterialVisibility should return matching records', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { materialId: '1', studentId: '1' },
    });
    const res = httpMocks.createResponse();

    const mockRecords = [
      {
        MaterialId: 1,
        StudentId: 1,
        Material: { MaterialId: 1, MaterialName: 'Math Notes' },
        Student: { StudentId: 1, FirstName: 'John', LastName: 'Doe' },
      },
    ];

    MaterialVisibilityStudent.findAll.mockResolvedValue(mockRecords);

    await materialVisibilityController.searchMaterialVisibility(req, res);

    expect(MaterialVisibilityStudent.findAll).toHaveBeenCalledWith({
      where: {
        MaterialId: '1',
        StudentId: '1',
      },
      include: [
        {
          model: expect.any(Function),
          as: 'Material',
          attributes: ['MaterialId', 'MaterialName'],
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
    expect(res._getJSONData().data).toEqual(mockRecords);
  });

  test('updateMaterialVisibilityStudent should update an existing record', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { MaterialId: 2 },
    });
    const res = httpMocks.createResponse();

    const mockRecord = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        MaterialId: 2,
        StudentId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockRecord.dataValues })),
    };

    MaterialVisibilityStudent.findByPk.mockResolvedValue(mockRecord);

    await materialVisibilityController.updateMaterialVisibilityStudent(req, res);

    expect(mockRecord.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      MaterialId: 2,
      StudentId: 1,
    });
    expect(mockRecord.toJSON).toHaveBeenCalled();
  });

  test('deleteMaterialVisibilityStudent should remove a record', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockRecord = { destroy: jest.fn().mockResolvedValue(1) };

    MaterialVisibilityStudent.findByPk.mockResolvedValue(mockRecord);

    await materialVisibilityController.deleteMaterialVisibilityStudent(req, res);

    expect(mockRecord.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getMaterialVisibilityStudentById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    MaterialVisibilityStudent.findByPk.mockResolvedValue(null);

    await materialVisibilityController.getMaterialVisibilityStudentById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'MaterialVisibilityStudent not found' });
  });

  test('searchMaterialVisibility should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { materialId: '999' } });
    const res = httpMocks.createResponse();

    MaterialVisibilityStudent.findAll.mockResolvedValue([]);

    await materialVisibilityController.searchMaterialVisibility(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No material visibility records found matching the criteria.' });
  });
});