import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getNotifications);
router.route("/:notificationId/read").put(isAuthenticated, markAsRead);
router.route("/read-all").put(isAuthenticated, markAllAsRead);

export default router;
