import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import UserRoute from "./routes/user.routes.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const app = express();

// middlerware

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// MognoDB connection
connectDB();

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// defining routes
app.use("/api/users", UserRoute);

const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BlogNest backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port -:http://localhost:${PORT}`);
});
