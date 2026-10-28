import { Job } from "../models/job.model.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";

// Recruiter posts job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, experienceLevel, position, companyId } = req.body;
        const userId = req.id;
        const exp = experience !== undefined && experience !== "" ? experience : experienceLevel;

        if (!title || !description || !requirements || salary === undefined || salary === "" || !location || !jobType || exp === undefined || exp === "" || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const requirementsArray = typeof requirements === "string" 
            ? requirements.split(",").map(r => r.trim()).filter(Boolean)
            : requirements;

        if (!isDbConnected()) {
            const newJob = {
                _id: "job_" + Date.now().toString(),
                title,
                description,
                requirements: requirementsArray,
                salary: Number(salary),
                location,
                jobType,
                experienceLevel: Number(exp),
                position: Number(position),
                company: companyId,
                created_by: userId,
                applications: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockStore.jobs.unshift(newJob);
            return res.status(201).json({
                message: "New job created successfully.",
                job: newJob,
                success: true
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(exp),
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Post job error:", error);
        return res.status(500).json({
            message: "Internal server error posting job",
            success: false
        });
    }
};

// Students/everyone get all jobs (with search/filter query)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = (req.query.keyword || "").toLowerCase();
        
        if (!isDbConnected()) {
            let filtered = mockStore.jobs;
            if (keyword) {
                filtered = mockStore.jobs.filter(j => 
                    j.title.toLowerCase().includes(keyword) ||
                    j.description.toLowerCase().includes(keyword) ||
                    j.location.toLowerCase().includes(keyword)
                );
            }
            // Populate company
            const populated = filtered.map(j => {
                const companyObj = mockStore.companies.find(c => c._id.toString() === (j.company?._id || j.company).toString());
                return {
                    ...j,
                    company: companyObj || { name: "Tech Corp", location: j.location }
                };
            });
            return res.status(200).json({
                jobs: populated,
                success: true
            });
        }

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Get all jobs error:", error);
        return res.status(500).json({
            message: "Internal server error fetching jobs",
            success: false
        });
    }
};

// Student get job by id
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!isDbConnected()) {
            const job = mockStore.jobs.find(j => j._id.toString() === jobId.toString());
            if (!job) {
                return res.status(404).json({
                    message: "Job not found.",
                    success: false
                });
            }
            const companyObj = mockStore.companies.find(c => c._id.toString() === (job.company?._id || job.company).toString());
            const apps = mockStore.applications.filter(a => a.job.toString() === jobId.toString());
            const fullJob = {
                ...job,
                company: companyObj || { name: "Tech Corp", location: job.location },
                applications: apps
            };
            return res.status(200).json({ job: fullJob, success: true });
        }

        const job = await Job.findById(jobId).populate({
            path: "applications"
        }).populate({
            path: "company"
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Get job by id error:", error);
        return res.status(500).json({
            message: "Internal server error fetching job details",
            success: false
        });
    }
};

// Recruiter get all jobs created by them
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;

        if (!isDbConnected()) {
            const adminJobs = mockStore.jobs.filter(j => j.created_by.toString() === adminId.toString());
            const populated = adminJobs.map(j => {
                const companyObj = mockStore.companies.find(c => c._id.toString() === (j.company?._id || j.company).toString());
                return {
                    ...j,
                    company: companyObj || { name: "Tech Corp", location: j.location }
                };
            });
            return res.status(200).json({
                jobs: populated,
                success: true
            });
        }

        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company'
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Get admin jobs error:", error);
        return res.status(500).json({
            message: "Internal server error fetching admin jobs",
            success: false
        });
    }
};
