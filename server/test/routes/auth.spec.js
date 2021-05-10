const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../../app");
const { User } = require("../../db/models");

chai.should();
chai.use(chaiHttp);

describe("Auth routes", () => {
  describe("Register user - POST /register", () => {
    it("should register successfully with valid email,username and password", async () => {
      const username = "userX",
        password = "passwordX",
        email = "email99@xyz.com";
      const request = await chai
        .request(app)
        .post("/auth/register")
        .send({ username, password, email });

      // delete user
      const { body } = request;
      expect(body.email).eq("email99@xyz.com");
      expect(request).to.have.cookie("messengerToken");

      User.destroy({
        where: {
          id: body.id,
        },
      });
    });

    it("should throw error without username", async () => {
      const username = "user99",
        password = "password99",
        email = "email99@xyz.com";
      const request = await chai
        .request(app)
        .post("/auth/register")
        .send({ password, email });

      const { error } = request.body;
      expect(request.status).eq(400);
      expect(error).eq("Username, password, and email required");
    });

    it("should throw error without email", async () => {
      const username = "user99",
        password = "password99",
        email = "email99@xyz.com";
      const request = await chai
        .request(app)
        .post("/auth/register")
        .send({ username, password });

      const { error } = request.body;
      expect(request.status).eq(400);
      expect(error).eq("Username, password, and email required");
    });

    it("should throw error without password", async () => {
      const username = "user99",
        password = "password99",
        email = "email99@xyz.com";
      const request = await chai
        .request(app)
        .post("/auth/register")
        .send({ username, email });

      const { error } = request.body;
      expect(request.status).eq(400);
      expect(error).eq("Username, password, and email required");
    });

    it("should throw error with short password", async () => {
      const username = "user99",
        password = "pass",
        email = "email99@xyz.com";
      const request = await chai
        .request(app)
        .post("/auth/register")
        .send({ username, email, password });

      const { error } = request.body;
      expect(request.status).eq(400);
      expect(error).eq("Password must be at least 6 characters");
    });

    it("should throw error with duplicate username", async () => {
      const username = "user1",
        password = "password1",
        email = "email1@xyz.com";
      const request = await chai
        .request(app)
        .post("/auth/register")
        .send({ username, password, email });

      const { error } = request.body;
      expect(request.status).eq(401);
      expect(error).eq("User already exists");
    });
  });

  describe("Login user - POST /login", () => {
    it("should login successfully with valid username and password", async () => {
      const username = "user1",
        password = "password1";
      const request = await chai
        .request(app)
        .post("/auth/login")
        .send({ username, password });

      const { email } = request.body;
      expect(email).eq("email1@xyz.com");
      expect(request).to.have.cookie("messengerToken");
    });

    it("should throw error without username", async () => {
      const username = "user1",
        password = "password1";
      const request = await chai
        .request(app)
        .post("/auth/login")
        .send({ password });

      const { error } = request.body;
      expect(request.status).eq(400);
      expect(error).eq("Username and password required");
    });

    it("should throw error without password", async () => {
      const username = "user1",
        password = "password1";
      const request = await chai
        .request(app)
        .post("/auth/login")
        .send({ username });

      const { error } = request.body;
      expect(request.status).eq(400);
      expect(error).eq("Username and password required");
    });

    it("should throw error with invalid username", async () => {
      const username = "userX",
        password = "password1";
      const request = await chai
        .request(app)
        .post("/auth/login")
        .send({ username, password });

      const { error } = request.body;
      expect(request.status).eq(401);
      expect(error).eq("Wrong username and/or password");
    });

    it("should throw error with invalid password", async () => {
      const username = "user1",
        password = "passwordX";
      const request = await chai
        .request(app)
        .post("/auth/login")
        .send({ username, password });

      const { error } = request.body;
      expect(request.status).eq(401);
      expect(error).eq("Wrong username and/or password");
    });
  });

  describe("Logout user - DELETE /logout", () => {
    it("should logout the user", async () => {
      const request = await chai.request(app).delete("/auth/logout");
      expect(request.status).eq(204);
      expect(request).to.not.have.cookie("messengerToken");
    });
  });

  describe("Get user details - GET /user", () => {
    let agent;

    it("should get user details for authenticated users", async () => {
      const username = "user3",
        password = "password3";
      agent = chai.request.agent(app);

      const res = await agent.post("/auth/login").send({ username, password });
      expect(agent).to.have.cookie("messengerToken");

      const cookies = res.get("Set-Cookie");
      const request = await agent.get("/auth/user").set("Cookie", cookies);

      const { body } = request;
      expect(request.status).eq(200);
      expect(body.email).eq("email3@xyz.com");
      expect(body.username).eq("user3");
    });

    it("should not get user details for un-authenticated users", async () => {
      const request = await chai.request(app).get("/auth/user");

      const { body } = request;
      expect(request.status).eq(200);
      expect(body).empty;
    });

    after(() => {
      agent.close();
    });
  });
});
