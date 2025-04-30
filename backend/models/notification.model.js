import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['job_application', 'job_status_update', 'group_invitation', 'tool_request', 'job_quota_filled'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    relatedJobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    relatedGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    relatedToolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
