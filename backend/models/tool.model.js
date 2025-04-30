import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String, 
    },
    contactEmail: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Add rental fields
    rental: {
        available: {
            type: Boolean,
            default: true
        },
        price: {
            type: Number,
            default: 0
        },
        unit: {
            type: String,
            enum: ['hourly', 'daily', 'weekly'],
            default: 'daily'
        }
    },
    // Track rental requests
    rentalRequests: [
        {
            requesterId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: String,
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    // Tool metadata
    category: {
        type: String
    },
    condition: {
        type: String,
        enum: ['new', 'good', 'fair', 'poor'],
        default: 'good'
    }
}, { timestamps: true });

export const Tool = mongoose.model("Tool", toolSchema);
