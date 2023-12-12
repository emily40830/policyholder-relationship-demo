import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

const policyholderData = [
  {
    code: 1,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "O",
    depth: 1,
    leftIntroducedCode: 2,
    rightIntroducedCode: 3,
  },
  {
    code: 2,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "OL",
    depth: 2,
    introducerCode: 1,
    parentIntroducerCode: 1,
    leftIntroducedCode: 4,
    rightIntroducedCode: 5,
  },
  {
    code: 3,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "OR",
    depth: 2,
    introducerCode: 1,
    parentIntroducerCode: 1,
    leftIntroducedCode: 6,
    rightIntroducedCode: 7,
  },
  {
    code: 4,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "OLL",
    depth: 3,
    introducerCode: 1,
    parentIntroducerCode: 2,
    leftIntroducedCode: 8,
    rightIntroducedCode: 9,
  },
  {
    code: 5,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "OLR",
    depth: 3,
    introducerCode: 2,
    parentIntroducerCode: 2,
  },
  {
    code: 6,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "ORL",
    depth: 3,
    introducerCode: 3,
    parentIntroducerCode: 3,
    leftIntroducedCode: 11,
  },
  {
    code: 7,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "ORR",
    depth: 3,
    introducerCode: 3,
    parentIntroducerCode: 3,
  },
  {
    code: 8,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "OLLL",
    depth: 4,
    introducerCode: 1,
    parentIntroducerCode: 4,
  },
  {
    code: 9,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "OLLR",
    depth: 4,
    introducerCode: 4,
    parentIntroducerCode: 4,
    leftIntroducedCode: 10,
  },
  {
    code: 10,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "OLLRL",
    depth: 5,
    introducerCode: 9,
    parentIntroducerCode: 9,
  },
  {
    code: 11,
    name: faker.internet.userName(),
    registrationDate: new Date(),
    path: "ORLL",
    depth: 4,
    introducerCode: 1,
    parentIntroducerCode: 6,
  },
];

async function main() {
  console.log(`Start seeding ...`);

  const createQuery = prisma.policyholder.createMany({
    data: policyholderData.map(
      ({
        introducerCode,
        parentIntroducerCode,
        leftIntroducedCode,
        rightIntroducedCode,
        ...rest
      }) => rest
    ),
  });

  const updateQuery = policyholderData.map(
    ({ name, code, depth, path, registrationDate, ...rest }) => {
      return prisma.policyholder.update({
        where: {
          code,
        },
        data: rest,
      });
    }
  );

  await prisma.$transaction([createQuery, ...updateQuery]);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
