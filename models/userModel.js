import mongoose from 'mongoose';
import bcrypt from "bcrypt";
// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
   lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
      message: (props) => `Email (${props.value}) is invalid!`,
    },
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define user roles (optional)
    default: 'user'
  },
  verified:{
    type:Boolean,
    default:false

  },
  profileImage:{
    type:String
  },
});

userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.password) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    //! Shift it to next hook // this.passwordChangedAt = Date.now() - 1000;
  
    next();
  });

// Create the user model
const User =  mongoose.models.User || mongoose.model('User', userSchema);



export default User;
