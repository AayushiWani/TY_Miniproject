import { Notification } from "../models/notification.model.js";

// Get notifications for the current user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate('sender', 'fullname profile.profilePhoto')
            .populate('relatedJobId', 'title company')
            .populate('relatedGroupId', 'name')
            .populate('relatedToolId', 'name');
        
        return res.status(200).json({
            notifications,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.id;
        
        const notification = await Notification.findById(notificationId);
        
        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
                success: false
            });
        }
        
        // Verify the notification belongs to the current user
        if (notification.recipient.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized",
                success: false
            });
        }
        
        notification.read = true;
        await notification.save();
        
        return res.status(200).json({
            message: "Notification marked as read",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.id;
        
        await Notification.updateMany(
            { recipient: userId, read: false },
            { $set: { read: true } }
        );
        
        return res.status(200).json({
            message: "All notifications marked as read",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Create notification utility function (to be used in other controllers)
export const createNotification = async (data) => {
    try {
        const notification = await Notification.create(data);
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};
