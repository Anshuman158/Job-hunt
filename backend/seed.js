import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";

dotenv.config();

const seedData = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobhunt";
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing test data if desired
        await User.deleteMany({ email: { $in: ["patel@gmail.com", "shivani@gmail.com"] } });

        const hashedPassword = await bcrypt.hash("password123", 10);

        // Create recruiter
        const recruiter = await User.create({
            fullname: "Shivani Sharma",
            email: "shivani@gmail.com",
            phoneNumber: 9876543210,
            password: hashedPassword,
            role: "recruiter",
            profile: {
                bio: "Lead Tech Recruiter at Microsoft & Freelance Talent Scout",
                skills: ["Hiring", "Tech Recruiting", "Leadership"]
            }
        });

        // Create student
        const student = await User.create({
            fullname: "Patel Manik",
            email: "patel@gmail.com",
            phoneNumber: 9123456780,
            password: hashedPassword,
            role: "student",
            profile: {
                bio: "Full Stack MERN Developer with 2+ years of experience building modern web apps.",
                skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Next.js"],
                resume: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                resumeOriginalName: "Patel_Manik_Resume.pdf"
            }
        });

        // Create companies
        const msft = await Company.create({
            name: "Microsoft",
            description: "Empowering every person and every organization on the planet to achieve more.",
            website: "https://microsoft.com",
            location: "Hyderabad",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            userId: recruiter._id
        });

        const jobHunt = await Company.create({
            name: "Job Hunt Tech",
            description: "Modern recruitment and talent acceleration platform.",
            website: "https://jobhunt.io",
            location: "Bangalore",
            logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
            userId: recruiter._id
        });

        const google = await Company.create({
            name: "Google Inc",
            description: "Organizing the world's information and making it universally accessible and useful.",
            website: "https://google.com",
            location: "Pune",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            userId: recruiter._id
        });

        // Create sample jobs
        const jobs = [
            {
                title: "Frontend Developer",
                description: "We are seeking a talented Frontend Developer who can craft pixel-perfect, accessible, and high-performance user interfaces using React, Redux, and Tailwind CSS.",
                requirements: ["React", "JavaScript", "Tailwind CSS", "Redux Toolkit", "HTML5/CSS3"],
                salary: 14,
                experienceLevel: 2,
                location: "Hyderabad",
                jobType: "Full Time",
                position: 4,
                company: jobHunt._id,
                created_by: recruiter._id
            },
            {
                title: "Full Stack Developer",
                description: "Build robust backend microservices with Node/Express and dynamic client-side apps with React. Experience with REST APIs, authentication and database modeling is required.",
                requirements: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
                salary: 45,
                experienceLevel: 3,
                location: "Hyderabad",
                jobType: "Full Time",
                position: 2,
                company: msft._id,
                created_by: recruiter._id
            },
            {
                title: "Backend Developer",
                description: "I need a Backend Developer who can write efficient, scalable, and secure backend systems using Node.js, Express, and database query optimizations.",
                requirements: ["Node.js", "Express", "MongoDB", "Redis", "JWT"],
                salary: 21,
                experienceLevel: 2,
                location: "Pune",
                jobType: "Part Time",
                position: 3,
                company: google._id,
                created_by: recruiter._id
            },
            {
                title: "Data Science Engineer",
                description: "Develop predictive machine learning models, statistical analyses, and data pipelines to solve complex business challenges.",
                requirements: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau"],
                salary: 28,
                experienceLevel: 2,
                location: "Bangalore",
                jobType: "Full Time",
                position: 2,
                company: msft._id,
                created_by: recruiter._id
            },
            {
                title: "DevOps & Cloud Specialist",
                description: "Manage CI/CD automation, cloud infrastructure, containerization (Docker, Kubernetes), and cloud security best practices.",
                requirements: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
                salary: 32,
                experienceLevel: 4,
                location: "Delhi NCR",
                jobType: "Full Time",
                position: 2,
                company: jobHunt._id,
                created_by: recruiter._id
            },
            {
                title: "Mobile App Developer (React Native)",
                description: "Deliver smooth cross-platform mobile apps for iOS and Android with sleek native performance and dynamic styling.",
                requirements: ["React Native", "TypeScript", "Mobile UI", "REST APIs"],
                salary: 18,
                experienceLevel: 2,
                location: "Mumbai",
                jobType: "Part Time",
                position: 3,
                company: google._id,
                created_by: recruiter._id
            }
        ];

        await Job.insertMany(jobs);
        console.log("Database seeded successfully with demo users, companies, and jobs!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedData();
