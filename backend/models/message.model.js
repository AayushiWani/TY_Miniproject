import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isJobAlert: {
        type: Boolean,
        default: false
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
