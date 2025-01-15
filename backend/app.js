import express from "express";
import pool from "./config/db.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default app;
