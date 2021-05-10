const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../../app");
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");

chai.use(chaiHttp);

describe("Users route", () => {
  describe("GET /api/users/:username", () => {
    it("should throw auth error for unauthenticated user", async () => {
      const response = await chai.request(app).get("/api/users/user");

      expect(response.status).eq(401);
    });

    it("should return users with partial or full matches", async () => {
      const username = "user5";
      const password = "password5";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      let response = await agent.get("/api/users/user").set("Cookie", cookies);

      let matchedUsers = response.body;
      expect(matchedUsers).lengthOf(5);

      response = await agent.get("/api/users/user2").set("Cookie", cookies);

      matchedUsers = response.body;
      expect(matchedUsers).lengthOf(1);
    });
  });

  describe("GET /api/users", () => {
    it("should throw auth error for unauthenticated user", async () => {
      const response = await chai.request(app).get("/api/users");

      expect(response.status).eq(401);
    });

    it("should return only online users", async () => {
      const username = "user5";
      const password = "password5";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      let response = await agent
        .get("/api/users")
        .set("Cookie", cookies)
        .query({ online: true });

      let matchedUsers = response.body;
      expect(matchedUsers).lengthOf(0);
    });

    it("should return all users", async () => {
      const username = "user5";
      const password = "password5";

      const agent = chai.request.agent(app);
      const res = await agent.post("/auth/login").send({ username, password });

      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      let response = await agent.get("/api/users").set("Cookie", cookies);

      let matchedUsers = response.body;
      expect(matchedUsers.length).greaterThanOrEqual(6);
    });
  });
});
