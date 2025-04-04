import express from "express";
import pool from "./config/db.js";
import passport from "./config/passportConfig.js";

import authRoutes from "./routes/authRoutes.js";
import {
  loginController,
  signupController,
} from "./controllers/authController.js";
import session from "express-session";
// import { authMiddleware } from "middleware/authMiddleware.js";

const app = express();

app.use(express.json()); // Middleware for parsing JSON

// Session setup
app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: true })
);
// app.get("/user", authMiddleware);

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});
app.post("/signup", signupController);
app.post("/login", loginController);
// app.use("/auth", authRoutes);
pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default app;
