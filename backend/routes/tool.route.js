import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createToolRequest, getAllTools, deleteTool } from "../controllers/tool.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createToolRequest);
router.route("/").get(getAllTools);
router.route("/:id").delete(isAuthenticated, deleteTool); // Add this line

export default router;