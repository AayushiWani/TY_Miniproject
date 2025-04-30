import { Tool } from "../models/tool.model.js";
import { createNotification } from "./notification.controller.js";

// Create a new tool
export const createToolRequest = async (req, res) => {
    try {
        const { name, description, contactEmail, category, condition, rentalPrice, rentalUnit } = req.body;
        const userId = req.id;

        if (!name || !contactEmail) {
            return res.status(400).json({ message: "Name and email are required.", success: false });
        }

        const newTool = await Tool.create({ 
            name, 
            description, 
            contactEmail, 
            userId,
            category,
            condition,
            rental: {
                available: true,
                price: rentalPrice || 0,
                unit: rentalUnit || 'daily'
            }
        });

        return res.status(201).json({ message: "Tool added successfully.", tool: newTool, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

// Get all tools
export const getAllTools = async (req, res) => {
    try {
        const tools = await Tool.find()
            .populate("userId", "fullname email")
            .populate("rentalRequests.requesterId", "fullname email profile");
            
        return res.status(200).json({ tools, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

// Request to rent a tool
export const requestToolRental = async (req, res) => {
    try {
        const toolId = req.params.id;
        const userId = req.id;
        const { message } = req.body;
        
        const tool = await Tool.findById(toolId);
        
        if (!tool) {
            return res.status(404).json({ message: "Tool not found.", success: false });
        }
        
        if (!tool.rental.available) {
            return res.status(400).json({ message: "This tool is not available for rental.", success: false });
        }
        
        // Check if user already has a pending request
        const existingRequest = tool.rentalRequests.find(
            req => req.requesterId.toString() === userId && req.status === 'pending'
        );
        
        if (existingRequest) {
            return res.status(400).json({ message: "You already have a pending request for this tool.", success: false });
        }
        
        // Add new request
        tool.rentalRequests.push({
            requesterId: userId,
            message: message || "I'm interested in renting this tool",
            status: 'pending'
        });
        
        await tool.save();
        
        // Create notification for tool owner
        await createNotification({
            recipient: tool.userId,
            sender: userId,
            type: 'tool_request',
            content: `New rental request for your tool: ${tool.name}`,
            relatedToolId: tool._id
        });
        
        return res.status(200).json({ message: "Rental request sent successfully.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

// Respond to rental request (approve/reject)
export const respondToRentalRequest = async (req, res) => {
    try {
        const { toolId, requestId, status } = req.body;
        const userId = req.id;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status.", success: false });
        }
        
        const tool = await Tool.findById(toolId);
        
        if (!tool) {
            return res.status(404).json({ message: "Tool not found.", success: false });
        }
        
        // Verify ownership
        if (tool.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to manage this tool.", success: false });
        }
        
        // Find and update the request
        const requestIndex = tool.rentalRequests.findIndex(req => req._id.toString() === requestId);
        
        if (requestIndex === -1) {
            return res.status(404).json({ message: "Request not found.", success: false });
        }
        
        tool.rentalRequests[requestIndex].status = status;
        
        // If approved, set availability to false
        if (status === 'approved') {
            tool.rental.available = false;
        }
        
        await tool.save();
        
        // Create notification for requester
        await createNotification({
            recipient: tool.rentalRequests[requestIndex].requesterId,
            sender: userId,
            type: 'tool_request',
            content: `Your rental request for ${tool.name} has been ${status}`,
            relatedToolId: tool._id
        });
        
        return res.status(200).json({ 
            message: `Rental request ${status} successfully.`, 
            success: true 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

// Delete tool
export const deleteTool = async (req, res) => {
    try {
        const toolId = req.params.id;
        const userId = req.id;

        // Find the tool
        const tool = await Tool.findById(toolId);

        if (!tool) {
            return res.status(404).json({ message: "Tool not found.", success: false });
        }

        // Check if the user is the creator of the tool
        if (tool.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this tool.", success: false });
        }

        // Delete the tool
        await Tool.findByIdAndDelete(toolId);
        
        return res.status(200).json({ message: "Tool deleted successfully.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};
