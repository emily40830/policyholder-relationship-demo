# policyholder-relationship-demo

A simple policyholder relationship management system

## Set up environment

```shell
## npm i -g yarn
yarn

# copy local settings
cp .env.example .env

```

## Set up db (please put your database url to .env first)

```shell
npx prisma migrate deploy
npx prisma db seed # add seed data
```

## Set up api server

```shell
yarn dev
```

## Migrations

```shell
# create migration file
npx prisma migrate dev --create-only

# if just wanna create for test,
npx prisma db push

```

## Ref

[prisma](https://www.prisma.io/docs/concepts/components/prisma-schema)
