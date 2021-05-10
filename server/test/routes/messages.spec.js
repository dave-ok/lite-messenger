const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../../app");
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");

let convo1, convo2;
let user1, user2, user3;
let msg1Convo1, msg2Convo1, msg1Convo2, msg2Convo2;

before(async () => {
  // create dummy conversations
  user1 = global.users[0];
  user2 = global.users[1];
  user3 = global.users[2];

  convo1 = await Conversation.create({
    user1Id: user1.id,
    user2Id: user2.id,
  });

  msg1Convo1 = await Message.create({
    senderId: user1.id,
    text: "message 1 convo 1",
    conversationId: convo1.id,
  });

  msg2Convo1 = await Message.create({
    senderId: user2.id,
    text: "message 2 convo 1",
    conversationId: convo1.id,
  });

  convo2 = await Conversation.create({
    user1Id: user2.id,
    user2Id: user3.id,
  });

  msg1Convo2 = await Message.create({
    senderId: user2.id,
    text: "message 1 convo 2",
    conversationId: convo2.id,
  });

  msg2Convo2 = await Message.create({
    senderId: user3.id,
    text: "message 2 convo 2",
    conversationId: convo2.id,
  });
});

describe("Messages routes", () => {
  describe("POST /api/messages - Create new message", () => {
    it("should throw auth error for unauthenticated user", async () => {
      const testMessage = {
        text: "Test message 1",
        recipientId: user2.id,
        conversationId: convo1.id,
        sender: user1,
      };
      const response = await chai
        .request(app)
        .post("/api/messages")
        .send(testMessage);

      expect(response.status).eq(401);
    });
    it("should create message in existing conversation for authenticated user", async () => {
      const testMessage = {
        text: "Test message 1",
        recipientId: user2.id,
        conversationId: convo1.id,
        sender: user1,
      };

      const username = "user1";
      const password = "password1";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      const response = await agent
        .post("/api/messages")
        .set("Cookie", cookies)
        .send(testMessage);

      const { message, sender } = response.body;
      expect(response.status).eq(200);
      expect(message).to.include({
        senderId: user1.id,
        conversationId: convo1.id,
        text: "Test message 1",
      });
      expect(sender.id).eq(user1.id);
    });

    it("should create message in old conversation(no conversationId) for authenticated user", async () => {
      const testMessage = {
        text: "Test message 1",
        recipientId: user2.id,
        sender: user1,
      };

      const username = "user1";
      const password = "password1";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      const response = await agent
        .post("/api/messages")
        .set("Cookie", cookies)
        .send(testMessage);

      const { message, sender } = response.body;
      expect(response.status).eq(200);
      expect(message).to.include({
        senderId: user1.id,
        conversationId: convo1.id,
        text: "Test message 1",
      });
      expect(sender.id).eq(user1.id);
    });

    it("should create message in new conversation for authenticated user", async () => {
      const testMessage = {
        text: "Test message 1",
        recipientId: user3.id,
        sender: user1,
      };

      const username = "user1";
      const password = "password1";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      const response = await agent
        .post("/api/messages")
        .set("Cookie", cookies)
        .send(testMessage);

      const { message, sender } = response.body;
      expect(response.status).eq(200);
      expect(message).to.include({
        senderId: user1.id,
        text: "Test message 1",
      });
      expect(message.conversationId).not.oneOf([convo1.id, convo2.id]);
      expect(sender.id).eq(user1.id);
    });
  });
  describe("PUT /api/messages - Mark messages as read", () => {
    it("should throw auth error for unauthenticated user", async () => {
      const testMessage = {
        conversationId: convo1.id,
        messageIds: [msg1Convo1.id, msg2Convo1.id],
      };
      const response = await chai
        .request(app)
        .put("/api/messages")
        .send(testMessage);

      expect(response.status).eq(401);
    });
    it("should mark all user messages as read", async () => {
      const testMessage = {
        conversationId: convo1.id,
        messageIds: [msg1Convo1.id, msg2Convo1.id],
      };

      const username = "user1";
      const password = "password1";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      const response = await agent
        .put("/api/messages")
        .set("Cookie", cookies)
        .send(testMessage);

      const { success, lastSeenMessageId } = response.body;
      await Message.update(
        { read: false },
        {
          where: {
            conversationId: convo1.id,
          },
        }
      );

      expect(response.status).eq(200);
      expect(success).true;
      expect(lastSeenMessageId).eq(msg2Convo1.id);
    });

    it("should mark only user's received messages as read", async () => {
      const testMessage = {
        conversationId: convo1.id,
        messageIds: [msg1Convo1.id],
      };

      const username = "user1";
      const password = "password1";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      const response = await agent
        .put("/api/messages")
        .set("Cookie", cookies)
        .send(testMessage);

      const { success, lastSeenMessageId } = response.body;
      await Message.update(
        { read: false },
        {
          where: {
            conversationId: convo1.id,
          },
        }
      );

      expect(success).false;
      expect(response.status).eq(404);
    });
  });
});

after(async () => {
  await Message.destroy({
    where: {
      conversationId: {
        [Op.in]: [convo1.id, convo2.id],
      },
    },
  });

  await Conversation.destroy({
    where: {
      id: {
        [Op.in]: [convo1.id, convo2.id],
      },
    },
  });
});
