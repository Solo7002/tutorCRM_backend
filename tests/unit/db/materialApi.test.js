const httpMocks = require('node-mocks-http');
const { Material, Teacher } = require('../../../src/models/dbModels');
const materialController = require('../../../src/controllers/dbControllers/materialController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Material: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Teacher: jest.fn(() => ({ name: 'Teacher' })),
}));

describe('Material Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createMaterial should create a new material', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        MaterialName: 'Math Notes',
        Type: 'file',
        TeacherId: 1,
      },
    });
    const res = httpMocks.createResponse();

    Material.create.mockResolvedValue(req.body);

    await materialController.createMaterial(req, res);

    expect(Material.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getMaterials should return all materials', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockMaterials = [
      {
        MaterialId: 1,
        MaterialName: 'Math Notes',
        Type: 'file',
        TeacherId: 1,
      },
    ];

    Material.findAll.mockResolvedValue(mockMaterials);

    await materialController.getMaterials(req, res);

    expect(Material.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockMaterials);
  });

  test('getMaterialById should return material if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockMaterial = {
      MaterialId: 1,
      MaterialName: 'Math Notes',
      Type: 'file',
      TeacherId: 1,
    };

    Material.findByPk.mockResolvedValue(mockMaterial);

    await materialController.getMaterialById(req, res);

    expect(Material.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockMaterial);
  });

  test('searchMaterials should return matching materials', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { materialName: 'Math', type: 'file', teacherId: '1' },
    });
    const res = httpMocks.createResponse();

    const mockMaterials = [
      {
        MaterialId: 1,
        MaterialName: 'Math Notes',
        Type: 'file',
        TeacherId: 1,
        Teacher: { TeacherId: 1, Name: 'John Doe' },
      },
    ];

    Material.findAll.mockResolvedValue(mockMaterials);

    await materialController.searchMaterials(req, res);

    expect(Material.findAll).toHaveBeenCalledWith({
      where: {
        MaterialName: { [Op.like]: '%Math%' },
        Type: 'file',
        TeacherId: '1',
      },
      include: {
        model: expect.any(Function),
        as: 'Teacher',
        attributes: ['TeacherId', 'Name'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockMaterials);
  });

  test('updateMaterial should update an existing material', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { MaterialName: 'Updated Math Notes' },
    });
    const res = httpMocks.createResponse();

    const mockMaterial = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        MaterialId: 1,
        MaterialName: 'Updated Math Notes',
        Type: 'file',
        TeacherId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockMaterial.dataValues })),
    };

    Material.findByPk.mockResolvedValue(mockMaterial);

    await materialController.updateMaterial(req, res);

    expect(mockMaterial.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      MaterialId: 1,
      MaterialName: 'Updated Math Notes',
      Type: 'file',
      TeacherId: 1,
    });
    expect(mockMaterial.toJSON).toHaveBeenCalled();
  });

  test('deleteMaterial should remove a material', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockMaterial = { destroy: jest.fn().mockResolvedValue(1) };

    Material.findByPk.mockResolvedValue(mockMaterial);

    await materialController.deleteMaterial(req, res);

    expect(mockMaterial.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Material deleted' });
  });

  test('getMaterialById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    Material.findByPk.mockResolvedValue(null);

    await materialController.getMaterialById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Material not found' });
  });

  test('searchMaterials should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { materialName: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    Material.findAll.mockResolvedValue([]);

    await materialController.searchMaterials(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No materials found matching the criteria.' });
  });
});