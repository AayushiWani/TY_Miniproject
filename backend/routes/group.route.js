import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    createGroup, 
    getAllGroups, 
    getGroupById, 
    joinGroup, 
    leaveGroup, 
    getGroupMessages,
    sendMessage,
    addJobAlert
} from "../controllers/group.controller.js";

const router = express.Router();

// Group directory and management routes
router.route("/create").post(isAuthenticated, createGroup);
router.route("/all").get(getAllGroups);
router.route("/:id").get(isAuthenticated, getGroupById);
router.route("/:id/join").post(isAuthenticated, joinGroup);
router.route("/:id/leave").post(isAuthenticated, leaveGroup);

// Group chat routes
router.route("/:id/messages").get(isAuthenticated, getGroupMessages);
router.route("/:id/messages").post(isAuthenticated, sendMessage);
router.route("/:id/job-alert").post(isAuthenticated, addJobAlert);

export default router;
