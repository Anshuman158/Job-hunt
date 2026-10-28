import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { isDbConnected } from "../utils/db.js";
import { mockStore } from "../utils/mockStore.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        if (!isDbConnected()) {
            const existing = mockStore.applications.find(a => 
                a.job.toString() === jobId.toString() && 
                a.applicant.toString() === userId.toString()
            );
            if (existing) {
                return res.status(400).json({
                    message: "You have already applied for this job",
                    success: false
                });
            }
            const job = mockStore.jobs.find(j => j._id.toString() === jobId.toString());
            if (!job) {
                return res.status(404).json({
                    message: "Job not found",
                    success: false
                });
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
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
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
        console.error("Apply job error:", error);
        return res.status(500).json({
            message: "Internal server error applying to job",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        if (!isDbConnected()) {
            const userApps = mockStore.applications.filter(a => a.applicant.toString() === userId.toString());
            const populated = userApps.map(a => {
                const jobObj = mockStore.jobs.find(j => j._id.toString() === a.job.toString());
                const companyObj = jobObj ? mockStore.companies.find(c => c._id.toString() === (jobObj.company?._id || jobObj.company).toString()) : null;
                return {
                    ...a,
                    job: jobObj ? { ...jobObj, company: companyObj || { name: "Tech Corp" } } : { title: "Developer Role" }
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
        console.error("Get applied jobs error:", error);
        return res.status(500).json({
            message: "Internal server error fetching applied jobs",
            success: false
        });
    }
};

// Admin sees how many applicants applied for this job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!isDbConnected()) {
            const job = mockStore.jobs.find(j => j._id.toString() === jobId.toString());
            if (!job) {
                return res.status(404).json({
                    message: 'Job not found.',
                    success: false
                });
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
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error("Get applicants error:", error);
        return res.status(500).json({
            message: "Internal server error fetching applicants",
            success: false
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: 'status is required',
                success: false
            });
        }

        if (!isDbConnected()) {
            const app = mockStore.applications.find(a => a._id.toString() === applicationId.toString());
            if (!app) {
                return res.status(404).json({
                    message: "Application not found.",
                    success: false
                });
            }
            app.status = status.toLowerCase();
            app.updatedAt = new Date();
            return res.status(200).json({
                message: "Status updated successfully.",
                success: true
            });
        }

        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // update status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Update status error:", error);
        return res.status(500).json({
            message: "Internal server error updating applicant status",
            success: false
        });
    }
};
