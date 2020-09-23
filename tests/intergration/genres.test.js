const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let sever;

describe("/api/genres", () => {
  beforeEach(() => {
    sever = require("../../index");
  });
  afterEach(async () => {
    sever.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      Genre.collection.insertMany([
        //
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(sever).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    //
    it("should return an genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(sever).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(sever).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(sever)
        .post("/api/genres")
        .send({ name: "genres1" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genres is less than 5 characters", async () => {
      const token = new User().generateAuthToken();
      const res = await request(sever)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if genres is more than 50 characters", async () => {
      const token = new User().generateAuthToken();
      const name = new Array(52).join("a");
      const res = await request(sever)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });
  });
});
