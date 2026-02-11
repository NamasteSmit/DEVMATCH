const express = require("express");
const router = express.Router();
const signupSchema = require("../validators/auth-validators");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");
const { generateOTP } = require("../utils/generateOTP");
const { transporter } = require("../utils/mail");
// const validator = require("validator");

router.post("/signup", async (req, res) => {
  let {
    firstname,
    lastname,
    password,
    emailId,
    age,
    gender,
    skills,
    photoUrl,
    about,
  } = req.body;

  if (typeof skills === "string") {
    skills = skills.split(",").map((s) => s.trim());
  }

  console.log("photo url in backend : " , photoUrl)
  const isEmailValid = validator.isEmail(emailId);
  console.log('isEmailValid : ' , isEmailValid)
  if(!isEmailValid){
    return res.status(400).json({
      success : false,
      message : "Invalid Email"
    })
  }

  if (!emailId.toLowerCase().endsWith(".com")) {
  return res.status(400).json({
    success: false,
    field : "exists",
    message: "invalid email address",
  });
}



  const userExists = await User.findOne({ emailId });
  if (userExists) {
    return res.status(409).json({
      success: false,
      field: "exists",
      message: "User already exists",
    });
  }

  const numAge = Number(age);

  const validate = signupSchema.safeParse({
    firstname,
    lastname,
    password,
    emailId,
    numAge,
    gender,
    skills,
    about,
  });

  if (!validate.success) {
    return res.status(400).json({
      success: false,
      message: validate.error.errors,
    });
  }

  if (password) {
    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) {
      return res.status(400).json({
        success: false,
        message:
          "minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
      });
    }
  }

  const hashedPassword = password
    ? await bcrypt.hash(password, 10)
    : undefined;

  try {
    const newUser = await User.create({
      firstname,
      lastname,
      emailId,
      password: hashedPassword,
      age,
      gender,
      skills,
      photoUrl : photoUrl.secure_url,
      about,
    });

    return res.status(201).json({
      success: true,
      message: "User added successfully",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const userExists = await User.findOne({ emailId });
    if (!userExists || !userExists.password) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized User",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { userId: userExists._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "loggedIn successfully",
      user: userExists,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});

router.post("/send-otp", async (req, res) => {
  const email = req.body.email?.trim();

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      data: { error: "email not valid" },
    });
  }

  const user = await User.findOne({ emailId: email });
  if (!user) {
    return res.status(404).json({
      success: false,
      data: { error: "user not found ! please create account" },
    });
  }

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await User.updateOne(
    { emailId: email },
    { otpHash, otpExpiresAt }
  );

  await transporter.sendMail({
    from: `"OTP Login" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });

  return res.status(200).json({
    success: true,
    data: { message: "OTP sent successfully" },
  });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      data: { error: "email and otp are required" },
    });
  }

  const user = await User.findOne({ emailId: email });
  if (!user) {
    return res.status(404).json({
      success: false,
      data: { error: "user not found" },
    });
  }

  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      data: { error: "otp expired! request a new one" },
    });
  }

  const isOtpValid = await bcrypt.compare(otp, user.otpHash);
  if (!isOtpValid) {
    return res.status(400).json({
      success: false,
      data: { error: "Invalid Otp" },
    });
  }

  user.otpHash = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    data: { message: "user loggedIn successfully" },
  });
});

router.post("/logout", (req, res) => {
  res.cookie("token", null, { maxAge: -1 });
  return res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

router.post("/verify", userAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "user verified",
    user: req.user,
  });
});

module.exports = router;
