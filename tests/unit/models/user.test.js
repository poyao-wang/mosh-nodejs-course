const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");

test("it should return a valid jwt", () => {
  const user = new User({
    name: "aaaaa",
    email: "aaaaa",
    password: "aaaaa",
    isAdmin: true,
  });
  const resultToken = user.generateAuthToken();
  const resultTokenVerified = jwt.verify(
    resultToken,
    config.get("jwtPrivateKey")
  );

  expect(JSON.stringify(resultTokenVerified._id)).toBe(
    JSON.stringify(user._id)
  );
  expect(JSON.stringify(resultTokenVerified.isAdmin)).toBe(
    JSON.stringify(user.isAdmin)
  );
});
