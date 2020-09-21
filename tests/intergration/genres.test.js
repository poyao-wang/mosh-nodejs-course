const request = require("supertest");

let sever;

describe("/api/genres", () => {
  beforeEach(() => {
    sever = require("../../index");
  });
  afterEach(() => {
    sever.close();
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      const res = await request(sever).get("/api/genres");
      expect(res.status).toBe(200);
    });
  });
});
