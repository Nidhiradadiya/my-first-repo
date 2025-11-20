// @desc    Get landing page content (About, Features, Stats)
// @route   GET /api/content/landing
// @access  Public
const getLandingContent = async (req, res) => {
    try {
        const content = {
            hero: {
                title: "Transform Your Business Operations",
                subtitle: "Comprehensive ERP solution for modern enterprises",
                description: "Streamline your sales, inventory, manufacturing, and purchasing processes with our powerful, intuitive platform.",
                stats: [
                    { label: "Active Users", value: "10,000+" },
                    { label: "Transactions/Day", value: "50K+" },
                    { label: "Success Rate", value: "99.9%" },
                    { label: "Support Response", value: "<5min" }
                ]
            },
            features: [
                {
                    title: "Sales Management",
                    description: "Track sales, manage invoices, and analyze customer data with powerful analytics tools.",
                    icon: "chart"
                },
                {
                    title: "Inventory Control",
                    description: "Real-time inventory tracking for raw materials and finished products with automated alerts.",
                    icon: "package"
                },
                {
                    title: "Manufacturing Suite",
                    description: "Production planning, resource allocation, and quality control in one integrated system.",

                    icon: "factory"
                },
                {
                    title: "Purchase Orders",
                    description: "Streamline procurement processes with vendor management and purchase tracking.",
                    icon: "shopping"
                },
                {
                    title: "Customer Analytics",
                    description: "Deep insights into customer behavior, sales patterns, and business performance.",
                    icon: "analytics"
                },
                {
                    title: "Real-time Reports",
                    description: "Generate comprehensive reports and dashboards with live data synchronization.",
                    icon: "report"
                }
            ]
        };

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch landing content', error: error.message });
    }
};

// @desc    Get blog posts
// @route   GET /api/content/blog
// @access  Public
const getBlogPosts = async (req, res) => {
    try {
        const posts = [
            {
                id: 1,
                title: "10 Ways ERP Systems Transform Manufacturing",
                excerpt: "Discover how modern ERP solutions are revolutionizing the manufacturing industry with automation and real-time insights.",
                author: "Sarah Johnson",
                date: "2024-11-15",
                category: "Manufacturing",
                image: "/blog/manufacturing.jpg",
                readTime: "5 min read"
            },
            {
                id: 2,
                title: "The Future of Inventory Management",
                excerpt: "AI-powered inventory systems are changing the game. Learn about predictive analytics and smart automation.",
                author: "Michael Chen",
                date: "2024-11-10",
                category: "Technology",
                image: "/blog/inventory.jpg",
                readTime: "7 min read"
            },
            {
                id: 3,
                title: "Customer Analytics: Driving Business Growth",
                excerpt: "Unlock the power of customer data to make informed decisions and boost your revenue.",
                author: "Emma Williams",
                date: "2024-11-05",
                category: "Business Intelligence",
                image: "/blog/analytics.jpg",
                readTime: "6 min read"
            },
            {
                id: 4,
                title: "Streamlining Your Sales Process",
                excerpt: "Best practices for optimizing your sales workflow and increasing conversion rates.",
                author: "David Martinez",
                date: "2024-11-01",
                category: "Sales",
                image: "/blog/sales.jpg",
                readTime: "4 min read"
            }
        ];

        res.json({ data: posts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blog posts', error: error.message });
    }
};

// @desc    Get about page content
// @route   GET /api/content/about
// @access  Public
const getAboutContent = async (req, res) => {
    try {
        const content = {
            mission: {
                title: "Our Mission",
                description: "To empower businesses worldwide with intelligent, user-friendly ERP solutions that drive growth and efficiency."
            },
            story: {
                title: "Our Story",
                content: "Founded in 2020, ERP Pro was born from the vision of making enterprise-level business management accessible to companies of all sizes. Our team of experienced developers and business strategists recognized the gap in the market for an ERP system that combines power with simplicity.",
                milestones: [
                    { year: "2020", event: "Company Founded", description: "Started with a vision to revolutionize ERP systems" },
                    { year: "2021", event: "First 1,000 Users", description: "Rapid adoption across multiple industries" },
                    { year: "2022", event: "Global Expansion", description: "Launched in 15 countries worldwide" },
                    { year: "2024", event: "Industry Leader", description: "Recognized as top ERP solution provider" }
                ]
            },
            team: [
                {
                    name: "Alex Thompson",
                    role: "CEO & Founder",
                    bio: "15+ years in enterprise software development",
                    image: "/team/alex.jpg"
                },
                {
                    name: "Sarah Johnson",
                    role: "CTO",
                    bio: "Former Google engineer, AI specialist",
                    image: "/team/sarah.jpg"
                },
                {
                    name: "Michael Chen",
                    role: "Head of Product",
                    bio: "Expert in UX/UI and product strategy",
                    image: "/team/michael.jpg"
                },
                {
                    name: "Emma Williams",
                    role: "VP of Sales",
                    bio: "20+ years in B2B sales leadership",
                    image: "/team/emma.jpg"
                }
            ],
            values: [
                {
                    title: "Innovation",
                    description: "Constantly pushing boundaries to deliver cutting-edge solutions",
                    icon: "lightbulb"
                },
                {
                    title: "Reliability",
                    description: "Building systems you can trust for mission-critical operations",
                    icon: "shield"
                },
                {
                    title: "Customer-First",
                    description: "Your success is our success - we're here to help you grow",
                    icon: "heart"
                },
                {
                    title: "Transparency",
                    description: "Open communication and honest relationships with all stakeholders",
                    icon: "eye"
                }
            ]
        };

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch about content', error: error.message });
    }
};

// @desc    Submit contact form
// @route   POST /api/content/contact
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, company, message, subject } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required' });
        }

        // In a real application, you would:
        // 1. Save to database
        // 2. Send email notification
        // 3. Integrate with CRM

        // For now, just return success
        res.status(200).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you within 24 hours.',
            data: {
                name,
                email,
                company,
                subject,
                submittedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit contact form', error: error.message });
    }
};

module.exports = {
    getLandingContent,
    getBlogPosts,
    getAboutContent,
    submitContactForm
};
