import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";
import { PrimaryKey } from "@mswjs/data/lib/primaryKey";

export const db = factory({
  category: {
    id: new PrimaryKey(faker.number.int),
    name: faker.commerce.department,
  },
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
  },
});
