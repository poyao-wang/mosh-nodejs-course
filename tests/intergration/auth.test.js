const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("auth middleware", () => {
  beforeEach(() => {
    sever = require("../../index");
  });

  afterEach(async () => {
    await sever.close();
    await Genre.remove({});
  });

  let token;

  const exec = () => {
    return request(sever)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
