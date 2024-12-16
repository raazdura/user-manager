import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from './routes/users';
import bodyParser from 'body-parser';

import dotenv from 'dotenv'; 
dotenv.config();
 

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors({
    origin: '*', // or specify a domain, e.g., 'http://localhost:3000'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use('/api/user', userRoutes);

mongoose
  .connect("mongodb://localhost:27017/CRUD-user")
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT || 7000, () => {
      console.log(`[server]: Server is running at http://localhost:${process.env.PORT || 7000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });