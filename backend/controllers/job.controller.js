import { Job } from "../models/job.model.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";
import { fetchLiveRemoteJobs, REAL_TECH_JOBS } from "../utils/jobFetcher.js";

// Recruiter posts job (supports internal apply or external company link)
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, experienceLevel, position, companyId, applyUrl } = req.body;
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

        const isExternal = Boolean(applyUrl && applyUrl.trim().length > 0);

        if (!isDbConnected()) {
            const companyObj = mockStore.companies.find(c => c._id.toString() === companyId.toString());
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
                companyName: companyObj?.name || "Company",
                companyLogo: companyObj?.logo || "",
                applyUrl: applyUrl || "",
                isExternal,
                source: isExternal ? `${companyObj?.name || 'Company'} Careers` : "Job Hunt Direct",
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
            applyUrl: applyUrl || "",
            isExternal,
            source: isExternal ? "Company Career Portal" : "Job Hunt Direct",
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
                    j.location.toLowerCase().includes(keyword) ||
                    (j.companyName && j.companyName.toLowerCase().includes(keyword)) ||
                    (j.requirements && j.requirements.some(r => r.toLowerCase().includes(keyword)))
                );
            }
            // Populate company details
            const populated = filtered.map(j => {
                if (j.isExternal || j.companyName) {
                    return {
                        ...j,
                        company: {
                            _id: j.company || j._id,
                            name: j.companyName || "Tech Corp",
                            logo: j.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
                            location: j.location,
                            website: j.applyUrl || ""
                        }
                    };
                }
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

        const formattedJobs = jobs.map(j => {
            const plain = j.toObject();
            if (plain.isExternal && (!plain.company || !plain.company.name)) {
                plain.company = {
                    name: plain.companyName || "Tech Corp",
                    logo: plain.companyLogo || "",
                    location: plain.location,
                    website: plain.applyUrl || ""
                };
            }
            return plain;
        });

        return res.status(200).json({
            jobs: formattedJobs,
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
            let companyObj;
            if (job.isExternal || job.companyName) {
                companyObj = {
                    _id: job.company || job._id,
                    name: job.companyName || "Tech Corp",
                    logo: job.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
                    location: job.location,
                    website: job.applyUrl || ""
                };
            } else {
                companyObj = mockStore.companies.find(c => c._id.toString() === (job.company?._id || job.company).toString());
            }

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

        const plainJob = job.toObject();
        if (plainJob.isExternal && (!plainJob.company || !plainJob.company.name)) {
            plainJob.company = {
                name: plainJob.companyName || "Tech Corp",
                logo: plainJob.companyLogo || "",
                location: plainJob.location,
                website: plainJob.applyUrl || ""
            };
        }

        return res.status(200).json({ job: plainJob, success: true });
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
            const adminJobs = mockStore.jobs.filter(j => j.created_by?.toString() === adminId.toString());
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

// Sync live external jobs on demand
export const syncLiveJobs = async (req, res) => {
    try {
        const liveJobs = await fetchLiveRemoteJobs();
        if (!isDbConnected()) {
            if (liveJobs.length > 0) {
                // Avoid duplicates by id
                for (const j of liveJobs) {
                    if (!mockStore.jobs.some(existing => existing._id === j._id)) {
                        mockStore.jobs.push(j);
                    }
                }
            }
            return res.status(200).json({
                message: `Synced ${liveJobs.length} live jobs successfully. Total jobs: ${mockStore.jobs.length}`,
                success: true,
                count: liveJobs.length
            });
        }

        // Real MongoDB sync
        if (liveJobs.length > 0) {
            for (const j of liveJobs) {
                const existing = await Job.findOne({ title: j.title, companyName: j.companyName });
                if (!existing) {
                    await Job.create(j);
                }
            }
        }

        return res.status(200).json({
            message: `Synced ${liveJobs.length} live external jobs into database.`,
            success: true,
            count: liveJobs.length
        });
    } catch (error) {
        console.error("Sync live jobs error:", error);
        return res.status(500).json({
            message: "Failed to sync live jobs",
            success: false
        });
    }
};
