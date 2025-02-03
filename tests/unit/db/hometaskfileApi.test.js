const httpMocks = require('node-mocks-http');
const { HomeTaskFile, HomeTask } = require('../../../src/models/dbModels');
const homeTaskFileController = require('../../../src/controllers/dbControllers/homeTaskFileController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  HomeTaskFile: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  HomeTask: jest.fn(() => ({ name: 'HomeTask' })),
}));

describe('HomeTaskFile Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createHometaskFile should create a new file', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        FileName: 'example.pdf',
        FilePath: 'http://example.com/file.pdf',
        HomeTaskId: 1,
      },
    });
    const res = httpMocks.createResponse();

    HomeTaskFile.create.mockResolvedValue(req.body);

    await homeTaskFileController.createHometaskFile(req, res);

    expect(HomeTaskFile.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getHometaskFiles should return all files', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockFiles = [
      {
        HomeTaskFileId: 1,
        FileName: 'example.pdf',
        FilePath: 'http://example.com/file.pdf',
        HomeTaskId: 1,
      },
    ];

    HomeTaskFile.findAll.mockResolvedValue(mockFiles);

    await homeTaskFileController.getHometaskFiles(req, res);

    expect(HomeTaskFile.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockFiles);
  });

  test('getHometaskFileById should return file if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockFile = {
      HomeTaskFileId: 1,
      FileName: 'example.pdf',
      FilePath: 'http://example.com/file.pdf',
      HomeTaskId: 1,
    };

    HomeTaskFile.findByPk.mockResolvedValue(mockFile);

    await homeTaskFileController.getHometaskFileById(req, res);

    expect(HomeTaskFile.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockFile);
  });

  test('searchHomeTaskFiles should return matching files', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { fileName: 'example', homeTaskId: '1' },
    });
    const res = httpMocks.createResponse();

    const mockFiles = [
      {
        HomeTaskFileId: 1,
        FileName: 'example.pdf',
        FilePath: 'http://example.com/file.pdf',
        HomeTaskId: 1,
        HomeTask: { HomeTaskId: 1, HomeTaskHeader: 'Math Homework' },
      },
    ];

    HomeTaskFile.findAll.mockResolvedValue(mockFiles);

    await homeTaskFileController.searchHomeTaskFiles(req, res);

    expect(HomeTaskFile.findAll).toHaveBeenCalledWith({
      where: {
        FileName: { [Op.like]: '%example%' },
        HomeTaskId: '1',
      },
      include: {
        model: expect.any(Function),
        as: 'HomeTask',
        attributes: ['HomeTaskId', 'HomeTaskHeader'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockFiles);
  });

  test('updateHometaskFile should update an existing file', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { FileName: 'updated.pdf' },
    });
    const res = httpMocks.createResponse();

    const mockFile = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        HomeTaskFileId: 1,
        FileName: 'updated.pdf',
        FilePath: 'http://example.com/file.pdf',
        HomeTaskId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockFile.dataValues })),
    };

    HomeTaskFile.findByPk.mockResolvedValue(mockFile);

    await homeTaskFileController.updateHometaskFile(req, res);

    expect(mockFile.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      HomeTaskFileId: 1,
      FileName: 'updated.pdf',
      FilePath: 'http://example.com/file.pdf',
      HomeTaskId: 1,
    });
    expect(mockFile.toJSON).toHaveBeenCalled();
  });

  test('deleteHometaskFile should remove a file', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockFile = { destroy: jest.fn().mockResolvedValue(1) };

    HomeTaskFile.findByPk.mockResolvedValue(mockFile);

    await homeTaskFileController.deleteHometaskFile(req, res);

    expect(mockFile.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getHometaskFileById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    HomeTaskFile.findByPk.mockResolvedValue(null);

    await homeTaskFileController.getHometaskFileById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'HometaskFile not found' });
  });

  test('searchHomeTaskFiles should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { fileName: 'nonexistent' } });
    const res = httpMocks.createResponse();

    HomeTaskFile.findAll.mockResolvedValue([]);

    await homeTaskFileController.searchHomeTaskFiles(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No home task files found matching the criteria.' });
  });
});