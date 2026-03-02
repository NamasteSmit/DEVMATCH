jest.mock("../models/user.js", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../utils/generateOTP", () => ({
  generateOTP: jest.fn(),
}));

jest.mock("../utils/mail", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

const { describe, expect, it, beforeEach } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User } = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/generateOTP");
const { transporter } = require("../utils/mail");

describe("Testing the signup endpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error : Invalid email if eamil is not valid", async () => {
    const response = await request(app)
      .post("/api/v1/user/signup")
      .send({
        firstname: "John",
        lastname: "Doe",
        emailId: "invalid-email",
        password: "Strong@123",
        age: 25,
        gender: "male",
        skills: ["js"],
        about: "about",
        photoUrl: { secure_url: "http://test.com/img.png" },
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Invalid Email");
  });

  it("should return 400 if email does not end with .com", async () => {
    const response = await request(app)
      .post("/api/v1/user/signup")
      .send({
        firstname: "John",
        lastname: "Doe",
        emailId: "smit@gmail.con",
        password: "Strong@123",
        age: 25,
        gender: "male",
        skills: ["js"],
        about: "about",
        photoUrl: { secure_url: "http://test.com/img.png" },
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("invalid email address");
  });

  it("should return 409 if user already exists in DB", async () => {
    User.findOne.mockResolvedValue({
      _id: "1",
      emailId: "smit@gmail.com",
    });

    const response = await request(app)
      .post("/api/v1/user/signup")
      .send({
        firstname: "smit",
        lastname: "Doe",
        emailId: "smit@gmail.com",
        password: "Strong@123",
        age: 25,
        gender: "male",
        skills: ["js"],
        about: "about",
        photoUrl: { secure_url: "http://test.com/img.png" },
      });

    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("User already exists");
  });

  it("should return error : 400 if password is not strong ", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/v1/user/signup")
      .send({
        firstname: "John",
        lastname: "Doe",
        emailId: "smit@gmail.com",
        password: "no-strong",
        age: 25,
        gender: "male",
        skills: ["js"],
        about: "about",
        photoUrl: { secure_url: "http://test.com/img.png" },
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    );
  });

  it("should create user successfully and return 201", async () => {
    User.findOne.mockResolvedValue(null);

    const fakeUser = {
      id: 2,
      firstname: "smit",
      lastname: "Doe",
      emailId: "smit@gmail.com",
      password: "SmitStrong@123",
      age: 25,
      gender: "male",
      skills: ["react", "nextjs"],
      about: "good boy",
      photoUrl: { secure_url: "http://test.com/img.png" },
    };

    const bcrypt = require("bcrypt");
    bcrypt.hash.mockResolvedValue("fakeHashedPassword");

    User.create.mockResolvedValue(fakeUser);

    const response = await request(app)
      .post("/api/v1/user/signup")
      .send({
        id: 2,
        firstname: "smit",
        lastname: "Doe",
        emailId: "smit@gmail.com",
        password: "SmitStrong@123",
        age: 25,
        gender: "male",
        skills: ["react", "nextjs"],
        about: "good boy",
        photoUrl: { secure_url: "http://test.com/img.png" },
      });

    console.log(response.body);
    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("User added successfully");

    expect(response.body.user).toEqual(fakeUser);

    expect(User.create).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it("should return error 500 if Db connection failed", async () => {
    User.findOne.mockResolvedValue(null);

    const bcrypt = require("bcrypt");
    bcrypt.hash.mockResolvedValue("fakeUserToken");

    User.create.mockRejectedValue(new Error("DB Error"));

    const response = await request(app)
      .post("/api/v1/user/signup")
      .send({
        id: 2,
        firstname: "smit",
        lastname: "Doe",
        emailId: "smit@gmail.com",
        password: "SmitStrong@123",
        age: 25,
        gender: "male",
        skills: ["react", "nextjs"],
        about: "good boy",
        photoUrl: { secure_url: "http://test.com/img.png" },
      });

    expect(response.status).toBe(500);

    expect(response.body.message).toBe("Internal server error");
  });
});

describe("Testing the login endpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 403 if user doesnot exist", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app).post("/api/v1/user/login").send({
      emailId: "smit@gmail.com",
      password: "SmitString@123",
    });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorized User");
  });

  it("should return 403 if user exists but no password", async () => {
    User.findOne.mockResolvedValue({
      id: "1",
      emailId: "smit@gmail.com",
      password: null,
    });

    const response = await request(app).post("/api/v1/user/login").send({
      emailId: "smit@gmail.com",
      password: "SmitString@123",
    });
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorized User");
  });

  it("should return 403 if password is invlaid", async () => {
    User.findOne.mockResolvedValue({
      id: "1",
      emailId: "smit@gmail.com",
      password: "SmitString@123",
    });

    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app).post("/api/v1/user/login").send({
      emailId: "smit@gmail.com",
      password: "SmitString@123",
    });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe("Invalid Password");
  });

  it("should login successfullly", async () => {
    const fakeUser = {
      id: "1",
      emailId: "smit@gmail.com",
      password: "SmitString@123",
    };
    User.findOne.mockResolvedValue(fakeUser);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue("fakeToken");

    const response = await request(app).post("/api/v1/user/login").send({
      emailId: "smit@gmail.com",
      password: "SmitString@123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("loggedIn successfully");

    expect(response.headers["set-cookie"]).toBeDefined();

    expect(response.headers["set-cookie"][0]).toContain("token=fakeToken");

    expect(response.headers["set-cookie"][0]).toContain("HttpOnly");

    expect(response.body.user).toEqual(fakeUser);

    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should return 500 if DB throws error", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    const response = await request(app).post("/api/v1/user/login").send({
      emailId: "test@gmail.com",
      password: "Strong@123",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Invalid credentials");
  });
});

describe("Testing sending OTP", () => {
  it("should return 400 if email is not valid ", async () => {
    const response = await request(app).post("/api/v1/user/send-otp").send({
      email: "invalid-email",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.data.error).toBe("email not valid");
  });

  it("should return 404 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app).post("/api/v1/user/send-otp").send({
      email: "smit@gmail.com",
    });

    expect(User.findOne).toHaveBeenCalledWith({ emailId: "smit@gmail.com" });

    expect(response.status).toBe(404);

    expect(response.body.data.error).toBe(
      "user not found ! please create account",
    );
  });

  it("should successfully send OTP ", async () => {
    User.findOne.mockResolvedValue({
      emailId: "smit@gmail.com",
    });

    generateOTP.mockReturnValue("124324");

    bcrypt.hash.mockResolvedValue("otphash");

    User.updateOne.mockResolvedValue({});

    transporter.sendMail.mockResolvedValue({});

    const response = await request(app).post("/api/v1/user/send-otp").send({
      email: "smit@gmail.com",
    });

    expect(generateOTP).toHaveBeenCalled();

    expect(bcrypt.hash).toHaveBeenCalledWith("124324", 10);

    expect(User.findOne).toHaveBeenCalled();

    expect(User.updateOne).toHaveBeenCalled();

    expect(transporter.sendMail).toHaveBeenCalled();

    expect(response.status).toBe(200);

    expect(response.body.data.message).toBe("OTP sent successfully");
  });
});

describe("Testing Verifying the otp endpoint", () => {
  it("should return 400 if email not provided", async () => {
    const response = await request(app).post("/api/v1/user/verify-otp").send({
      email: null,
      otp: "12345",
    });

    expect(response.status).toBe(400);

    expect(response.body.data.error).toBe("email and otp are required");
  });

  it("should return 400 if otp not provided", async () => {
    const response = await request(app).post("/api/v1/user/verify-otp").send({
      email: "smit@gmail.com",
      otp: null,
    });

    expect(response.status).toBe(400);

    expect(response.body.data.error).toBe("email and otp are required");
  });

  it("should return 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app).post("/api/v1/user/verify-otp").send({
      email: "smit@gmail.com",
      otp: "12345",
    });

    expect(response.status).toBe(404);

    expect(response.body.data.error).toBe("user not found");
  });

  it("should return 400 if otp expired", async () => {
    User.findOne.mockResolvedValue({
      emailId: "smit@gmail.com",
      otpHash: "hashedOTP",
      otpExpiresAt: new Date(Date.now() - 10000),
    });

    const response = await request(app).post("/api/v1/user/verify-otp").send({
      email: "smit@gmail.com",
      otp: "12345",
    });

    expect(response.status).toBe(400);

    expect(response.body.data.error).toBe("otp expired! request a new one");
  });

  it("should return 400 if otp is invalid", async () => {
    User.findOne.mockResolvedValue({
      emailId: "smit@gmail.com",
      otpHash: "hashedOTP",
      otpExpiresAt: new Date(Date.now() + 10000),
    });

    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app).post("/api/v1/user/verify-otp").send({
      email: "smit@gmail.com",
      otp: "12345",
    });

    expect(bcrypt.compare).toHaveBeenCalled();

    expect(response.status).toBe(400);

    expect(response.body.data.error).toBe("Invalid Otp");
  });

  it("should verify otp and set cookie successfully", async () => {
    const fakeUser = {
      _id: "abc123",
      emailId: "smit@gmail.com",
      otpHash: "hashedOTP",
      otpExpiresAt: new Date(Date.now() + 10000),
      save: jest.fn().mockResolvedValue({}),
    };

    User.findOne.mockResolvedValue(fakeUser)

    bcrypt.compare.mockResolvedValue(true)

    jwt.sign.mockReturnValue("fakeToken")

    const response = await request(app).post("/api/v1/user/verify-otp").send({
      email: "smit@gmail.com",
      otp: "12345",
    })

    expect(jwt.sign).toHaveBeenCalled()

    expect(fakeUser.save).toHaveBeenCalled()

    expect(response.headers["set-cookie"]).toBeDefined()
    expect(response.headers["set-cookie"][0]).toContain("token=fakeToken");

    expect(response.status).toBe(200)

    expect(response.body.data.message).toBe("user loggedIn successfully")

  });
});
