import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import toolRoute from "./routes/tool.route.js";
import groupRoute from "./routes/group.route.js"; // Import group routes

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Join a group chat room
  socket.on("join-group", (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.userId} joined group ${groupId}`);
  });
  
  // Leave a group chat room
  socket.on("leave-group", (groupId) => {
    socket.leave(groupId);
    console.log(`User ${socket.userId} left group ${groupId}`);
  });
  
  // Handle new messages
  socket.on("new-message", (data) => {
    // Don't emit back to the sender - only to others in the room
    socket.to(data.groupId).emit("receive-message", data.message);
  });
  
  // Handle job alerts
  socket.on("new-job-alert", (data) => {
    // Don't emit back to the sender - only to others in the room
    socket.to(data.groupId).emit("receive-job-alert", data.alert);
  });
  
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/tool", toolRoute);
app.use("/api/v1/groups", groupRoute); // Add group routes

httpServer.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
