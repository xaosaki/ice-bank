import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function getFakeUser() {
  const password = faker.string.alphanumeric(10);
  return {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password,
    passwordHash: await bcrypt.hash(password, 10),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    middleName: faker.person.middleName(),
    phone: faker.phone.number({ style: 'national' })
  };
}
