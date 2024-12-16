import crypto from "crypto";
import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// Define an interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  otp?: number | null;  // Allow otp to be number or null
  resetPasswordExpire?: Date;

  matchPassword(password: string): Promise<boolean>;
}

// Define the schema
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please provide username"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // Exclude password from query results by default
  },
  otp: {
    type: Number,
    default: null,  // Set the default to null, so it is explicitly set to null if not provided
  },
  resetPasswordExpire: {
    type: Date,
  },
},
{ timestamps: true });

// Pre-save middleware to hash the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Match password
UserSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
