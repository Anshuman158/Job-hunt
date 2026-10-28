import bcrypt from "bcryptjs";

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

        // Companies
        const msft = {
            _id: "666c11111111111111111111",
            name: "Microsoft",
            description: "Empowering every person and organization on the planet to achieve more.",
            website: "https://microsoft.com",
            location: "Hyderabad",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            userId: recruiter._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const jobHunt = {
            _id: "666c22222222222222222222",
            name: "Job Hunt",
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
            location: "Pune",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            userId: recruiter._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.companies.push(msft, jobHunt, google);

        // Jobs
        const sampleJobs = [
            {
                _id: "666j11111111111111111111",
                title: "Frontend Developer",
                description: "I need a Frontend Developer who can make professional UI web pages using modern React, Redux, and Tailwind CSS with clean animations.",
                requirements: ["React", "JavaScript", "Tailwind CSS", "Redux Toolkit", "HTML/CSS"],
                salary: 14,
                experienceLevel: 2,
                location: "Hyderabad",
                jobType: "Full Time",
                position: 4,
                company: jobHunt._id,
                created_by: recruiter._id,
                applications: [],
                createdAt: new Date(Date.now() - 86400000), // 1 day ago
                updatedAt: new Date()
            },
            {
                _id: "666j22222222222222222222",
                title: "Full Stack Developer",
                description: "Looking for a seasoned Full Stack Developer with expertise in Node.js, Express, React, and database design to architect scalable web solutions.",
                requirements: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
                salary: 45,
                experienceLevel: 3,
                location: "Hyderabad",
                jobType: "Full Time",
                position: 2,
                company: msft._id,
                created_by: recruiter._id,
                applications: [],
                createdAt: new Date(Date.now() - 172800000), // 2 days ago
                updatedAt: new Date()
            },
            {
                _id: "666j33333333333333333333",
                title: "Backend Developer",
                description: "Backend Developer who can write efficient code in backend with Node.js and MongoDB. Experience with JWT auth and microservices is a plus.",
                requirements: ["Node.js", "Express", "MongoDB", "Redis", "JWT"],
                salary: 21,
                experienceLevel: 2,
                location: "Pune",
                jobType: "Part Time",
                position: 3,
                company: msft._id,
                created_by: recruiter._id,
                applications: [],
                createdAt: new Date(Date.now() - 259200000),
                updatedAt: new Date()
            },
            {
                _id: "666j44444444444444444444",
                title: "Data Science Engineer",
                description: "Join our data intelligence team to build ML predictive models and real-time recommendation engines.",
                requirements: ["Python", "Pandas", "Scikit-Learn", "Machine Learning"],
                salary: 28,
                experienceLevel: 2,
                location: "Bangalore",
                jobType: "Full Time",
                position: 2,
                company: google._id,
                created_by: recruiter._id,
                applications: [],
                createdAt: new Date(Date.now() - 345600000),
                updatedAt: new Date()
            },
            {
                _id: "666j55555555555555555555",
                title: "DevOps Engineer",
                description: "Automate cloud infrastructure, manage Kubernetes clusters, and build bullet-proof CI/CD deployment pipelines.",
                requirements: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
                salary: 30,
                experienceLevel: 3,
                location: "Delhi NCR",
                jobType: "Full Time",
                position: 2,
                company: jobHunt._id,
                created_by: recruiter._id,
                applications: [],
                createdAt: new Date(Date.now() - 432000000),
                updatedAt: new Date()
            },
            {
                _id: "666j66666666666666666666",
                title: "Mobile App Developer",
                description: "Build fluid cross-platform mobile apps using React Native with native feel, push notifications, and offline caching.",
                requirements: ["React Native", "TypeScript", "Mobile UI", "REST APIs"],
                salary: 18,
                experienceLevel: 2,
                location: "Mumbai",
                jobType: "Part Time",
                position: 3,
                company: google._id,
                created_by: recruiter._id,
                applications: [],
                createdAt: new Date(Date.now() - 518400000),
                updatedAt: new Date()
            }
        ];

        this.jobs.push(...sampleJobs);

        // Pre-apply student to Microsoft Full Stack job
        const sampleApp = {
            _id: "666a11111111111111111111",
            job: this.jobs[1]._id,
            applicant: student._id,
            status: "accepted",
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date()
        };
        this.applications.push(sampleApp);
        this.jobs[1].applications.push(sampleApp._id);
    }
}

export const mockStore = new MemoryStore();
