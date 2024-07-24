const { categoryCreateSchema } = require('../../../schemas/categories.schema.js');
const { createCategory } = require('../../../controllers/categories.controller');
const { CategoriesMongo } = require('../../../models/mongo/categories.mongo');
const sequelize = require('../../../models/sql');
const { Category } = sequelize.model('categories');
const { NotFound } = require('http-errors');

jest.mock(CategoriesMongo);
jest.mock(Category);
jest.mock(Category, () => ({
  model: jest.fn().mockReturnValue({
    create: jest.fn(),
  }),
}));

describe('Category Creation with Mocks', () => {
  let mockCreate;

  beforeAll(() => {
    mockCreate = jest.spyOn(Category, 'create');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a category with valid data', async () => {
    const categoryValid = {
      name: 'Electronics',
      description: 'Devices and gadgets',
    };

    const req = {
      body: categoryValid,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    mockCreate.mockResolvedValueOnce({
      id: 1,
      ...categoryValid,
      slug: 'electronics',
    });

    CategoriesMongo.create.mockResolvedValueOnce({
      _id: 1,
      ...categoryValid,
      slug: 'electronics',
    });

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: 1,
      ...categoryValid,
      slug: 'electronics',
    });
    expect(mockCreate).toHaveBeenCalledWith(categoryValid, { transaction });
    expect(CategoriesMongo.create).toHaveBeenCalledWith({
      _id: 1,
      ...categoryValid,
      slug: 'electronics',
    });
  });

  it('should handle validation errors', async () => {
    const invalidCategory = {
      name: 'E',
      description: '',
    };

    const req = {
      body: invalidCategory,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createCategory(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].status).toBe(400); // Assuming validation errors are returned with status 400
  });
});
