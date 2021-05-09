const router = require("express").Router();
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// find users by username
router.get("/:username", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { username } = req.params;

    const users = await User.findAll({
      where: {
        username: {
          [Op.substring]: username,
        },
        id: {
          [Op.not]: req.user.id,
        },
      },
    });

    // add online status to each user that is online
    for (let i = 0; i < users.length; i++) {
      const userJSON = users[i].toJSON();
      if (onlineUsers.includes(userJSON.id)) {
        userJSON.online = true;
      }
      users[i] = userJSON;
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// get all users
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { online, onlyIds } = req.query;

    let filteredUsers;

    if (onlyIds && online) {
      filteredUsers = [...onlineUsers];
    } else {
      const users = await User.findAll({
        where: {
          username: {
            [Op.substring]: username,
          },
          id: {
            [Op.not]: req.user.id,
          },
        },
      });

      // filter out offline users
      if (online) {
        filteredUsers = users.filter((user) => {
          const userJSON = user.toJSON();
          return onlineUsers.indexOf(userJSON.id) >= 0;
        });
      } else {
        filteredUsers = [...users];
      }
    }

    res.json(filteredUsers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
