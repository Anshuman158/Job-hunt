import bcrypt from "bcryptjs";
import { REAL_TECH_JOBS, fetchLiveRemoteJobs } from "./jobFetcher.js";

// In-memory persistent store fallback when MongoDB daemon is not running locally
class MemoryStore {
    constructor() {
        this.users = [];
        this.companies = [];
        this.jobs = [];
        this.applications = [];
        this.initDemoData();
    }

    async initDemoData() {
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        // Recruiter
        const recruiter = {
            _id: "666e11111111111111111111",
            fullname: "Shivani Sharma",
            email: "shivani@gmail.com",
            phoneNumber: 9876543210,
            password: hashedPassword,
            role: "recruiter",
            profile: {
                bio: "Senior Technical Talent Partner @ Microsoft",
                skills: ["Recruitment", "Talent Acquisition", "Technical Sourcing"],
                profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                resume: "",
                resumeOriginalName: ""
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Student
        const student = {
            _id: "666e22222222222222222222",
            fullname: "Patel Manik",
            email: "patel@gmail.com",
            phoneNumber: 9123456789,
            password: hashedPassword,
            role: "student",
            profile: {
                bio: "Experienced MERN Stack Developer with 2+ years building responsive web apps.",
                skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Next.js"],
                profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                resume: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                resumeOriginalName: "Patel_MERN_Resume.pdf"
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.users.push(recruiter, student);

        // Core Verified Companies
        const msft = {
            _id: "666c11111111111111111111",
            name: "Microsoft",
            description: "Empowering every person and organization on the planet to achieve more.",
            website: "https://microsoft.com",
            location: "Hyderabad / Bangalore",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            userId: recruiter._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const jobHunt = {
            _id: "666c22222222222222222222",
            name: "Job Hunt Tech",
            description: "Next generation job discovery and recruitment engine.",
            website: "https://jobhunt.io",
            location: "Bangalore",
            logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
            userId: recruiter._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const google = {
            _id: "666c33333333333333333333",
            name: "Google",
            description: "Organizing the world's information and making it universally accessible.",
            website: "https://google.com",
            location: "Bangalore / Hyderabad / Pune",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            userId: recruiter._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.companies.push(msft, jobHunt, google);

        // Prepend Real Live Jobs from Tier-1 Tech Giants & Unicorns
        this.jobs.push(...REAL_TECH_JOBS);

        // Pre-apply student to Microsoft Full Stack job
        const targetJob = this.jobs[1];
        if (targetJob) {
            const sampleApp = {
                _id: "666a11111111111111111111",
                job: targetJob._id,
                applicant: student._id,
                status: "accepted",
                createdAt: new Date(Date.now() - 86400000),
                updatedAt: new Date()
            };
            this.applications.push(sampleApp);
            if (!targetJob.applications) targetJob.applications = [];
            targetJob.applications.push(sampleApp._id);
        }

        // Fetch additional live remote tech listings asynchronously
        fetchLiveRemoteJobs().then((liveJobs) => {
            if (liveJobs && liveJobs.length > 0) {
                this.jobs.push(...liveJobs);
                console.log(`-> Loaded ${liveJobs.length} live remote developer jobs from public feed!`);
            }
        }).catch(() => {});
    }
}

export const mockStore = new MemoryStore();
