// import dotenv from "dotenv";
// dotenv.config();

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path=require('path');
const connectDB=require('./config/db');
const bcrypt = require("bcryptjs");


const authRoutes=require('./routes/authRoutes')
const resumeRoutes=require('./routes/resumeRoutes');
const app = express();

//MiddleWare to handle CORS
// app.use(
//     cors({
//         origin:process.env.CLIENT_URL || "*",
//         methods:["GET","POST","PUT","DELETE"],
//         allowedHeaders:["Content-Type","Authorization"],
//     })
// );
// app.use(//New CORS configuration
//   cors({
//     // origin: "http://localhost:5173", // your frontend's URL
//     origin: process.env.CLIENT_URL,
//     credentials: true,                // allow cookies, Authorization headers
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
   app.use
     (cors({
    //    origin: "https://intelliresume123.netlify.app",
         origin: "http://localhost:5173",
       credentials: true,
       methods: ["GET", "POST", "PUT", "DELETE"],
       allowedHeaders: ["Content-Type", "Authorization"],
        })
   );

//Connect Database
connectDB();


//MiddleWare to parse JSON bodies
app.use(express.json());

//Add this just after your app.use(express.json()); ***New***
//Sometimes browsers send a preflight OPTIONS request, which fails silently. You can ensure it passes:
// app.options("*", cors()); // handle preflight requests globally


//Routes
app.use("/api/auth",authRoutes);
app.use("/api/resume",resumeRoutes);


//Serve uploads folder
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"),{
        setHeaders : (res,path)=>{
            // res.set("Access-Control-Allow-Origin", "https://intelliresume123.netlify.app");
            res.set("Access-Control-Allow-Origin", "http://localhost:5173");
        },
    })
);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`));

console.log("JWT:", process.env.JWT_SECRET);
console.log("DB:", process.env.MONGO_URI);
