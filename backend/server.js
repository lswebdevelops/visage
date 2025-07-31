import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import trainingTypeRoutes from "./routes/trainingTypeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import myWorkoutRoutes from './routes/myWorkoutRoutes.js'
import biographyRoutes from './routes/biographyRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";



const port = process.env.PORT || 5000;

connectDB(); // connect to MongoDB

const app = express();
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());



app.use("/api/trainingTypes", trainingTypeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/about_us", biographyRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/clients", myWorkoutRoutes);



const __dirname = path.resolve(); // set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// uncomment for production build
// then add this script to the root package.json (   "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend") and to .env :> NODE_ENV=development change to production

// if (process.env.NODE_ENV === 'production') {
//   //  set static folder
//   app.use(express.static(path.join(__dirname, '/frontend/build')));

//   // any route that is not api will be redirected to index.html
//   app.get('*', (req, res) => 
//   res.sendFile(path.resolve(__dirname, 'frontend', 'build' , 'index.html')))
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
// }
// comment until here

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
