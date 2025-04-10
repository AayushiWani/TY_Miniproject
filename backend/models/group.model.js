import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    jobAlerts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, { timestamps: true });

export const Group = mongoose.model("Group", groupSchema);
