import mongoose from "mongoose";
import User from "../models/User";
import ErrorResponse from "../utils/errorResponse";
import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import nodemailer from 'nodemailer';

// Types for the request and response
interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface ResetPasswordRequest extends Request {
  body: {
    email: string;
  };
}

interface VerifyOTPRequest extends Request {
  body: {
    otp: Number;
  };
}

interface ChangePasswordRequest extends Request {
  body: {
    email: string,
    otp: string;
    newPassword: string
  };
}

// Register User
type RegisterRequestBody = {
  name: string;
  email: string;
  password: string;
};

const register: RequestHandler<any, any, RegisterRequestBody> = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name); // Log the name to check if it is being passed correctly
  console.log(email);
  console.log(password);

  try {
    // Create the user
    const user = await User.create({ username: name, email, password });

    res.status(201).json({ success: true, user });
  } catch (error) {
    // Pass the error to the next middleware
    console.log(error);
    next(new ErrorResponse("User registration failed", 500));
  }
};

// Login User
const login = async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Find the user by email, select password and _id, and populate tasks
    const user = await User.findOne({ email }).select("+password +_id"); // This will populate the `tasks` field with full task documents

    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    res.status(201).json({ success: true, user});
  } catch (error) {
    next(new ErrorResponse("Error during login", 500));
  }
};

const getUsers = async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find({});
    
    res.status(201).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(new ErrorResponse("Error during login", 500));
  }
};

// Get User Details
const getUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  console.log("ID received:", id);

  // Check if the provided ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid ObjectId:", id); // Add log for invalid ObjectId
    return next(new ErrorResponse("Invalid User ID", 404));
  }

  try {
    // Try to find the user in the database by ID
    const userDetails = await User.findById(id);

    // If no user is found, return an error
    if (!userDetails) {
      console.error("User not found for ID:", id); // Add log for missing user
      return next(new ErrorResponse("User not found", 404));
    }

    // Return the found user details
    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error); // Add log for errors
    next(new ErrorResponse("Error fetching user details", 500));
  }
};

// Reset Password
const resetpassword = async (req: ResetPasswordRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("User not found", 400));
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    user.otp = otp;
    await user.save();

    console.log(`OTP for ${email}: ${otp}`);

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",  // Use Gmail as the email service
      auth: {
        user: process.env.GMAIL_USER,  // Your Gmail address
        pass: process.env.GMAIL_PASSWORD,  // Your Gmail password or App password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,  // Sender address
      to: email,  // Recipient address
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send the email with the OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return next(new ErrorResponse("Error sending OTP email", 500));
      }
      console.log("OTP sent: " + info.response);
    });

    res.status(200).json({ success: true, data: "Password Reset Successful" });
  } catch (error) {
    next(new ErrorResponse("Error resetting password", 500));
  }
};

const verifyOTP = async (req: VerifyOTPRequest, res: Response, next: NextFunction): Promise<void> => {
  const { otp } = req.body;
 
  try {
    const user = await User.findOne({ otp });

    if (!user) {
      return next(new ErrorResponse("User not found", 400));
    }
  await user.save();

  res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
    next(new ErrorResponse("Error resetting password", 500));
  }
};

// Update User
const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (name) {
      user.username = name;
    }
    if (email) {
      user.email = email;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(new ErrorResponse("Error updating user", 500));
  }
};

const changePassword = async (req: ChangePasswordRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, otp, newPassword } = req.body;
  console.log(email);
  console.log(otp);
  console.log(newPassword);

 
  try {
    const user = await User.findOne({ otp });

    if (!user) {
      return next(new ErrorResponse("User not found", 400));
    }
    if (user.otp !== parseInt(otp)) {
      return next(new ErrorResponse("Invalid OTP", 400));
    }
    
    // Hash the new password and save it
    user.password = newPassword; // Assuming you hash passwords in a middleware or before saving
    user.otp = null; // Clear OTP after successful password change
    await user.save();

  res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(new ErrorResponse("Error resetting password", 500));
  }
};


export {
  register,
  login,
  getUsers,
  resetpassword,
  verifyOTP,
  getUserDetails,
  updateUser,
  changePassword
};
