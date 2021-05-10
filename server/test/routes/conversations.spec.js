const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../../app");
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");

chai.use(chaiHttp);

let convo1, convo2;
let user1, user2, user3;
let msg1Convo1, msg2Convo1, msg1Convo2, msg2Convo2;

before(async () => {
  // create dummy conversations
  user1 = global.users[3];
  user2 = global.users[4];
  user3 = global.users[5];

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

describe("Conversations route", () => {
  describe("GET /api/conversations - Fetch user's conversations", () => {
    it("should throw auth error for unauthenticated user", async () => {
      const response = await chai.request(app).get("/api/conversations");

      expect(response.status).eq(401);
    });

    it("should get all conversations belonging to user", async () => {
      const username = "user5";
      const password = "password5";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      const response = await agent
        .get("/api/conversations")
        .set("Cookie", cookies);

      const conversations = response.body;
      expect(response.status).eq(200);
      expect(conversations.length).eq(2);
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
