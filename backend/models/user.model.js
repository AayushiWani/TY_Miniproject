import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{
            type:String,
            default:""
        },
        // Aadhaar for workers (students)
        aadhaar:{
            type:String,
            validate: {
                validator: function(v) {
                    // Only validate if the role is student and a value is provided
                    if (this.role === 'student' && v) {
                        return /^\d{12}$/.test(v); // Must be exactly 12 digits
                    }
                    return true;
                },
                message: props => 'Aadhaar number must be exactly 12 digits'
            }
        },
        // GSTIN for contractors (recruiters)
        gstin:{
            type:String
        }
    },
},{timestamps:true});
export const User = mongoose.model('User', userSchema);