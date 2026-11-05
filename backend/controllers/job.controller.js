import { Job } from "../models/job.model.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";
import { fetchLiveRemoteJobs } from "../utils/jobFetcher.js";
import { ApiError } from "../utils/ApiError.js";

// Recruiter posts job (supports internal apply or external company link)
export const postJob = async (req, res, next) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, experienceLevel, position, companyId, applyUrl } = req.body;
        const userId = req.id;
        const exp = experience !== undefined && experience !== "" ? experience : experienceLevel;

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
                position: Number(position || 1),
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
            position: Number(position || 1),
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
        next(error);
    }
};

// Students/everyone get all jobs with optional search query & pagination
export const getAllJobs = async (req, res, next) => {
    try {
        const keyword = (req.query.keyword || "").trim().toLowerCase();
        const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 12));

        if (!isDbConnected()) {
            let filtered = mockStore.jobs;
            if (keyword) {
                filtered = mockStore.jobs.filter(j => 
                    j.title.toLowerCase().includes(keyword) ||
                    j.description.toLowerCase().includes(keyword) ||
                    j.location.toLowerCase().includes(keyword) ||
                    (j.companyName && j.companyName.toLowerCase().includes(keyword)) ||
                    (j.requirements && j.requirements.some(r => r.toLowerCase().includes(keyword))) ||
                    (j.source && j.source.toLowerCase().includes(keyword))
                );
            }

            const totalJobs = filtered.length;
            const totalPages = hasPagination ? Math.ceil(totalJobs / limit) || 1 : 1;
            const paginatedList = hasPagination 
                ? filtered.slice((page - 1) * limit, page * limit)
                : filtered;

            // Populate company details
            const populated = paginatedList.map(j => {
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
                totalJobs,
                totalPages,
                currentPage: page,
                limit: hasPagination ? limit : totalJobs,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                success: true
            });
        }

        // Mongoose query with pagination
        const query = {};
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } },
                { companyName: { $regex: keyword, $options: "i" } }
            ];
        }

        const totalJobs = await Job.countDocuments(query);
        const totalPages = hasPagination ? Math.ceil(totalJobs / limit) || 1 : 1;

        let jobQuery = Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });

        if (hasPagination) {
            jobQuery = jobQuery.skip((page - 1) * limit).limit(limit);
        }

        const jobs = await jobQuery;

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
            totalJobs,
            totalPages,
            currentPage: page,
            limit: hasPagination ? limit : totalJobs,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            success: true
        });
    } catch (error) {
        next(error);
    }
};

// Student get job by id
export const getJobById = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        if (!isDbConnected()) {
            const job = mockStore.jobs.find(j => j._id.toString() === jobId.toString());
            if (!job) {
                return next(new ApiError(404, "Job not found."));
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
            return next(new ApiError(404, "Job not found."));
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
        next(error);
    }
};

// Recruiter get all jobs created by them
export const getAdminJobs = async (req, res, next) => {
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
        next(error);
    }
};

// Sync live external jobs on demand
export const syncLiveJobs = async (req, res, next) => {
    try {
        const liveJobs = await fetchLiveRemoteJobs();
        if (!isDbConnected()) {
            if (liveJobs.length > 0) {
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
        next(error);
    }
};
