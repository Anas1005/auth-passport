// pages/api/auth.js

import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import { register } from "@/controllers/authController";
import { sendOTP } from "@/controllers/authController";// Import the sendOTP controller
import { verifyOTP } from "@/controllers/authController";; // Import the login controller
import { logIn } from "@/controllers/authController";

export async function POST(req, context) {
  const { endPoint } = await context.params;
  await dbConnect();



  console.log(endPoint);

  switch (endPoint) {
    case 'register':
        // return NextResponse.json({ message: "Register" }, { status: 200 });

      return register(req, res, async() => await sendOTP(req, res)); // Chain sendOTP after signUp
    
    case 'login':
      return logIn(req, res);

    case 'verify-otp':
        return verifyOTP(req, res);

    default:
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 });
  }
}

export async function GET(req,res) {
    const {authEndPoint} = await res.params;
    //  await dbConnect();
    // console.log(endPoint);
  
    switch (authEndPoint) {
      case 'getUserDetails':
        return NextResponse.json({ message: "This is the USer Details" }, { status: 200 });
    
      default:
        return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 });
    }
  }


  