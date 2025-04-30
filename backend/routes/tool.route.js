import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createToolRequest, getAllTools, deleteTool, requestToolRental, respondToRentalRequest } from "../controllers/tool.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createToolRequest);
router.route("/").get(getAllTools);
router.route("/:id").delete(isAuthenticated, deleteTool);
router.route("/:id/rent").post(isAuthenticated, requestToolRental);
router.route("/rent/respond").post(isAuthenticated, respondToRentalRequest);

export default router;