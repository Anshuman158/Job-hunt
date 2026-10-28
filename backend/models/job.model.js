import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
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
    experienceLevel: {
        type: Number,
        required: true
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

export const Job = mongoose.model("Job", jobSchema);
