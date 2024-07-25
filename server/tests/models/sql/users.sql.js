const { Sequelize } = require('sequelize');
const { faker } = require('@faker-js/faker');
const sequelize = require('../../../models/sql');
const UserMongo = require('../../../models/mongo/user.mongo');

const Users = sequelize.model('users');
const Addresses = sequelize.model('addresses');
const Baskets = sequelize.model('baskets');

// Mock external dependencies
jest.mock('../../../models/mongo/user.mongo');
jest.mock('@node-rs/argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('Users Model', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user with hashed password', async () => {
    const userData = {
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    };

    const user = await Users.create(userData);

    expect(user.fullname).toBe(userData.fullname);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe('hashed_password');
    expect(user.passwordValidUntil).toBeDefined();
    expect(user.isVerified).toBe(false);
    expect(user.role).toBe('user');
  });

  it('should not allow duplicate emails', async () => {
    const email = faker.internet.email();
    await Users.create({
      fullname: faker.person.fullName(),
      email,
      password: 'password123',
    });

    await expect(
      Users.create({
        fullname: faker.person.fullName(),
        email,
        password: 'password456',
      }),
    ).rejects.toThrow('Adresse email déjà utilisée');
  });

  it('should validate email format', async () => {
    await expect(
      Users.create({
        fullname: faker.person.fullName(),
        email: 'invalid-email',
        password: 'password123',
      }),
    ).rejects.toThrow('Adresse email invalide');
  });

  it('should create a MongoDB document after creating a user', async () => {
    const userData = {
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    };

    const user = await Users.create(userData);

    expect(UserMongo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: user.id,
        fullname: userData.fullname,
        email: userData.email,
      }),
    );
  });

  it('should update MongoDB document after updating a user', async () => {
    const user = await Users.create({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    });

    const newFullname = faker.person.fullName();
    await user.update({ fullname: newFullname });

    expect(UserMongo.updateOne).toHaveBeenCalledWith(
      { _id: user.id },
      expect.objectContaining({
        $set: expect.objectContaining({
          fullname: newFullname,
        }),
      }),
    );
  });

  it('should soft delete a user', async () => {
    const user = await Users.create({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    });

    await user.destroy();

    expect(UserMongo.updateOne).toHaveBeenCalledWith(
      { _id: user.id },
      expect.objectContaining({
        $set: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      }),
    );

    const foundUser = await Users.findByPk(user.id);
    expect(foundUser).toBeNull();

    const foundUserWithParanoid = await Users.findByPk(user.id, {
      paranoid: false,
    });
    expect(foundUserWithParanoid).not.toBeNull();
    expect(foundUserWithParanoid.deletedAt).not.toBeNull();
  });

  it('should associate a user with addresses', async () => {
    const user = await Users.create({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    });

    const address = await Addresses.create({
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      userId: user.id,
    });

    const userWithAddresses = await Users.findByPk(user.id, {
      include: [Addresses],
    });

    expect(userWithAddresses.addresses).toHaveLength(1);
    expect(userWithAddresses.addresses[0].street).toBe(address.street);
  });

  it('should associate a user with a basket', async () => {
    const user = await Users.create({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    });

    const basket = await Baskets.create({
      userId: user.id,
    });

    const userWithBasket = await Users.findByPk(user.id, {
      include: [Baskets],
    });

    expect(userWithBasket.basket).toBeDefined();
    expect(userWithBasket.basket.id).toBe(basket.id);
  });

  it('should convert to MongoDB format', async () => {
    const user = await Users.create({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    });

    const address = await Addresses.create({
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      userId: user.id,
    });

    const mongoUser = await user.toMongo();

    expect(mongoUser).toMatchObject({
      _id: user.id,
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      passwordValidUntil: user.passwordValidUntil,
      isVerified: user.isVerified,
      role: user.role,
      addresses: [
        expect.objectContaining({
          _id: address.id,
          street: address.street,
          city: address.city,
          zipCode: address.zipCode,
        }),
      ],
      basket: [],
      newProductAlert: user.newProductAlert,
      restockAlert: user.restockAlert,
      priceChangeAlert: user.priceChangeAlert,
      newsletterAlert: user.newsletterAlert,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  });
});
