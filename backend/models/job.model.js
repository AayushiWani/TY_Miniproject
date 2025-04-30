import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel:{
        type:Number,
        required:true,
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    // Add profession field for filtering
    profession: {
        type: String,
        required: true
    },
    // Add quota details
    quota: {
        enabled: {
            type: Boolean,
            default: false
        },
        total: {
            type: Number,
            default: 0
        },
        filled: {
            type: Number,
            default: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
},{timestamps:true});

// Pre-save middleware to check if job quota is filled and update isActive
jobSchema.pre('save', async function(next) {
    if (this.quota.enabled && this.quota.filled >= this.quota.total) {
        this.isActive = false;
    }
    next();
});

export const Job = mongoose.model("Job", jobSchema);