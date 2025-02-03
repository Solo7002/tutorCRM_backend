const httpMocks = require('node-mocks-http');
const { DoneHomeTaskFile, DoneHomeTask } = require('../../../src/models/dbModels');
const doneHometaskFileController = require('../../../src/controllers/dbControllers/doneHometaskFileController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  DoneHomeTaskFile: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  DoneHomeTask: jest.fn(() => ({ name: 'DoneHomeTask' })),
}));

describe('DoneHomeTaskFile Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createDoneHometaskFile should create a new file', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        FileName: 'example.pdf',
        FilePath: 'http://example.com/file.pdf',
        DoneHomeTaskId: 1,
      },
    });
    const res = httpMocks.createResponse();

    DoneHomeTaskFile.create.mockResolvedValue(req.body);

    await doneHometaskFileController.createDoneHometaskFile(req, res);

    expect(DoneHomeTaskFile.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getDoneHometaskFiles should return all files', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockFiles = [
      {
        HometaskFileId: 1,
        FileName: 'example.pdf',
        FilePath: 'http://example.com/file.pdf',
        DoneHomeTaskId: 1,
      },
    ];

    DoneHomeTaskFile.findAll.mockResolvedValue(mockFiles);

    await doneHometaskFileController.getDoneHometaskFiles(req, res);

    expect(DoneHomeTaskFile.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockFiles);
  });

  test('getDoneHometaskFileById should return file if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockFile = {
      HometaskFileId: 1,
      FileName: 'example.pdf',
      FilePath: 'http://example.com/file.pdf',
      DoneHomeTaskId: 1,
    };

    DoneHomeTaskFile.findByPk.mockResolvedValue(mockFile);

    await doneHometaskFileController.getDoneHometaskFileById(req, res);

    expect(DoneHomeTaskFile.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockFile);
  });

  test('searchDoneHomeTaskFiles should return matching files', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { fileName: 'example', doneHomeTaskId: '1' },
    });
    const res = httpMocks.createResponse();

    const mockFiles = [
      {
        HometaskFileId: 1,
        FileName: 'example.pdf',
        FilePath: 'http://example.com/file.pdf',
        DoneHomeTaskId: 1,
        DoneHomeTask: { DoneHomeTaskId: 1, Mark: 85 },
      },
    ];

    DoneHomeTaskFile.findAll.mockResolvedValue(mockFiles);

    await doneHometaskFileController.searchDoneHomeTaskFiles(req, res);

    expect(DoneHomeTaskFile.findAll).toHaveBeenCalledWith({
      where: {
        FileName: { [Op.like]: '%example%' },
        DoneHomeTaskId: '1',
      },
      include: [
        { model: expect.any(Function), as: 'DoneHomeTask', attributes: ['DoneHomeTaskId', 'Mark'] },
      ],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockFiles);
  });

  test('updateDoneHometaskFile should update an existing file', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { FileName: 'updated.pdf' },
    });
    const res = httpMocks.createResponse();

    const mockFile = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        HometaskFileId: 1,
        FileName: 'updated.pdf',
        FilePath: 'http://example.com/file.pdf',
        DoneHomeTaskId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockFile.dataValues })),
    };

    DoneHomeTaskFile.findByPk.mockResolvedValue(mockFile);

    await doneHometaskFileController.updateDoneHometaskFile(req, res);

    expect(mockFile.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      HometaskFileId: 1,
      FileName: 'updated.pdf',
      FilePath: 'http://example.com/file.pdf',
      DoneHomeTaskId: 1,
    });
    expect(mockFile.toJSON).toHaveBeenCalled();
  });

  test('deleteDoneHometaskFile should remove a file', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockFile = { destroy: jest.fn().mockResolvedValue(1) };

    DoneHomeTaskFile.findByPk.mockResolvedValue(mockFile);

    await doneHometaskFileController.deleteDoneHometaskFile(req, res);

    expect(mockFile.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getDoneHometaskFileById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    DoneHomeTaskFile.findByPk.mockResolvedValue(null);

    await doneHometaskFileController.getDoneHometaskFileById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'DoneHomeTaskFile not found' });
  });

  test('searchDoneHomeTaskFiles should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { fileName: 'nonexistent' } });
    const res = httpMocks.createResponse();

    DoneHomeTaskFile.findAll.mockResolvedValue([]);

    await doneHometaskFileController.searchDoneHomeTaskFiles(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No files found matching the criteria.' });
  });
});