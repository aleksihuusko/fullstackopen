const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User creation validation", () => {
  test("fails with a short username", async () => {
    const newUser = {
      username: "ab",
      name: "Short User",
      password: "validpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "Username must be at least 3 characters long"
    );
  });

  test("fails with a short password", async () => {
    const newUser = {
      username: "validuser",
      name: "Valid User",
      password: "ab",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "Password must be at least 3 characters long"
    );
  });

  test("fails with duplicate username", async () => {
    const newUser = {
      username: "duplicateuser",
      name: "Duplicate User",
      password: "validpassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Username must be unique");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
