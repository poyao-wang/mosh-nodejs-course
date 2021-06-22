const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");

describe("/api/returns", () => {
  let sever;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = () => {
    return request(sever)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    sever = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await sever.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customer id is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movie id is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the return date if request is valid", async () => {
    const res = await exec();
    rentalInDb = await Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;
    expect(res.status).toBe(200);
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should calculate the rental fee if request is valid", async () => {
    rental.dateOut = moment().add(-7, "days");
    await rental.save();

    const res = await exec();
    rentalInDb = await Rental.findById(rental._id);

    expect(res.status).toBe(200);
    expect(typeof rentalInDb.rentalFee).toBe("number");
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the movie stock if request is valid", async () => {
    const res = await exec();
    const movieInDb = await Movie.findById(movieId);

    expect(res.status).toBe(200);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});
