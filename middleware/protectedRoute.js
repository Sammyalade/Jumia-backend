import Jwt from "jsonwebtoken";
import User from "../models/user.js";

// The protectedRoute middleware checks for the JWT token and attaches the user to the request object
export const protectedRoute = async (req, res, next) => {
  try {
    // Extract token from the authorization header
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ error: "You are not authorized" });
    }

    // Decode the token using JWT secret (process.env.JWT_SECRET should be set in your environment)
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token, authorization failed" });
    }

    // Find the user associated with the decoded token id (adjust field name for your case)
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ['password'] },  // Exclude password from the response
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach the user to the request object for later use
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Log the error in case you want more information in your console
    console.error(error);

    // Return a 401 Unauthorized response if there's any error
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Session expired. Please log in again.'
    });
  }
};
