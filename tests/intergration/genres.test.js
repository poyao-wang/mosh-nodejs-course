const request = require("supertest");
const { Genre } = require("../../models/genre");

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
});
