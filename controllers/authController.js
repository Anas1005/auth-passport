import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import User from "@/models/userModel";
import OTP from "@/models/otpModel";
import filterObj from "@/utils/filterObj";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
dotenv.config();

export async function register(req, res, next) {
  console.log("In SignUp");
 
  try {
    const userDetails = await req.json();
    const { firstName, lastName, email, password, confirmPassword } = userDetails;
    console.log(firstName,lastName,email,password,confirmPassword)
    if (!firstName || !lastName || !password || !confirmPassword) {
      console.log("Missing Hia Kuchh..")
      return NextResponse.json({
        success: false,
        message: "Please fill all the details carefully..."
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Password and Confirm Password do not match.."
      }, { status: 400 });
    }

    const filteredBody = filterObj(
      userDetails,
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword"
    );

    console.log("Filtered",filteredBody);

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      return NextResponse.json({
        status: "error",
        success: false,
        message: "Email already in use, please login."
      }, { status: 400 });
    } else if (existingUser) {
      const user = await User.findOneAndUpdate({ email: email }, filteredBody, {
        new: true,
        validateModifiedOnly: true
      });

      await user.save();

      req.user = {
        userId: existingUser._id,
        email: existingUser.email
      };

      next();
    } else {
      const newUser = await User.create(filteredBody);

      req.user = {
        userId: newUser._id,
        email: newUser.email
      };
      next();
    }
  } catch (error) {
    console.error("Error in register middleware:", error);
    return NextResponse.json({
      success: false,
      message: "Error in creating user"
    }, { status: 500 });
  }
};

export async function sendOTP(req, res) {
  try {
    console.log("Sending OTP...");

    const userEmail = req.user.email;

    const generatedOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    console.log("Generated OTP:", generatedOTP);

    const otp_expiry_time = Date.now() + 10 * 60 * 1000;
    const createdOTP = await OTP.create({
      email: userEmail,
      otp: generatedOTP,
      otp_expiry_time
    });

    console.log("OTP Saved to Database:", createdOTP);

    return NextResponse.json({
      success: true,
      message: "OTP Sent Successfully"
    },{status:200});
  } catch (error) {
    console.error("Error in sendOTP middleware:", error);

    return NextResponse.json({
      success: false,
      message: "Error in sending OTP"
    }, { status: 500 });
  }
};

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = await req.json();
    console.log("Verifying OTP for:", email);

    if (!email || !otp) {
      return NextResponse.json({
        success: false,
        message: "OTP Not Found"
      }, { status: 400 });
    }

    const recentOTP = await OTP.findOne({
      email,
      otp_expiry_time: { $gt: Date.now() }
    }).sort({ createdAt: -1 });

    console.log("Latest OTP from DB:", recentOTP);

    if (!recentOTP) {
      return NextResponse.json({
        success: false,
        message: "OTP has expired."
      }, { status: 400 });
    }

    console.log("Type of Client OTP:", typeof otp);
    console.log("Type of DB OTP:", typeof recentOTP.otp);

    const isOTPMatched = await bcrypt.compare(otp, recentOTP.otp);

    if (isOTPMatched) {
      const user = await User.findOneAndUpdate(
        { email },
        { verified: true },
        { new: true }
      );
      await OTP.deleteMany({ email });
      const payload = {
        userId: user._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h"
      });

      const responseUser = {
        ...user.toObject(),
        token: token,
        password: undefined
      };

      const options = {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        httpOnly: true
      };

      

      return NextResponse.json({
        success: true,
        responseUser,
        token,
        message: "OTP Verified & Logged in successfully"
      });
    } else {
      console.log("OTP Mismatch:", otp, recentOTP.otp);
      return NextResponse.json({
        success: false,
        message: "OTP does not match."
      }, { status: 400 });
    }
  } catch (e) {
    console.error("Error in verifyOTP middleware:", e.message);

    return NextResponse.json({
      success: false,
      message: "Error verifying OTP."
    }, { status: 500 });
  }
};

export async function logIn(req, res) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Please fill in all the details carefully..."
      }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || !user.verified) {
      return NextResponse.json({
        success: false,
        message: "First, go and sign up, then log in."
      }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const payload = {
        userId: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h"
      });

      const responseUser = {
        ...user.toObject(),
        token: token,
        password: undefined
      };

      const options = {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        httpOnly: true
      };

      res.cookie("token", token, options);

      return NextResponse.json({
        success: true,
        responseUser,
        token,
        message: "Logged in successfully"
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Incorrect Password"
      }, { status: 403 });
    }
  } catch (error) {
    console.error("Error in logIn middleware:", error);
    return NextResponse.json({
      success: false,
      message: "Error in Log In"
    }, { status: 500 });
  }
};
