import { Group } from "../models/group.model.js";
import { Message } from "../models/message.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// Create a new profession-based group
export const createGroup = async (req, res) => {
    try {
        const { name, description, profession } = req.body;
        const userId = req.id;

        if (!name || !description || !profession) {
            return res.status(400).json({
                message: "Name, description and profession are required",
                success: false
            });
        }

        // Check if group with same name already exists
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({
                message: "A group with this name already exists",
                success: false
            });
        }

        // Create new group
        const group = await Group.create({
            name,
            description,
            profession,
            creator: userId,
            members: [userId] // Creator is the first member
        });

        return res.status(201).json({
            message: "Group created successfully",
            group,
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

// Get all profession-based groups (directory)
export const getAllGroups = async (req, res) => {
    try {
        const { profession } = req.query;
        let query = {};
        
        if (profession) {
            query.profession = profession;
        }
        
        const groups = await Group.find(query)
            .populate('creator', 'fullname email profile.profilePhoto')
            .sort({ createdAt: -1 });
            
        return res.status(200).json({
            groups,
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

// Get group details by ID
export const getGroupById = async (req, res) => {
    try {
        const groupId = req.params.id;
        
        const group = await Group.findById(groupId)
            .populate('creator', 'fullname email profile.profilePhoto')
            .populate('members', 'fullname email profile.profilePhoto role')
            .populate('jobAlerts');
            
        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false
            });
        }
        
        return res.status(200).json({
            group,
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

// Join a group
export const joinGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.id;
        
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false
            });
        }
        
        // Check if user is already a member - compare as strings
        const isMember = group.members.some(memberId => 
            memberId.toString() === userId.toString()
        );
        
        if (isMember) {
            return res.status(400).json({
                message: "You are already a member of this group",
                success: false
            });
        }
        
        // Add user to group members
        group.members.push(userId);
        await group.save();
        
        // Add system message about new member
        const user = await User.findById(userId).select('fullname');
        await Message.create({
            group: groupId,
            sender: userId,
            content: `${user.fullname} has joined the group`,
            isJobAlert: false
        });
        
        return res.status(200).json({
            message: "Successfully joined the group",
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

// Leave a group
export const leaveGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.id;
        
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false
            });
        }
        
        // Check if user is a member - compare as strings
        const isMember = group.members.some(memberId => 
            memberId.toString() === userId.toString()
        );
        
        if (!isMember) {
            return res.status(400).json({
                message: "You are not a member of this group",
                success: false
            });
        }
        
        // Remove user from group members
        group.members = group.members.filter(memberId => 
            memberId.toString() !== userId.toString()
        );
        await group.save();
        
        // Add system message about member leaving
        const user = await User.findById(userId).select('fullname');
        await Message.create({
            group: groupId,
            sender: userId, 
            content: `${user.fullname} has left the group`,
            isJobAlert: false
        });
        
        return res.status(200).json({
            message: "Successfully left the group",
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

// Get group messages (chat history)
export const getGroupMessages = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.id;
        
        // Check if group exists and user is a member
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false
            });
        }
        
        // Check if user is a member - compare as strings
        const isMember = group.members.some(memberId => 
            memberId.toString() === userId.toString()
        );
        
        if (!isMember) {
            return res.status(403).json({
                message: "You must be a member to view messages",
                success: false
            });
        }
        
        // Get messages for this group
        const messages = await Message.find({ group: groupId })
            .populate('sender', 'fullname email profile.profilePhoto')
            .populate('jobId')
            .sort({ createdAt: 1 });
            
        return res.status(200).json({
            messages,
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

// Send a message to a group
export const sendMessage = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.id;
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({
                message: "Message content is required",
                success: false
            });
        }
        
        // Check if group exists and user is a member
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false
            });
        }
        
        if (!group.members.includes(userId)) {
            return res.status(403).json({
                message: "You must be a member to send messages",
                success: false
            });
        }
        
        // Create and save the message
        const message = await Message.create({
            group: groupId,
            sender: userId,
            content
        });
        
        // Populate sender information for the response
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'fullname email profile.profilePhoto');
            
        // In a real application, emit this message via socket.io
        
        return res.status(201).json({
            message: "Message sent successfully",
            data: populatedMessage,
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

// Add a job alert to the group
export const addJobAlert = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.id;
        const { jobId } = req.body;
        
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }
        
        // Check if group and job exist
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found", 
                success: false
            });
        }
        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        
        // Check if user is a member
        if (!group.members.includes(userId)) {
            return res.status(403).json({
                message: "You must be a member to send job alerts",
                success: false
            });
        }
        
        // Add job to group's job alerts
        if (!group.jobAlerts.includes(jobId)) {
            group.jobAlerts.push(jobId);
            await group.save();
        }
        
        // Create job alert message
        const message = await Message.create({
            group: groupId,
            sender: userId,
            content: `New job opportunity: ${job.title} at ${job.location}`,
            isJobAlert: true,
            jobId
        });
        
        // Populate message data for response
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'fullname email profile.profilePhoto')
            .populate('jobId');
            
        // In a real application, emit this message via socket.io
        
        return res.status(201).json({
            message: "Job alert sent successfully",
            data: populatedMessage,
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
