const { fakerFR: faker } = require('@faker-js/faker');

const createUser = ({
  password = 'Password1234.',
  isVerified = false,
  role = faker.helpers.arrayElement(['user', 'admin', 'accountant']),
}) => {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const fullname = faker.person.fullName({
    firstName: firstname,
    lastName: lastname,
  });
  const email = faker.internet.email({
    firstName: firstname,
    lastName: lastname,
  });

  return {
    fullname,
    email,
    password,
    id: crypto.randomUUID(),
    role,
    isVerified,
  };
};

module.exports = createUser;
