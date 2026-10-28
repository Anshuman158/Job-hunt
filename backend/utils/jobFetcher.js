// Curated real active tech opportunities with direct official application portals
export const REAL_TECH_JOBS = [
    // --- TOP GLOBAL BIG TECH (MNCs) ---
    {
        _id: "real_job_goog_01",
        title: "Software Engineer, Frontend (React / TypeScript)",
        companyName: "Google",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        location: "Bangalore / Hyderabad / Remote",
        salary: 48,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 4,
        requirements: ["React", "TypeScript", "JavaScript", "Web Performance", "Algorithms"],
        description: "Google is hiring Software Engineers to craft performant web interfaces used by billions. You will architect scalable frontends, optimize critical rendering paths, and collaborate with globally distributed engineering teams.",
        applyUrl: "https://www.google.com/about/careers/applications/jobs/results/",
        isExternal: true,
        source: "Google Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
        _id: "real_job_goog_02",
        title: "Site Reliability Engineer (SRE - Google Cloud Platform)",
        companyName: "Google",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        location: "Bangalore / Pune",
        salary: 52,
        experienceLevel: 4,
        jobType: "Full Time",
        position: 2,
        requirements: ["Linux", "Kubernetes", "Golang", "Python", "Distributed Systems", "Incident Management"],
        description: "Join the GCP SRE organization to build automated self-healing cloud infrastructure, manage hyper-scale production clusters, and drive 99.999% uptime for world-critical services.",
        applyUrl: "https://www.google.com/about/careers/applications/jobs/results/",
        isExternal: true,
        source: "Google Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
    },
    {
        _id: "real_job_msft_01",
        title: "Full Stack Engineer (Azure Cloud & React Platform)",
        companyName: "Microsoft",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        location: "Hyderabad / Noida",
        salary: 42,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 3,
        requirements: ["React", "Node.js", "TypeScript", "Azure", "Distributed Systems"],
        description: "Join the Microsoft Cloud & AI team. You will build enterprise-grade developer experiences across Azure, working with modern JavaScript, cloud microservices, and high-throughput real-time APIs.",
        applyUrl: "https://jobs.careers.microsoft.com/global/en/search",
        isExternal: true,
        source: "Microsoft Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
    },
    {
        _id: "real_job_msft_02",
        title: "Data & Applied Scientist (Generative AI & Copilot)",
        companyName: "Microsoft",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        location: "Bangalore / Hyderabad",
        salary: 55,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 2,
        requirements: ["Python", "PyTorch", "LLMs", "RAG", "NLP", "Azure ML"],
        description: "Contribute to next-gen Microsoft Copilot intelligence. Fine-tune foundation models, implement low-latency retrieval augmented generation (RAG) pipelines, and benchmark reasoning benchmarks.",
        applyUrl: "https://jobs.careers.microsoft.com/global/en/search",
        isExternal: true,
        source: "Microsoft Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8)
    },
    {
        _id: "real_job_amzn_01",
        title: "Software Development Engineer II (SDE-2 AWS Core)",
        companyName: "Amazon",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        location: "Bangalore / Hyderabad",
        salary: 46,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 5,
        requirements: ["Node.js", "Java", "AWS", "NoSQL", "Microservices Architecture"],
        description: "Amazon is looking for an experienced SDE-2 to design and scale distributed backend architectures supporting millions of e-commerce and Prime customers every minute.",
        applyUrl: "https://www.amazon.jobs/en/search",
        isExternal: true,
        source: "Amazon Jobs",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
    },
    {
        _id: "real_job_amzn_02",
        title: "Frontend Engineer (Prime Video & Streaming UI)",
        companyName: "Amazon",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        location: "Chennai / Bangalore",
        salary: 38,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 3,
        requirements: ["React", "TypeScript", "HTML5 Video", "Redux", "Web Performance"],
        description: "Build immersive Prime Video living room and web streaming experiences. Optimize video playback pipelines, client-side caching, and adaptive bitrate UI indicators.",
        applyUrl: "https://www.amazon.jobs/en/search",
        isExternal: true,
        source: "Amazon Jobs",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10)
    },
    {
        _id: "real_job_meta_01",
        title: "Software Engineer (Product Infrastructure & React Core)",
        companyName: "Meta",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        location: "Remote / Global",
        salary: 62,
        experienceLevel: 4,
        jobType: "Full Time",
        position: 2,
        requirements: ["React", "JavaScript", "Relay", "GraphQL", "Web Performance"],
        description: "Meta is recruiting top-tier engineers to work on core UI infrastructure powering Facebook, Instagram, and WhatsApp Web. You will advance modern React compiler patterns, state primitives, and CSS modules at scale.",
        applyUrl: "https://www.metacareers.com/jobs",
        isExternal: true,
        source: "Meta Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
    },
    {
        _id: "real_job_appl_01",
        title: "Software Engineer (Services & Cloud Infrastructure)",
        companyName: "Apple",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        location: "Hyderabad / Bangalore",
        salary: 50,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["Java", "Go", "Cassandra", "Distributed Storage", "Kafka", "REST APIs"],
        description: "Design and implement highly resilient cloud infrastructure powering iCloud, Apple Music, and App Store services for over one billion active Apple devices worldwide.",
        applyUrl: "https://www.apple.com/careers/in/",
        isExternal: true,
        source: "Apple Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14)
    },
    {
        _id: "real_job_nflx_01",
        title: "Senior UI Engineer (Streaming & Studio Web)",
        companyName: "Netflix",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        location: "Remote",
        salary: 65,
        experienceLevel: 4,
        jobType: "Full Time",
        position: 2,
        requirements: ["React", "JavaScript (ESNext)", "CSS Architecture", "Video Streaming UI", "GraphQL"],
        description: "Netflix is looking for an extraordinary UI Engineer to build next-generation video streaming applications, studio tools, and personalized recommendation interfaces.",
        applyUrl: "https://jobs.netflix.com/search",
        isExternal: true,
        source: "Netflix Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16)
    },
    {
        _id: "real_job_uber_01",
        title: "Software Engineer II (Rider & Mobility Services)",
        companyName: "Uber",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
        location: "Hyderabad / Bangalore",
        salary: 45,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 3,
        requirements: ["React", "Node.js", "Kafka", "Microservices", "REST APIs", "Go"],
        description: "Uber is looking for versatile software engineers to engineer mobility and delivery platforms that move millions of people and goods across 70+ countries every day.",
        applyUrl: "https://www.uber.com/us/en/careers/list/",
        isExternal: true,
        source: "Uber Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18)
    },
    {
        _id: "real_job_strp_01",
        title: "Backend Infrastructure Engineer (Payment Core)",
        companyName: "Stripe",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
        location: "Remote / Bangalore",
        salary: 58,
        experienceLevel: 4,
        jobType: "Full Time",
        position: 2,
        requirements: ["Distributed Systems", "Node.js", "Go", "PostgreSQL", "API Security", "Fintech"],
        description: "Stripe powers economic infrastructure for the internet. As a Backend Infrastructure Engineer, you will design highly available payment processors, idempotent APIs, and fraud detection pipelines.",
        applyUrl: "https://stripe.com/jobs/search",
        isExternal: true,
        source: "Stripe Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20)
    },
    {
        _id: "real_job_atls_01",
        title: "Senior Full Stack Developer (Jira Cloud Architecture)",
        companyName: "Atlassian",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/01/Atlassian_logo.svg",
        location: "Bangalore / Remote",
        salary: 44,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["React", "Node.js", "AWS", "GraphQL", "Micro-frontends", "CI/CD"],
        description: "Help scale Jira and Confluence Cloud. You will build extensible React plugin runtimes, streamline collaboration features, and maintain 99.99% availability for enterprise teams.",
        applyUrl: "https://www.atlassian.com/company/careers",
        isExternal: true,
        source: "Atlassian Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22)
    },
    {
        _id: "real_job_adbe_01",
        title: "Computer Scientist (Creative Cloud Web & Canvas Engine)",
        companyName: "Adobe",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
        location: "Noida / Bangalore",
        salary: 40,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 4,
        requirements: ["JavaScript", "WebAssembly", "WebGL", "C++", "React", "Canvas API"],
        description: "Bring Photoshop and Illustrator power to the web browser! You will write high-performance WebAssembly routines, hardware-accelerated WebGL rendering engines, and modular web interfaces.",
        applyUrl: "https://careers.adobe.com/",
        isExternal: true,
        source: "Adobe Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
        _id: "real_job_nvda_01",
        title: "Deep Learning Software Engineer (CUDA & TensorRT)",
        companyName: "NVIDIA",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
        location: "Bangalore / Pune",
        salary: 56,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 2,
        requirements: ["C++", "CUDA", "Python", "TensorRT", "GPU Optimization", "Deep Learning"],
        description: "Push the boundaries of AI acceleration on the world's most advanced GPU clusters. You will optimize inference kernels, benchmark multi-modal LLM models, and accelerate generative AI applications.",
        applyUrl: "https://www.nvidia.com/en-us/about-nvidia/careers/",
        isExternal: true,
        source: "NVIDIA Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26)
    },
    {
        _id: "real_job_crm_01",
        title: "Member of Technical Staff (Core Cloud & Apex Runtime)",
        companyName: "Salesforce",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
        location: "Hyderabad / Bangalore",
        salary: 42,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["Java", "Distributed Cache", "Multi-tenant Architecture", "PostgreSQL", "REST APIs"],
        description: "Join Salesforce Core Platform Engineering. Architect scalable multi-tenant execution runtimes, asynchronous job schedulers, and zero-downtime database schema migration engines.",
        applyUrl: "https://careers.salesforce.com/en/",
        isExternal: true,
        source: "Salesforce Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28)
    },

    // --- TOP INDIAN UNICORNS & HIGH-GROWTH TECH LEADERS ---
    {
        _id: "real_job_swgy_01",
        title: "SDE-2 (Full Stack MERN / React Native)",
        companyName: "Swiggy",
        companyLogo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
        location: "Bangalore",
        salary: 34,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 4,
        requirements: ["React", "Node.js", "Express", "MongoDB", "High Scale Systems", "Redis"],
        description: "Build cutting-edge delivery and quick-commerce features for Swiggy Instamart and Food delivery, processing millions of orders daily with low-latency APIs and resilient web apps.",
        applyUrl: "https://careers.swiggy.com/",
        isExternal: true,
        source: "Swiggy Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
    },
    {
        _id: "real_job_zmto_01",
        title: "Product Engineer (Frontend & Core Web Vitals)",
        companyName: "Zomato",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
        location: "Gurugram / Delhi NCR",
        salary: 32,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 3,
        requirements: ["React", "Next.js", "Tailwind CSS", "Redux", "TypeScript", "Performance Tuning"],
        description: "Drive consumer-facing product innovations across Zomato and Blinkit. You will build silky-smooth customer web experiences, real-time tracking dashboards, and scalable web apps.",
        applyUrl: "https://www.zomato.com/careers",
        isExternal: true,
        source: "Zomato Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7)
    },
    {
        _id: "real_job_flpk_01",
        title: "UI Engineer II (E-Commerce Storefront)",
        companyName: "Flipkart",
        companyLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg",
        location: "Bangalore",
        salary: 30,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 4,
        requirements: ["React", "JavaScript", "State Management", "PWA", "Web Vitals", "SSR"],
        description: "Scale Flipkart's core storefront application to deliver instantaneous page loads during Big Billion Days. Optimize mobile web experiences for over 400 million registered users.",
        applyUrl: "https://www.flipkartcareers.com/",
        isExternal: true,
        source: "Flipkart Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9)
    },
    {
        _id: "real_job_rzrp_01",
        title: "Senior Frontend Engineer (Fintech Developer Platform)",
        companyName: "Razorpay",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
        location: "Bangalore",
        salary: 38,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["React", "JavaScript", "Micro-frontends", "Design Systems", "Web Security"],
        description: "Join Razorpay's merchant checkout and payment platform engineering team. Build accessible, fault-tolerant checkout experiences trusted by over 10 million businesses across India.",
        applyUrl: "https://razorpay.com/jobs/",
        isExternal: true,
        source: "Razorpay Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11)
    },
    {
        _id: "real_job_cred_01",
        title: "Backend Engineer (High-Throughput Ledger Systems)",
        companyName: "CRED",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
        location: "Bangalore",
        salary: 40,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 2,
        requirements: ["Node.js", "Golang", "Kafka", "Redis", "Distributed Databases"],
        description: "Work on CRED's financial services architecture. Handle transaction settlements, reward engines, and real-time ledger pipelines with sub-millisecond latencies.",
        applyUrl: "https://careers.cred.club/",
        isExternal: true,
        source: "CRED Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 13)
    },
    {
        _id: "real_job_zpto_01",
        title: "Senior Backend Developer (Quick-Commerce Logistics Engine)",
        companyName: "Zepto",
        companyLogo: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=128&auto=format&fit=crop&q=80",
        location: "Mumbai / Bangalore",
        salary: 36,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["Go", "Node.js", "PostgreSQL", "Kafka", "Geo-spatial Indexing", "Redis"],
        description: "Power India's fastest 10-minute grocery delivery network. You will engineer order batching algorithms, rider dispatching models, and inventory synchronization across 500+ dark stores.",
        applyUrl: "https://www.zeptonow.com/careers",
        isExternal: true,
        source: "Zepto Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15)
    },
    {
        _id: "real_job_msho_01",
        title: "SDE-3 (Scalable E-Commerce Catalog & Ranking)",
        companyName: "Meesho",
        companyLogo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=128&auto=format&fit=crop&q=80",
        location: "Bangalore",
        salary: 45,
        experienceLevel: 4,
        jobType: "Full Time",
        position: 2,
        requirements: ["Java", "Distributed Systems", "Elasticsearch", "Kafka", "AWS"],
        description: "Architect the next generation of social commerce in India. Enable millions of small businesses and sellers with instantaneous product search, price recommendation, and automated fraud prevention.",
        applyUrl: "https://www.meesho.io/careers",
        isExternal: true,
        source: "Meesho Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 17)
    },
    {
        _id: "real_job_phnp_01",
        title: "Software Engineer (UPI Real-Time Payments Switch)",
        companyName: "PhonePe",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg",
        location: "Bangalore / Pune",
        salary: 38,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 4,
        requirements: ["Java", "Spring Boot", "Kafka", "Aerospike", "High-Throughput Systems"],
        description: "PhonePe processes over 45% of India's UPI transactions. Join our Core Payments Switch team to handle 20,000+ financial transactions per second with strict zero-loss consistency.",
        applyUrl: "https://www.phonepe.com/careers/",
        isExternal: true,
        source: "PhonePe Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19)
    },
    {
        _id: "real_job_payt_01",
        title: "Lead Full Stack Engineer (Merchant QR & Soundbox Cloud)",
        companyName: "Paytm",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
        location: "Noida / Bangalore",
        salary: 35,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["React", "Node.js", "MQTT", "IoT Cloud", "MongoDB", "Redis"],
        description: "Scale Paytm's merchant ecosystem. Build the cloud telemetry and notification dispatch engine communicating with over 8 million IoT Soundbox devices in real-time.",
        applyUrl: "https://paytm.com/careers",
        isExternal: true,
        source: "Paytm Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 21)
    },
    {
        _id: "real_job_zrdh_01",
        title: "Systems Engineer (Kite Trading Engine & Go)",
        companyName: "Zerodha",
        companyLogo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=128&auto=format&fit=crop&q=80",
        location: "Bangalore",
        salary: 42,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 2,
        requirements: ["Golang", "PostgreSQL", "WebSockets", "Linux Internals", "Low Latency Networking"],
        description: "Work on Kite, India's largest retail stock broker platform. You will build minimalist, blazingly fast Go services, optimize WebSocket order feeds, and eliminate external dependencies.",
        applyUrl: "https://zerodha.com/careers",
        isExternal: true,
        source: "Zerodha Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23)
    },
    {
        _id: "real_job_grww_01",
        title: "SDE-2 (Mutual Funds & Stock Trading Backend)",
        companyName: "Groww",
        companyLogo: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=128&auto=format&fit=crop&q=80",
        location: "Bangalore",
        salary: 34,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 3,
        requirements: ["Java", "Spring Boot", "Microservices", "Kafka", "MySQL", "AWS"],
        description: "Groww is democratizing investing for millions of Indians. Build highly compliant, rock-solid order execution and KYC onboarding microservices for stocks, mutual funds, and F&O trading.",
        applyUrl: "https://groww.in/careers",
        isExternal: true,
        source: "Groww Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25)
    },
    {
        _id: "real_job_pstm_01",
        title: "Senior Software Engineer (API Platform & Collaboration)",
        companyName: "Postman",
        companyLogo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80",
        location: "Bangalore / Remote",
        salary: 46,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["Node.js", "React", "TypeScript", "WebSocket", "Distributed Storage", "API Design"],
        description: "Postman is used by over 30 million developers. Design collaborative API workspaces, real-time shared mock servers, and automated API monitoring pipelines.",
        applyUrl: "https://www.postman.com/company/careers/",
        isExternal: true,
        source: "Postman Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27)
    },
    {
        _id: "real_job_bwsk_01",
        title: "Software Engineer (Cloud Device Testing Grid)",
        companyName: "BrowserStack",
        companyLogo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&auto=format&fit=crop&q=80",
        location: "Mumbai / Bangalore / Remote",
        salary: 36,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 3,
        requirements: ["Node.js", "Ruby", "Linux", "Docker", "WebRTC", "Browser Internals"],
        description: "BrowserStack powers instant cross-browser testing for 50,000+ organizations. Build low-latency screen streaming, headless browser automation farms, and automated regression runners.",
        applyUrl: "https://www.browserstack.com/careers",
        isExternal: true,
        source: "BrowserStack Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 29)
    },
    {
        _id: "real_job_zoho_01",
        title: "Senior Product Developer (Cloud SaaS Suite & React)",
        companyName: "Zoho",
        companyLogo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80",
        location: "Chennai / Tenkasi",
        salary: 22,
        experienceLevel: 2,
        jobType: "Full Time",
        position: 5,
        requirements: ["Java", "JavaScript", "React", "MySQL", "Scalable Systems"],
        description: "Zoho builds 50+ enterprise SaaS applications from the ground up. You will work on proprietary database layers, custom collaborative editors, and clean customer-facing interfaces.",
        applyUrl: "https://www.zoho.com/careers/",
        isExternal: true,
        source: "Zoho Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 31)
    },
    {
        _id: "real_job_frsh_01",
        title: "Senior Software Engineer (Freshdesk CRM & Omnichannel)",
        companyName: "Freshworks",
        companyLogo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=128&auto=format&fit=crop&q=80",
        location: "Chennai / Bangalore",
        salary: 32,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["Ruby on Rails", "React", "AWS", "Kafka", "MySQL", "Elasticsearch"],
        description: "Join Freshworks to create software people love. You will build intelligent ticket routing engines, unified AI customer chat inboxes, and enterprise analytics dashboards.",
        applyUrl: "https://www.freshworks.com/company/careers/",
        isExternal: true,
        source: "Freshworks Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 33)
    },

    // --- GLOBAL REMOTE TECH LEADERS ---
    {
        _id: "real_job_gith_01",
        title: "Platform Engineer (Developer Tools & GitHub Actions)",
        companyName: "GitHub",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
        location: "Remote (Global)",
        salary: 54,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 2,
        requirements: ["Ruby", "TypeScript", "Node.js", "Docker", "Git Internals", "Kubernetes"],
        description: "Join GitHub to build the home for all developers. You will scale GitHub Actions, enhance pull request workflows, and build tools trusted by over 100 million software developers.",
        applyUrl: "https://github.com/about/careers",
        isExternal: true,
        source: "GitHub Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 35)
    },
    {
        _id: "real_job_gtlb_01",
        title: "Senior Fullstack Engineer (DevOps & CI/CD Pipelines)",
        companyName: "GitLab",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg",
        location: "Remote (Worldwide)",
        salary: 50,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["Ruby on Rails", "Vue.js", "GraphQL", "PostgreSQL", "Docker"],
        description: "GitLab is 100% remote. You will contribute to our single DevOps platform covering the entire software development lifecycle, from code review to container vulnerability scanning.",
        applyUrl: "https://about.gitlab.com/jobs/",
        isExternal: true,
        source: "GitLab Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 37)
    },
    {
        _id: "real_job_vrcl_01",
        title: "Edge Network Engineer (Next.js Runtime & CDN Infrastructure)",
        companyName: "Vercel",
        companyLogo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80",
        location: "Remote (Worldwide)",
        salary: 58,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 2,
        requirements: ["Rust", "Node.js", "Next.js", "Edge Computing", "HTTP/3", "DNS"],
        description: "Work on Vercel's global Edge Network. You will optimize the Next.js runtime, build serverless middleware caches, and accelerate website deployments to 300+ edge data centers.",
        applyUrl: "https://vercel.com/careers",
        isExternal: true,
        source: "Vercel Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 39)
    },
    {
        _id: "real_job_supa_01",
        title: "Backend Engineer (PostgreSQL Cloud & Realtime WebSockets)",
        companyName: "Supabase",
        companyLogo: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=128&auto=format&fit=crop&q=80",
        location: "Remote (Worldwide)",
        salary: 52,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 2,
        requirements: ["Elixir", "PostgreSQL", "Rust", "WebSockets", "Docker", "Database Replication"],
        description: "Supabase is the open source Firebase alternative. Build real-time database change streams, managed Postgres instance provisioners, and automated disaster recovery tools.",
        applyUrl: "https://supabase.com/careers",
        isExternal: true,
        source: "Supabase Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 41)
    },
    {
        _id: "real_job_cflr_01",
        title: "Systems Engineer (Workers Serverless Runtime & Security)",
        companyName: "Cloudflare",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png",
        location: "Bangalore / Remote",
        salary: 50,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 3,
        requirements: ["Rust", "C++", "V8 Engine", "Networking Protocols", "DDoS Mitigation"],
        description: "Join Cloudflare to help build a better Internet. Develop our V8-isolate serverless engine, mitigate volumetric DDoS attacks, and protect millions of internet properties.",
        applyUrl: "https://www.cloudflare.com/careers/",
        isExternal: true,
        source: "Cloudflare Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 43)
    },

    // --- ENTERPRISE TECH GIANTS & CONSULTING ---
    {
        _id: "real_job_tcs_01",
        title: "Digital System Architect (Cloud Migration & Microservices)",
        companyName: "Tata Consultancy Services (TCS)",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
        location: "Mumbai / Bangalore / Pune",
        salary: 24,
        experienceLevel: 4,
        jobType: "Full Time",
        position: 6,
        requirements: ["Java", "Spring Boot", "AWS / Azure", "Kubernetes", "Microservices", "Kafka"],
        description: "Lead enterprise modernization for Fortune 500 financial and healthcare institutions. Transform monolithic core architectures into resilient cloud-native containerized microservices.",
        applyUrl: "https://www.tcs.com/careers",
        isExternal: true,
        source: "TCS Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 45)
    },
    {
        _id: "real_job_infy_01",
        title: "Senior Specialist Programmer (Full Stack MERN & Python)",
        companyName: "Infosys",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
        location: "Bangalore / Hyderabad / Pune",
        salary: 22,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 5,
        requirements: ["React", "Node.js", "Python", "MongoDB", "PostgreSQL", "Docker"],
        description: "As an Infosys Specialist Programmer, work on high-impact digital engineering labs, architecting full stack applications with clean separation of concerns and end-to-end automation.",
        applyUrl: "https://www.infosys.com/careers.html",
        isExternal: true,
        source: "Infosys Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 47)
    },
    {
        _id: "real_job_wipro_01",
        title: "Cloud & DevOps Consultant (AWS / Azure Kubernetes)",
        companyName: "Wipro",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
        location: "Hyderabad / Bangalore",
        salary: 20,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 4,
        requirements: ["Terraform", "Kubernetes", "AWS", "Azure DevOps", "CI/CD", "Prometheus"],
        description: "Architect Infrastructure as Code (IaC) pipelines and GitOps continuous delivery workflows for global banking and telecom clients.",
        applyUrl: "https://careers.wipro.com/",
        isExternal: true,
        source: "Wipro Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 49)
    },
    {
        _id: "real_job_accn_01",
        title: "Application Lead (Modern Web Architectures & React)",
        companyName: "Accenture",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        location: "Bangalore / Gurgaon / Pune",
        salary: 26,
        experienceLevel: 3,
        jobType: "Full Time",
        position: 4,
        requirements: ["React", "Next.js", "TypeScript", "Micro-frontends", "Node.js", "Cloud APIs"],
        description: "Join Accenture Technology to build human-centric digital experiences for multinational clients across retail, media, and autonomous vehicles.",
        applyUrl: "https://www.accenture.com/in-en/careers",
        isExternal: true,
        source: "Accenture Careers",
        applications: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 51)
    }
];

// Clean HTML tags from job descriptions
const sanitizeHtml = (html) => {
    if (!html) return "";
    return html
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
};

// Derive salary in LPA if missing
const estimateSalary = (title, index) => {
    const t = (title || "").toLowerCase();
    if (t.includes("lead") || t.includes("staff") || t.includes("principal") || t.includes("architect") || t.includes("director") || t.includes("head")) {
        return 42 + (index % 18);
    }
    if (t.includes("senior") || t.includes("sr") || t.includes("iii") || t.includes("ii") || t.includes("specialist")) {
        return 30 + (index % 12);
    }
    if (t.includes("intern") || t.includes("student") || t.includes("trainee") || t.includes("junior")) {
        return 12 + (index % 6);
    }
    return 20 + (index % 15);
};

// Derive experience level (years)
const estimateExp = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("lead") || t.includes("staff") || t.includes("architect") || t.includes("principal")) return 5;
    if (t.includes("senior") || t.includes("sr")) return 3;
    if (t.includes("junior") || t.includes("intern") || t.includes("student")) return 0;
    return 2;
};

// Asynchronously fetches fresh live tech jobs from Arbeitnow and Remotive public APIs
export const fetchLiveRemoteJobs = async () => {
    const allFetchedJobs = [];

    // 1. Fetch from Arbeitnow (returns 300+ live jobs with direct URLs)
    try {
        const response = await fetch("https://www.arbeitnow.com/api/job-board-api", {
            headers: { "Accept": "application/json" }
        });
        if (response.ok) {
            const data = await response.json();
            const rawList = data.data || [];
            
            // Filter for tech / developer / engineering / data roles
            const techList = rawList.filter(j => {
                const text = (j.title + " " + (j.tags || []).join(" ")).toLowerCase();
                return /developer|engineer|software|frontend|backend|fullstack|devops|data|cloud|architect|ui|ux|python|react|node|javascript|typescript|product|qa|security/i.test(text);
            });

            const mappedArbeitnow = techList.slice(0, 80).map((j, idx) => {
                const cleanDesc = sanitizeHtml(j.description);
                const salaryLpa = estimateSalary(j.title, idx);
                const logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(j.company_name || 'Tech')}&background=6366f1&color=fff&size=128&bold=true`;
                
                return {
                    _id: `arbeit_${j.slug || idx}_${Date.now()}`,
                    title: j.title,
                    companyName: j.company_name,
                    companyLogo: logo,
                    location: j.location ? `${j.location}${j.remote ? ' (Remote Available)' : ''}` : (j.remote ? "Remote (Global)" : "Remote / Worldwide"),
                    salary: salaryLpa,
                    experienceLevel: estimateExp(j.title),
                    jobType: j.job_types && j.job_types.length > 0 ? (j.job_types[0] === 'full_time' ? 'Full Time' : j.job_types[0]) : "Full Time",
                    position: 1 + (idx % 4),
                    requirements: j.tags && j.tags.length > 0 ? j.tags.slice(0, 5) : ["Software Engineering", "Problem Solving", "Modern Tech Stack"],
                    description: cleanDesc ? cleanDesc.slice(0, 420) + "..." : "Exciting software engineering role with rapid growth opportunities.",
                    applyUrl: j.url,
                    isExternal: true,
                    source: "Arbeitnow Live Feed",
                    applications: [],
                    createdAt: new Date(j.created_at ? j.created_at * 1000 : Date.now() - (idx * 3600000))
                };
            });

            allFetchedJobs.push(...mappedArbeitnow);
        }
    } catch (err) {
        console.warn("Arbeitnow feed error:", err.message);
    }

    // 2. Fetch from Remotive API (active remote developer listings)
    try {
        const response = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=40", {
            headers: { "Accept": "application/json" }
        });
        if (response.ok) {
            const data = await response.json();
            const liveJobs = (data.jobs || []).map((j, idx) => {
                const cleanDesc = sanitizeHtml(j.description);
                return {
                    _id: `remotive_${j.id || idx}`,
                    title: j.title,
                    companyName: j.company_name,
                    companyLogo: j.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(j.company_name || 'Tech')}&background=7c3aed&color=fff&size=128&bold=true`,
                    location: j.candidate_required_location || "Remote Worldwide",
                    salary: j.salary ? (parseFloat(j.salary.replace(/[^0-9.]/g, '')) || 32) : estimateSalary(j.title, idx),
                    experienceLevel: estimateExp(j.title),
                    jobType: j.job_type === "full_time" ? "Full Time" : "Contract",
                    position: 2,
                    requirements: j.tags && j.tags.length > 0 ? j.tags.slice(0, 5) : ["Software Engineering", "Full Stack", "APIs", "Remote"],
                    description: cleanDesc ? cleanDesc.slice(0, 420) + "..." : "Exciting remote engineering role with flexible hours and competitive compensation.",
                    applyUrl: j.url,
                    isExternal: true,
                    source: "Remotive Live Feed",
                    applications: [],
                    createdAt: new Date(j.publication_date || Date.now())
                };
            });

            allFetchedJobs.push(...liveJobs);
        }
    } catch (err) {
        console.warn("Remotive feed error:", err.message);
    }

    return allFetchedJobs;
};
