import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: ""
    },
    verificationTokenExpiry: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
        default: ""
    },
    resetPasswordExpiry: {
        type: Date
    },
    refreshToken: {
        type: String,
        default: ""
    },
    profile: {
        bio: { type: String, default: "" },
        skills: [{ type: String }],
        resume: { type: String, default: "" },
        resumeOriginalName: { type: String, default: "" },
        resumePublicId: { type: String, default: "" },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        },
        profilePhotoPublicId: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true });

// ── Indexes for query performance ───────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ verificationToken: 1 });

export const User = mongoose.model('User', userSchema);
