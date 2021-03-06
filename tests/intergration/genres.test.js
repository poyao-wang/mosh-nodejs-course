const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let sever;

describe("/api/genres", () => {
  beforeEach(() => {
    sever = require("../../index");
  });
  afterEach(async () => {
    await sever.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
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

    it("should return 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(sever).get(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return request(sever)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genres is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genres is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
    });
  });
  describe("PUT /:id", () => {
    //happy path
    it("should return 400 if invalid name is passed", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(sever)
        .put(`/api/genres/${id}`)
        .send({ name: "1234" });
      expect(res.status).toBe(400);
    });

    it("should return 404 if genre of the given id was not found", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(sever)
        .put(`/api/genres/${id}`)
        .send({ name: "genre1" });
      expect(res.status).toBe(404);
    });

    it("should return a updated genre if a valid id is passed", async () => {
      //
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(sever)
        .put(`/api/genres/${genre._id}`)
        .send({ name: genre.name });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
  describe("DELETE /:id", () => {
    //
    it("should return 403 if user is not admin", async () => {
      //
      const token = new User({
        isAdmin: false,
      }).generateAuthToken();
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const id = genre._id;

      const res = await request(sever)
        .delete(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.status).toBe(403);
    });

    it("should return 404 if genre with the given id was not found", async () => {
      //
      const token = new User({
        isAdmin: true,
      }).generateAuthToken();
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const id = mongoose.Types.ObjectId();

      const res = await request(sever)
        .delete(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.status).toBe(404);
    });

    it("should remove the genres on db if valid token and id is passed", async () => {
      //
      const token = new User({
        isAdmin: true,
      }).generateAuthToken();
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const id = genre._id;

      const res = await request(sever)
        .delete(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.status).toBe(200);
    });
  });
});
