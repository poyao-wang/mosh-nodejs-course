const exercise1 = require("../exercise1");

describe("fizBuzz", () => {
  it("shhould throw an error if input is not a number", () => {
    const args = [null, undefined, "", false];
    args.forEach((a) => {
      expect(() => {
        exercise1.fizzBuzz(a);
      }).toThrow();
    });
  });

  it("should return FizzBuzz if input % 3 === 0 && input % 5 === 0", () => {
    const result = exercise1.fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it("should return Fizz if input % 3 === 0", () => {
    const result = exercise1.fizzBuzz(3);
    expect(result).toBe("Fizz");
  });

  it("should return Buzz if input % 5 === 0", () => {
    const result = exercise1.fizzBuzz(5);
    expect(result).toBe("Buzz");
  });

  it("should return itself otherwise", () => {
    const result = exercise1.fizzBuzz(0.1);
    expect(result).toBe(0.1);
  });
});
