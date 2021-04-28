const router = require("express").Router();
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers[sender.id]) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// mark message as read
router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { messageIds, conversationId } = req.body;
    const userId = req.user.id;

    // update all selected ids
    const message = await Message.update(
      { read: true },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          id: { [Op.in]: messageIds },
        },
      }
    );

    if (message) {
      return res.json({ message, success: true });
    } else {
      return res.json({ message, success: false });
    }
  } catch (error) {
    next(error);
  }
});

// mark message as read
router.put("/:messageId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { messageId } = req.params;
    const message = await Message.findOne({ where: { id: messageId } });
    if (message) {
      message.read = true;
      await message.save();
      return res.json({ message, success: true });
    } else {
      return res.json({ message, success: false });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
