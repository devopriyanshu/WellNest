import express from "express";
import pool from "./config/db.js";
import passport from "./config/passportConfig.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expertRoutes from "./routes/expertRoutes.js";
import centerRoutes from "./routes/centerRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import centralUserRoutes from "./routes/centralUserRoutes.js";
import {
  loginController,
  signupController,
} from "./controllers/authController.js";
import session from "express-session";
// import { authMiddleware } from "middleware/authMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON

// Session setup
app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: true })
);
// app.get("/user", authMiddleware);

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
//Expert routes
app.use("/experts", expertRoutes);

//user routes
app.use("/users", userRoutes);
app.use("/api/user", centralUserRoutes);

app.use("/appointments", appointmentRoutes);

// Auth Routes
app.use("/logs", logRoutes);
app.use("/auth", authRoutes);

app.use("/centers", centerRoutes);
app.use("/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});
// app.post("/signup", signupController);
// app.post("/login", loginController);
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
