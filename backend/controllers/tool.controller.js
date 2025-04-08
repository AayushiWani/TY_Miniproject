import { Tool } from "../models/tool.model.js";

// Create a new tool request
export const createToolRequest = async (req, res) => {
    try {
        const { name, description, contactEmail } = req.body;
        const userId = req.id; // Authenticated user ID

        if (!name || !contactEmail) {
            return res.status(400).json({ message: "Name and email are required.", success: false });
        }

        const newTool = await Tool.create({ name, description, contactEmail, userId });

        return res.status(201).json({ message: "Tool request created.", tool: newTool, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

// Get all requested tools
export const getAllTools = async (req, res) => {
    try {
        const tools = await Tool.find().populate("userId", "name");
        return res.status(200).json({ tools, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

// function to delete tool request
export const deleteTool = async (req, res) => {
    try {
        const toolId = req.params.id;
        const userId = req.id; // Authenticated user ID

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
