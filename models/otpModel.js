import mongoose from "mongoose";
import generateOTPEmailTemplate from "@/Templates/Mail/otpBody";// Assuming correct path to otpBody template
import mailSender from "@/services/mailSender";
import bcrypt from "bcrypt";

// Defining a Mongoose Schema.......
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    otp_expiry_time: {
      type: Date
    }
  },
  { timestamps: true }
);

otpSchema.pre("save", async function (next) {
  try {
    const htmlContent = generateOTPEmailTemplate(this.otp);
    this.otp = await bcrypt.hash(this.otp, 12);
    console.log("Saving OTP", this.otp);

    const mailResponse = await mailSender(this.email, "Verification Email For OTP", htmlContent);
    console.log("Mail Response:" + mailResponse);
  } catch (e) {
    console.log("Error Occured while sending the Email...", e);
  }
  next();
});

// Creating a Mongoose Model.....
export default mongoose.models.OTP || mongoose.model("OTP", otpSchema);
