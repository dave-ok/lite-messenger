const { expect } = require("chai");
const { Op } = require("sequelize");
const { User } = require("../db/models");

const testUsers = [
  { username: "user1", password: "password1", email: "email1@xyz.com" },
  { username: "user2", password: "password2", email: "email2@xyz.com" },
  { username: "user3", password: "password3", email: "email3@xyz.com" },
  { username: "user4", password: "password4", email: "email4@xyz.com" },
  { username: "user5", password: "password5", email: "email5@xyz.com" },
  { username: "user6", password: "password6", email: "email6@xyz.com" },
];

let users;

before(async () => {
  // create test users
  try {
    users = await User.bulkCreate(testUsers, {
      validation: true,
      returning: true,
    });
  } catch (error) {
    throw error;
  }

  expect(users).lengthOf(6);

  global.users = users;
});

after(async () => {
  if (users) {
    userIds = users.map((user) => user.id);
    await User.destroy({
      where: {
        id: {
          [Op.in]: userIds,
        },
      },
    });
  }
});
