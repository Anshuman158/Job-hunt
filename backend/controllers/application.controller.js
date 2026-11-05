import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";
import { ApiError } from "../utils/ApiError.js";

export const applyJob = async (req, res, next) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return next(new ApiError(400, "Job id is required."));
        }

        if (!isDbConnected()) {
            const existing = mockStore.applications.find(a => 
                a.job.toString() === jobId.toString() && 
                a.applicant.toString() === userId.toString()
            );
            if (existing) {
                return next(new ApiError(409, "You have already applied for this job"));
            }
            const job = mockStore.jobs.find(j => j._id.toString() === jobId.toString());
            if (!job) {
                return next(new ApiError(404, "Job not found"));
            }

            const newApp = {
                _id: "app_" + Date.now().toString(),
                job: jobId,
                applicant: userId,
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockStore.applications.push(newApp);
            if (!job.applications) job.applications = [];
            job.applications.push(newApp._id);

            return res.status(201).json({
                message: "Job applied successfully.",
                success: true
            });
        }

        // check if user has already applied
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return next(new ApiError(409, "You have already applied for this job"));
        }

        // check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ApiError(404, "Job not found"));
        }

        // create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });
    } catch (error) {
        next(error);
    }
};

export const getAppliedJobs = async (req, res, next) => {
    try {
        const userId = req.id;

        if (!isDbConnected()) {
            const userApps = mockStore.applications.filter(a => a.applicant.toString() === userId.toString());
            const populated = userApps.map(a => {
                const jobObj = mockStore.jobs.find(j => j._id.toString() === a.job.toString());
                const companyObj = jobObj 
                    ? (jobObj.isExternal ? { name: jobObj.companyName, logo: jobObj.companyLogo } : mockStore.companies.find(c => c._id.toString() === (jobObj.company?._id || jobObj.company).toString()))
                    : null;
                return {
                    ...a,
                    job: jobObj ? { ...jobObj, company: companyObj || { name: jobObj.companyName || "Tech Corp" } } : { title: "Developer Role" }
                };
            }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return res.status(200).json({
                application: populated,
                success: true
            });
        }

        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        next(error);
    }
};

// Admin sees how many applicants applied for this job
export const getApplicants = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        if (!isDbConnected()) {
            const job = mockStore.jobs.find(j => j._id.toString() === jobId.toString());
            if (!job) {
                return next(new ApiError(404, "Job not found."));
            }
            const apps = mockStore.applications.filter(a => a.job.toString() === jobId.toString());
            const populatedApps = apps.map(a => {
                const applicantObj = mockStore.users.find(u => u._id.toString() === a.applicant.toString());
                return {
                    ...a,
                    applicant: applicantObj || { fullname: "Applicant", email: "user@example.com", phoneNumber: 9876543210, profile: {} }
                };
            });
            return res.status(200).json({
                job: {
                    ...job,
                    applications: populatedApps
                },
                success: true
            });
        }

        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return next(new ApiError(404, "Job not found."));
        }
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const requesterId = req.id;

        const ALLOWED_STATUSES = ["pending", "accepted", "rejected"];
        if (!status || !ALLOWED_STATUSES.includes(status.toLowerCase())) {
            return next(new ApiError(400, `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`));
        }

        if (!isDbConnected()) {
            const app = mockStore.applications.find(a => a._id.toString() === applicationId.toString());
            if (!app) {
                return next(new ApiError(404, "Application not found."));
            }
            // Verify the requester owns the job this application belongs to
            const job = mockStore.jobs.find(j => j._id.toString() === app.job.toString());
            if (!job || job.created_by?.toString() !== requesterId.toString()) {
                return next(new ApiError(403, "Not authorised to update this application."));
            }
            app.status = status.toLowerCase();
            app.updatedAt = new Date();
            return res.status(200).json({ message: "Status updated successfully.", success: true });
        }

        const application = await Application.findById(applicationId).populate("job");
        if (!application) {
            return next(new ApiError(404, "Application not found."));
        }
        if (application.job.created_by?.toString() !== requesterId.toString()) {
            return next(new ApiError(403, "Not authorised to update this application."));
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({ message: "Status updated successfully.", success: true });
    } catch (error) {
        next(error);
    }
};
