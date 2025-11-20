'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Package,
  Factory,
  ShoppingCart,
  TrendingUp,
  Users,
  Mail,
  Phone,
  MapPin,
  Send,
  Calendar,
  Clock,
  ChevronRight,
  Zap,
  Shield,
  Heart,
  Eye,
  Lightbulb,
  FileText,
  Check
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import api from '@/utils/api';

// 3D Animated Sphere Component
function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere args={[1, 100, 200]} scale={2.5} ref={meshRef}>
      <MeshDistortMaterial
        color="#D97706"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

// Floating particles background
function FloatingParticles() {
  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#F59E0B" sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [landingData, setLandingData] = useState({
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
  });

  const [blogPosts, setBlogPosts] = useState([
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
  ]);

  const [aboutData, setAboutData] = useState({
    mission: {
      title: "Our Mission",
      description: "To empower businesses worldwide with intelligent, user-friendly ERP solutions that drive growth and efficiency."
    },
    story: {
      title: "Our Story",
      content: "Founded in 2020, ERP Pro was born from the vision of making enterprise-level business management accessible to companies of all sizes.",
      milestones: [
        { year: "2020", event: "Company Founded", description: "Started with a vision to revolutionize ERP systems" },
        { year: "2021", event: "First 1,000 Users", description: "Rapid adoption across multiple industries" },
        { year: "2022", event: "Global Expansion", description: "Launched in 15 countries worldwide" },
        { year: "2024", event: "Industry Leader", description: "Recognized as top ERP solution provider" }
      ]
    },
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
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const router = useRouter();

  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const blogRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true });
  const blogInView = useInView(blogRef, { once: true });
  const aboutInView = useInView(aboutRef, { once: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsLoading(false);

    // Fetch content (but keep dummy data as fallback)
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [landing, blog, about] = await Promise.all([
        api.get('/content/landing').catch(() => null),
        api.get('/content/blog').catch(() => null),
        api.get('/content/about').catch(() => null)
      ]);

      // Only update if we get VALID data from API
      if (landing?.data?.features?.length > 0) {
        console.log('Using API landing data');
        setLandingData(landing.data);
      }

      if (blog?.data?.data?.length > 0) {
        console.log('Using API blog data');
        setBlogPosts(blog.data.data);
      }

      if (about?.data?.mission) {
        console.log('Using API about data');
        setAboutData(about.data);
      }
    } catch (error) {
      console.error('Failed to fetch content, using default data:', error);
      // Keep the dummy data already set in state
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      await api.post('/content/contact', contactForm);
      setFormStatus('success');
      setContactForm({ name: '', email: '', company: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-900 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-900" size={24} />
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="bg-amber-50 min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-amber-50/90 backdrop-blur-xl border-b border-amber-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl font-serif font-bold text-amber-50">E</span>
              </div>
              <span className="text-xl font-serif font-light text-amber-950">
                ERP Pro
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-amber-800 hover:text-amber-950 transition-colors font-light">Features</a>
              <a href="#about" className="text-amber-800 hover:text-amber-950 transition-colors font-light">About</a>
              <a href="#blog" className="text-amber-800 hover:text-amber-950 transition-colors font-light">Blog</a>
              <a href="#contact" className="text-amber-800 hover:text-amber-950 transition-colors font-light">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-lg font-light transition-all hover:scale-105"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <AnimatedSphere />
              <FloatingParticles />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-amber-50/90 to-amber-50 z-10"></div>

        {/* Content */}
        <motion.div
          className="relative z-20 max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-200 rounded-full text-amber-900 text-sm font-light mb-8"
            >
              <Sparkles size={16} />
              <span>The Future of Business Management</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-serif font-light mb-6 leading-tight text-amber-950">
              {landingData?.hero.title || "Transform Your Business"}
            </h1>

            <p className="text-xl md:text-2xl text-amber-800/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              {landingData?.hero.description || "Streamline operations with our intelligent ERP platform"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="group px-8 py-4 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-lg font-light text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-stone-100 hover:bg-stone-200 text-amber-950 rounded-lg font-light text-lg transition-all border border-stone-200"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          {landingData?.hero.stats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24"
            >
              {landingData.hero.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-6 bg-stone-50 backdrop-blur-xl rounded-xl border border-stone-200/50"
                >
                  <div className="text-4xl font-serif font-light text-amber-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-stone-600 text-sm font-light">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-amber-800 rounded-full p-1"
          >
            <motion.div className="w-1.5 h-3 bg-amber-900 rounded-full mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-light mb-6 text-amber-950">
              Powerful Features
            </h2>
            <p className="text-xl text-amber-800/70 max-w-2xl mx-auto font-light">
              Everything you need to run your business efficiently in one platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landingData?.features.map((feature, index) => {
              const icons = {
                chart: BarChart3,
                package: Package,
                factory: Factory,
                shopping: ShoppingCart,
                analytics: TrendingUp,
                report: Users
              };
              const Icon = icons[feature.icon] || Zap;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 bg-stone-50 rounded-xl border border-stone-200/50 hover:border-amber-200 transition-all hover:scale-105"
                >
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="text-amber-800" size={28} />
                  </div>
                  <h3 className="text-2xl font-serif font-light text-amber-950 mb-4">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed font-light">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-light mb-6 text-amber-950">
              About ERP Pro
            </h2>
            <p className="text-xl text-amber-800/70 max-w-3xl mx-auto font-light">
              {aboutData?.mission.description || "Empowering businesses worldwide"}
            </p>
          </motion.div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {aboutData?.values.map((value, index) => {
              const icons = {
                lightbulb: Lightbulb,
                shield: Shield,
                heart: Heart,
                eye: Eye
              };
              const Icon = icons[value.icon] || Sparkles;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-xl border border-stone-200/50 text-center"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-amber-800" size={20} />
                  </div>
                  <h3 className="text-xl font-serif font-light text-amber-950 mb-2">{value.title}</h3>
                  <p className="text-stone-600 text-sm font-light">{value.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Timeline */}
          {aboutData?.story.milestones && (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-serif font-light text-amber-950 mb-12 text-center">Our Journey</h3>
              <div className="space-y-8">
                {aboutData.story.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-2xl font-serif font-light text-amber-800">{milestone.year}</span>
                    </div>
                    <div className="relative flex-shrink-0">
                      <div className="w-4 h-4 bg-amber-800 rounded-full"></div>
                      {index < aboutData.story.milestones.length - 1 && (
                        <div className="absolute top-4 left-1/2 w-0.5 h-full bg-amber-200 -translate-x-1/2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="text-xl font-serif font-light text-amber-950 mb-2">{milestone.event}</h4>
                      <p className="text-stone-600 font-light">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-light mb-6 text-amber-950">
              Latest Insights
            </h2>
            <p className="text-xl text-amber-800/70 font-light">
              Stay updated with industry trends and best practices
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-stone-50 rounded-xl border border-stone-200/50 overflow-hidden hover:border-amber-200 transition-all hover:scale-105"
              >
                <div className="h-48 bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-amber-50/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 font-light">
                    <Calendar size={12} />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-serif font-light text-amber-950 mb-2 group-hover:text-amber-800 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2 font-light">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-800 font-light">{post.category}</span>
                    <ChevronRight className="text-stone-500 group-hover:text-amber-800 group-hover:translate-x-1 transition-all" size={16} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif font-light mb-6 text-amber-950">
              Get In Touch
            </h2>
            <p className="text-xl text-amber-800/70 font-light">
              Have questions? We'd love to hear from you
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-amber-800" size={20} />
                </div>
                <div>
                  <h3 className="text-amber-950 font-serif font-light mb-1">Email</h3>
                  <p className="text-stone-600 font-light">contact@erppro.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-amber-800" size={20} />
                </div>
                <div>
                  <h3 className="text-amber-950 font-serif font-light mb-1">Phone</h3>
                  <p className="text-stone-600 font-light">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-amber-800" size={20} />
                </div>
                <div>
                  <h3 className="text-amber-950 font-serif font-light mb-1">Address</h3>
                  <p className="text-stone-600 font-light">123 Business Ave, Tech City, TC 12345</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="px-4 py-3 bg-white border border-stone-200 rounded-lg text-amber-950 placeholder-stone-400 focus:outline-none focus:border-amber-300 transition-colors font-light"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="px-4 py-3 bg-white border border-stone-200 rounded-lg text-amber-950 placeholder-stone-400 focus:outline-none focus:border-amber-300 transition-colors font-light"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Company (Optional)"
                value={contactForm.company}
                onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-amber-950 placeholder-stone-400 focus:outline-none focus:border-amber-300 transition-colors font-light"
              />

              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-amber-950 placeholder-stone-400 focus:outline-none focus:border-amber-300 transition-colors font-light"
              />

              <textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-amber-950 placeholder-stone-400 focus:outline-none focus:border-amber-300 transition-colors resize-none font-light"
                required
              />

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full px-8 py-4 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-lg font-light transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>

              {formStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-center font-light flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              {formStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-center font-light"
                >
                  Failed to send message. Please try again.
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-serif font-bold text-amber-50">E</span>
                </div>
                <span className="text-xl font-serif font-light text-amber-950">ERP Pro</span>
              </div>
              <p className="text-stone-600 text-sm font-light">
                Transforming businesses with intelligent ERP solutions.
              </p>
            </div>

            <div>
              <h4 className="text-amber-950 font-serif font-light mb-4">Product</h4>
              <ul className="space-y-2 text-stone-600 text-sm font-light">
                <li><a href="#features" className="hover:text-amber-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-amber-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-900 transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-amber-950 font-serif font-light mb-4">Company</h4>
              <ul className="space-y-2 text-stone-600 text-sm font-light">
                <li><a href="#about" className="hover:text-amber-900 transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-amber-900 transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-amber-900 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-amber-950 font-serif font-light mb-4">Legal</h4>
              <ul className="space-y-2 text-stone-600 text-sm font-light">
                <li><a href="#" className="hover:text-amber-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-900 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-200 text-center text-stone-500 text-sm font-light">
            © 2024 ERP Pro System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
