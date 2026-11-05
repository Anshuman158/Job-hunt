import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
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
    experienceLevel: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    jobType: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: Number,
        default: 1
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    companyName: {
        type: String,
        default: ""
    },
    companyLogo: {
        type: String,
        default: ""
    },
    applyUrl: {
        type: String,
        default: ""
    },
    isExternal: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        default: "Job Hunt Direct"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }
    ]
}, { timestamps: true });

// ── Indexes for query performance and full-text search ──────────────────────
jobSchema.index({ title: "text", description: "text", location: "text" });
jobSchema.index({ company: 1 });
jobSchema.index({ created_by: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ isExternal: 1 });

export const Job = mongoose.model("Job", jobSchema);
