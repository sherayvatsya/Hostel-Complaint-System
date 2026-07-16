import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiBell,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiGrid,
  FiHelpCircle,
  FiImage,
  FiLayers,
  FiLogIn,
  FiMenu,
  FiMessageSquare,
  FiMoon,
  FiPieChart,
  FiPlay,
  FiPlus,
  FiSearch,
  FiShield,
  FiSliders,
  FiStar,
  FiSun,
  FiTrendingUp,
  FiUsers,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

const stats = [
  { label: 'Complaints Resolved', value: 1248, suffix: '+', icon: FiCheckCircle, accent: 'from-cyber-cyan to-primary-500' },
  { label: 'Resolution Rate', value: 96, suffix: '%', icon: FiTrendingUp, accent: 'from-primary-500 to-cyber-violet' },
  { label: 'Average Resolution Time', value: 18, suffix: ' hrs', icon: FiClock, accent: 'from-cyber-violet to-cyber-pink' },
  { label: 'Registered Students', value: 3200, suffix: '+', icon: FiUsers, accent: 'from-primary-500 to-cyber-cyan' },
];

const features = [
  {
    title: 'AI Complaint Categorization',
    description: 'Smart issue triage helps route plumbing, electrical, hygiene, and safety cases instantly.',
    icon: FiCpu,
  },
  {
    title: 'Real-Time Tracking',
    description: 'Students can monitor every stage from submission to resolution without chasing updates.',
    icon: FiActivity,
  },
  {
    title: 'Image Upload',
    description: 'Visual evidence gives wardens and maintenance staff the context they need to act faster.',
    icon: FiImage,
  },
  {
    title: 'Admin Dashboard',
    description: 'Wardens get a single command center for queues, assignments, priorities, and audit history.',
    icon: FiGrid,
  },
  {
    title: 'JWT Authentication',
    description: 'Secure student and admin access keeps sensitive complaint data protected end to end.',
    icon: FiShield,
  },
  {
    title: 'Instant Notifications',
    description: 'Alerts keep residents and staff aligned whenever status, assignment, or comments change.',
    icon: FiBell,
  },
  {
    title: 'Complaint Analytics',
    description: 'Surface trends, response bottlenecks, and recurring hostel issues through actionable reporting.',
    icon: FiBarChart2,
  },
  {
    title: 'Priority Management',
    description: 'Urgent issues are highlighted first so dangerous or disruptive cases never get buried.',
    icon: FiAlertCircle,
  },
];

const timelineSteps = [
  'Register',
  'Submit Complaint',
  'AI Categorization',
  'Warden Review',
  'Staff Assignment',
  'Issue Resolved',
  'Feedback',
];

const benefits = [
  {
    title: 'No More Manual Registers',
    description: 'Move beyond handwritten logs and scattered WhatsApp updates to a trackable, transparent workflow.',
    icon: FiLayers,
  },
  {
    title: 'Faster Campus Operations',
    description: 'Automated triage and assignment reduce back-and-forth and help staff spend time resolving, not sorting.',
    icon: FiZap,
  },
  {
    title: 'Higher Student Trust',
    description: 'Students gain confidence when they can see progress, timelines, and accountability at every stage.',
    icon: FiStar,
  },
];

const testimonials = [
  {
    name: 'Aarav Mehta',
    role: 'Hostel Resident',
    quote: 'I submitted a maintenance issue at night and had a clear status update waiting the next morning. It feels like a real product, not just a college form.',
  },
  {
    name: 'Riya Sharma',
    role: 'Student Council Member',
    quote: 'The dashboard makes complaint trends easy to explain during review meetings. It brings structure and accountability to hostel operations.',
  },
  {
    name: 'Kabir Sethi',
    role: 'Final Year Student',
    quote: 'Uploading images and tracking updates removed the guesswork. The whole flow is much more professional than the usual complaint process.',
  },
];

const faqs = [
  {
    question: 'How does HostelCare improve complaint resolution?',
    answer: 'It centralizes submissions, prioritizes issues, keeps students informed in real time, and gives administrators a clear action queue.',
  },
  {
    question: 'Can students track complaint progress after submission?',
    answer: 'Yes. Each complaint can move through clear statuses so students know whether it is under review, assigned, or resolved.',
  },
  {
    question: 'Is the portal secure for student and admin access?',
    answer: 'The platform uses role-based flows with JWT authentication so student and admin access stays separated and protected.',
  },
  {
    question: 'Why is this better than traditional hostel complaint systems?',
    answer: 'Traditional systems often rely on paper logs or informal messages. HostelCare adds accountability, visibility, analytics, and faster coordination.',
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function MagneticButton({ children, className = '', ...props }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
        setOffset({ x, y });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.4 }}
      className={`inline-block shrink-0 ${className}`}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} {...props}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function CountUpCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [value, setValue] = useState(0);
  const Icon = stat.icon;

  useEffect(() => {
    if (!inView) return;

    const duration = 1400;
    const start = performance.now();

    const frame = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(stat.value * eased));
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    };

    window.requestAnimationFrame(frame);
  }, [inView, stat.value]);

  return (
    <motion.div
      ref={ref}
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.08 }}
      className="glass-card group relative overflow-hidden rounded-[28px] border border-white/15 p-6 shadow-[0_20px_80px_rgba(76,29,149,0.14)]"
    >
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${stat.accent} opacity-80`} />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
      <div className="mb-5 inline-flex rounded-2xl border border-slate-200/70 bg-slate-100/80 p-3 text-slate-700 shadow-sm dark:border-white/15 dark:bg-white/10 dark:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
        {value}
        {stat.suffix}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`mx-auto flex max-w-3xl flex-col gap-4 ${alignment}`}
    >
      <span className="inline-flex items-center rounded-full border border-primary-400/20 bg-primary-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-600 dark:text-primary-300">
        {eyebrow}
      </span>
      <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
        {title}
      </h2>
      <p className="text-sm leading-7 text-slate-700 dark:text-slate-300 md:text-[15px]">{description}</p>
    </motion.div>
  );
}

const LandingPage = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeFaq, setActiveFaq] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const sections = useMemo(() => navLinks.map((link) => link.id), []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: 0.15 }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleSectionScroll = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const primaryCta = user ? (user.role === 'admin' ? '/admin-dashboard' : '/dashboard') : '/login';
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const popOutTransition = {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    mass: 0.8,
  };

  const handleHeroParallax = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    setHeroParallax({ x, y });
  };

  const resetHeroParallax = () => setHeroParallax({ x: 0, y: 0 });

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen overflow-x-hidden bg-radial-gradient-light text-slate-900 dark:bg-radial-gradient-dark dark:text-slate-50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.07)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)] dark:bg-[linear-gradient(rgba(129,140,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.08)_1px,transparent_1px)]" />
      <motion.div
        animate={{ x: [0, 16, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-[-5rem] top-24 h-72 w-72 rounded-full bg-primary-500/20 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -18, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[-3rem] top-48 h-80 w-80 rounded-full bg-cyber-violet/20 blur-[130px]"
      />
      <motion.div
        animate={{ x: [0, 12, 0], y: [0, -14, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-32 left-1/3 h-64 w-64 rounded-full bg-cyber-cyan/20 blur-[120px]"
      />

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <motion.nav
          animate={{
            y: 0,
            backdropFilter: isScrolled ? 'blur(20px)' : 'blur(12px)',
            backgroundColor: darkMode ? (isScrolled ? 'rgba(15,23,42,0.78)' : 'rgba(15,23,42,0.55)') : (isScrolled ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.55)'),
          }}
          className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/20 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
        >
          <button
            type="button"
            onClick={() => handleSectionScroll('home')}
            className="flex items-center gap-3 rounded-full px-3 py-2 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-cyber-violet to-cyber-cyan text-white shadow-neon-indigo">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-[0.22em] text-slate-900 dark:text-white">HOSTELCARE</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Complaint Management System</p>
            </div>
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSectionScroll(link.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeSection === link.id
                    ? 'bg-primary-500 text-white shadow-neon-indigo'
                    : 'text-slate-600 hover:bg-white/10 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-700 transition hover:scale-105 dark:text-slate-100"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <Link to="/login" className="rounded-full px-5 py-3 text-sm font-semibold text-slate-700 transition hover:text-primary-500 dark:text-slate-100">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-primary-500 via-cyber-violet to-cyber-cyan px-5 py-3 text-sm font-semibold text-white shadow-neon-indigo transition hover:scale-[1.02]"
            >
              Sign Up
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-700 dark:text-slate-100"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-700 dark:text-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-3 max-w-7xl rounded-[32px] border border-white/15 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:bg-slate-900/80 lg:hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleSectionScroll(link.id)}
                    className={`rounded-2xl px-4 py-3 text-left text-sm font-medium ${
                      activeSection === link.id
                        ? 'bg-primary-500 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link to="/login" className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-100">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-2xl bg-gradient-to-r from-primary-500 to-cyber-violet px-4 py-3 text-center text-sm font-semibold text-white">
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section
        id="home"
        className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-4 pb-20 pt-36 sm:px-6 sm:pt-44 lg:px-8 lg:pb-28 lg:pt-48"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ x: [0, 16, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[6%] top-12 h-40 w-40 rounded-full bg-primary-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -18, 0], y: [0, 22, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[6%] top-20 h-56 w-56 rounded-full bg-cyber-violet/20 blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -14, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 left-[34%] h-48 w-48 rounded-full bg-cyber-cyan/20 blur-[120px]"
          />
          {[...Array(8)].map((_, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0.2, y: 0 }}
              animate={{ opacity: [0.2, 0.55, 0.2], y: [0, -10, 0] }}
              transition={{ duration: 4 + index, repeat: Infinity, delay: index * 0.25, ease: 'easeInOut' }}
              className="absolute h-2 w-2 rounded-full bg-white/70 shadow-[0_0_16px_rgba(255,255,255,0.4)]"
              style={{
                left: `${10 + index * 10}%`,
                top: `${18 + (index % 4) * 15}%`,
              }}
            />
          ))}
        </div>

        <div className="flex w-full flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-center lg:gap-14 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-white/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-600 shadow-[0_10px_40px_rgba(99,102,241,0.12)] backdrop-blur-xl dark:bg-slate-900/40 dark:text-primary-300"
            >
              <FiZap className="h-4 w-4" />
              Smart Hostel Operations
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.02em] text-slate-950 dark:text-white sm:text-[2.65rem] lg:text-[3.2rem] xl:text-[3.75rem]"
            >
              Manage Hostel Complaints Smarter
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="mt-5 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-200 sm:text-lg"
            >
              HostelCare simplifies complaint registration, real-time tracking, AI-powered categorization, and transparent resolution for modern hostel environments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.03, boxShadow: '0 24px 50px rgba(99,102,241,0.28)' }}
                whileTap={{ scale: 0.97 }}
                transition={popOutTransition}
                className="w-full sm:w-auto"
              >
                <Link
                  to={primaryCta}
                  className="group inline-flex w-full min-w-[190px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 via-cyber-violet to-cyber-cyan px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(99,102,241,0.32)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,102,241,0.45)]"
                >
                  <span>Get Started</span>
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.03, boxShadow: '0 18px 42px rgba(15,23,42,0.13)' }}
                whileTap={{ scale: 0.97 }}
                transition={popOutTransition}
                className="w-full sm:w-auto"
              >
                <button
                  type="button"
                  onClick={() => handleSectionScroll('features')}
                  className="inline-flex w-full min-w-[190px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/55 px-6 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur-xl transition-all duration-300 hover:bg-white/70 hover:shadow-[0_12px_36px_rgba(15,23,42,0.12)] dark:bg-slate-900/45 dark:text-white dark:hover:bg-slate-800/70"
                >
                  <FiPlay className="h-4 w-4" />
                  Live Demo
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {['AI Triage', 'Real-Time Updates', 'Secure Access'].map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ y: -3, scale: 1.03, boxShadow: '0 10px 24px rgba(99,102,241,0.14)' }}
                  transition={popOutTransition}
                  className="rounded-full border border-white/15 bg-white/45 px-4 py-2 text-sm text-slate-600 backdrop-blur-xl dark:bg-slate-900/35 dark:text-slate-300"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleHeroParallax}
            onMouseLeave={resetHeroParallax}
            className="relative mx-auto w-full max-w-[720px] lg:mx-0 lg:max-w-[760px]"
          >
            <motion.div
              animate={{ y: [0, -10, 0], x: heroParallax.x, rotate: heroParallax.x * 0.02 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-6 top-8 hidden h-28 w-28 rounded-full bg-primary-500/20 blur-[90px] xl:block"
            />
            <motion.div
              animate={{ y: [0, -8, 0], x: heroParallax.x * -0.6 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 bottom-12 hidden h-32 w-32 rounded-full bg-cyber-cyan/20 blur-[90px] xl:block"
            />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="glass-card relative isolate z-20 mt-8 overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/85 p-2 shadow-[0_24px_80px_rgba(76,29,149,0.18)] backdrop-blur-2xl dark:border-white/15 dark:bg-slate-950/90 sm:p-4 lg:mt-0"
            >
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-500/10 via-transparent to-cyber-cyan/10" />
              <div className="relative z-10 rounded-[26px] border border-slate-200/70 bg-white/90 p-3 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/15 dark:bg-slate-950 dark:text-white sm:p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="rounded-full bg-slate-100/80 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">Live Dashboard Preview</span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Dashboard</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Monitor and update complaints</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-2 text-xs font-semibold text-primary-600 dark:text-primary-300">
                      <FiPlus className="h-3.5 w-3.5" />
                      File Complaint
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: 'Total Registered', value: '24', accent: 'border-indigo-500' },
                      { label: 'Pending Review', value: '06', accent: 'border-amber-500' },
                      { label: 'Active Repair', value: '04', accent: 'border-purple-500' },
                      { label: 'Resolved', value: '14', accent: 'border-emerald-500' },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 16px 30px rgba(15,23,42,0.18)' }}
                        transition={popOutTransition}
                        className={`rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04] ${item.accent} border-l-4`}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01, boxShadow: '0 16px 30px rgba(15,23,42,0.18)' }}
                      transition={popOutTransition}
                      className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Filter & Search Complaints</h4>
                        <FiSearch className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Search by keywords...</div>
                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">All Categories</div>
                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">All Statuses</div>
                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">All Priorities</div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4, scale: 1.01, boxShadow: '0 16px 30px rgba(15,23,42,0.18)' }}
                      transition={popOutTransition}
                      className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Complaint List</h4>
                        <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary-600 dark:text-primary-300">Live</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          ['Wi-Fi network issue', 'In Progress'],
                          ['Water leakage', 'Pending'],
                          ['Room cleaning request', 'Resolved'],
                        ].map(([title, status]) => (
                          <div key={title} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2.5 dark:border-white/5 dark:bg-black/20">
                            <span className="text-sm text-slate-700 dark:text-slate-200">{title}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{status}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <CountUpCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Platform Features"
          title="Purpose-built tools for faster complaint resolution."
          description="Every section is designed to make the student journey clearer and the admin workflow more efficient, without adding friction."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -10, scale: 1.01 }}
                className="glass-card group relative overflow-hidden rounded-[28px] border border-white/15 p-6 shadow-[0_20px_60px_rgba(99,102,241,0.10)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-cyber-cyan/0 transition duration-300 group-hover:from-primary-500/10 group-hover:via-cyber-violet/5 group-hover:to-cyber-cyan/10" />
                <div className="absolute -right-12 top-0 h-28 w-28 rounded-full bg-primary-500/15 blur-3xl opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 inline-flex rounded-2xl border border-white/15 bg-white/10 p-3 text-primary-500 dark:text-primary-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="relative border-y border-white/10 bg-white/30 py-24 backdrop-blur-xl dark:bg-slate-950/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Workflow"
            title="A structured path from complaint to closure."
            description="HostelCare turns a fragmented process into a visible timeline that students and administrators can both trust."
          />

          <div className="mt-16 grid gap-5 lg:grid-cols-7">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.07 }}
                className="relative"
              >
                <div className="glass-card flex h-full flex-col rounded-[28px] border border-white/15 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.28em] text-primary-500 dark:text-primary-300">
                      Step {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-cyber-cyan" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {index === 0 && 'Create a student account and enter the portal in seconds.'}
                    {index === 1 && 'Describe the issue, add details, and attach evidence where needed.'}
                    {index === 2 && 'Smart categorization suggests type and urgency for quicker action.'}
                    {index === 3 && 'Wardens review context, validate the issue, and approve the next step.'}
                    {index === 4 && 'Maintenance teams receive clear assignments with priority information.'}
                    {index === 5 && 'The issue is handled and marked complete with tracked status history.'}
                    {index === 6 && 'Students can confirm outcomes and share satisfaction feedback.'}
                  </p>
                </div>
                {index < timelineSteps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-gradient-to-r from-primary-500 to-cyber-cyan lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dashboard Preview"
          title="An interface that feels like a real SaaS product."
          description="The preview combines analytics, workload visibility, tracking, and notifications in a layout designed to impress both users and recruiters."
        />

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 rounded-[40px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-white p-4 shadow-[0_35px_100px_rgba(15,23,42,0.16)] dark:border-white/15 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-[0_35px_100px_rgba(15,23,42,0.4)] sm:p-6"
        >
          <div className="rounded-[32px] border border-slate-200/70 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-600 dark:text-primary-300">Admin Workspace</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Complaint Intelligence Overview</h3>
              </div>
              <div className="rounded-full border border-slate-200/80 bg-slate-100/70 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Semester Snapshot
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    ['Total Cases', '1,284'],
                    ['Pending', '112'],
                    ['Resolved Today', '38'],
                    ['Avg SLA', '18 hrs'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="mb-5 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Status Progress</h4>
                      <FiSliders className="h-4 w-4 text-cyber-cyan" />
                    </div>
                    <div className="space-y-4">
                      {[
                        ['Under Review', '68%', 'from-amber-400 to-primary-500'],
                        ['Assigned', '84%', 'from-primary-500 to-cyber-violet'],
                        ['Resolved', '96%', 'from-cyber-cyan to-emerald-400'],
                      ].map(([label, progress, gradient]) => (
                        <div key={label}>
                          <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                            <span>{label}</span>
                            <span>{progress}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: progress }}
                              viewport={{ once: true }}
                              transition={{ duration: 1 }}
                              className={`h-2 rounded-full bg-gradient-to-r ${gradient}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="mb-5 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Complaint Table</h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Updated live</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        ['HC-219', 'Mess hygiene concern', 'High', 'Assigned'],
                        ['HC-224', 'Lift not working', 'Critical', 'In Review'],
                        ['HC-231', 'Bathroom leakage', 'Medium', 'Resolved'],
                      ].map(([id, issue, priority, status]) => (
                        <div key={id} className="grid grid-cols-[0.7fr_1.4fr_0.7fr_0.8fr] gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-3 text-sm text-slate-700 dark:border-white/5 dark:bg-black/20 dark:text-slate-300">
                          <span>{id}</span>
                          <span>{issue}</span>
                          <span>{priority}</span>
                          <span>{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="mb-5 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Resolution Chart</h4>
                    <FiTrendingUp className="h-4 w-4 text-primary-300" />
                  </div>
                  <div className="flex h-56 items-end gap-3">
                    {[28, 40, 36, 48, 58, 76, 68, 82].map((height, index) => (
                      <motion.div
                        key={`${height}-${index}`}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: index * 0.06 }}
                        className="flex-1 rounded-t-3xl bg-gradient-to-t from-primary-500 via-cyber-violet to-cyber-cyan"
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notification Panel</h4>
                    <FiBell className="h-4 w-4 text-cyber-cyan" />
                  </div>
                  <div className="space-y-3">
                    {[
                      'Critical complaint escalated to warden',
                      'Maintenance team accepted assignment',
                      'Student submitted post-resolution feedback',
                      'Weekly hostel analytics report ready',
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-white/5 dark:bg-black/20 dark:text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative border-y border-white/10 bg-white/25 py-24 backdrop-blur-xl dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why HostelCare"
            title="Designed for modern campuses, not outdated complaint registers."
            description="This platform feels more credible, more transparent, and more efficient than the traditional systems students are used to navigating."
          />

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-[32px] border border-white/15 p-8"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-primary-500/20 to-cyber-cyan/20 p-4 text-primary-500 dark:text-primary-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What students appreciate about the experience."
          description="A polished interface matters, but trust is built by clarity, speed, and visible follow-through."
        />

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[0.55fr_1.45fr]">
          <div className="glass-card rounded-[32px] border border-white/15 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-500 dark:text-primary-300">
              Student Sentiment
            </p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-6xl font-black text-slate-900 dark:text-white">4.9</span>
              <span className="pb-2 text-base text-slate-500 dark:text-slate-300">/ 5 average satisfaction</span>
            </div>
            <div className="mt-4 flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <FiStar key={index} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Students respond best when updates are transparent and the workflow feels reliable from the first click.
            </p>
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[testimonialIndex].name}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45 }}
                className="glass-card rounded-[36px] border border-white/15 p-8 md:p-10"
              >
                <div className="mb-6 text-5xl text-primary-400">"</div>
                <p className="max-w-3xl text-xl leading-9 text-slate-700 dark:text-slate-200 md:text-2xl">
                  {testimonials[testimonialIndex].quote}
                </p>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{testimonials[testimonialIndex].name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{testimonials[testimonialIndex].role}</p>
                  </div>
                  <div className="flex gap-2">
                    {testimonials.map((item, index) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setTestimonialIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === testimonialIndex ? 'w-10 bg-primary-500' : 'w-2.5 bg-slate-300 dark:bg-slate-600'
                        }`}
                        aria-label={`Show testimonial from ${item.name}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="faq" className="relative border-y border-white/10 bg-white/30 py-24 backdrop-blur-xl dark:bg-slate-950/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers to the questions recruiters and users will ask."
            description="The goal is not just to look premium, but to communicate what the system does clearly and confidently."
          />

          <div className="mt-16 space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.05 }}
                className="glass-card overflow-hidden rounded-[28px] border border-white/15"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-primary-500/10 p-3 text-primary-500 dark:text-primary-300">
                      <FiHelpCircle className="h-5 w-5" />
                    </div>
                    <span className="text-base font-semibold text-slate-900 dark:text-white md:text-lg">{faq.question}</span>
                  </div>
                  <motion.span animate={{ rotate: activeFaq === index ? 45 : 0 }} className="text-2xl text-primary-500">
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pl-[5.5rem] text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-[40px] border border-slate-200/70 bg-gradient-to-r from-primary-600 via-cyber-violet to-cyber-cyan p-10 text-white shadow-[0_30px_100px_rgba(99,102,241,0.32)] md:p-14"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.22),transparent_30%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Ready to Explore</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
                Bring structured complaint management to your hostel workflow.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/85 md:text-lg">
                Whether you are showcasing the project to recruiters or using it as a campus-ready concept, this homepage now tells the story with clarity and confidence.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <MagneticButton className="w-full sm:w-auto">
                <Link
                  to="/register"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-900"
                >
                  Register Now
                </Link>
              </MagneticButton>
              <MagneticButton className="w-full sm:w-auto">
                <Link
                  to={primaryCta}
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl"
                >
                  Launch Portal
                </Link>
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      <footer id="contact" className="relative border-t border-slate-200/70 bg-white px-4 py-16 text-slate-600 shadow-[0_-24px_80px_rgba(15,23,42,0.06)] sm:px-6 lg:px-8 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-cyber-violet to-cyber-cyan text-white">
                <FiShield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black tracking-[0.22em] text-slate-950 dark:text-white">HOSTELCARE</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hostel Complaint Management System</p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
              A polished complaint management experience designed to make student issues visible, actionable, and easier to resolve at scale.
            </p>
            <p className="mt-6 text-sm font-semibold text-slate-950 dark:text-white">Designed &amp; Developed by Sheray Vatsya</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 dark:text-white">Quick Links</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm">
              {navLinks.map((link) => (
                <button key={link.id} type="button" onClick={() => handleSectionScroll(link.id)} className="text-left text-slate-600 transition hover:text-primary-600 dark:text-slate-400 dark:hover:text-white">
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 dark:text-white">Features</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span>AI Categorization</span>
              <span>Real-Time Tracking</span>
              <span>Admin Dashboard</span>
              <span>Complaint Analytics</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 dark:text-white">Contact</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>Developer: Sheray Vatsya</p>
              <a href="mailto:sherayvatsya@gmail.com" className="block transition hover:text-primary-600 dark:hover:text-white">
                sherayvatsya@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/sheray-vatsya-36770b380"
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-primary-600 dark:hover:text-white"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-slate-200/70 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between dark:border-white/10 dark:text-slate-500">
          <p>Copyright (c) 2026 HostelCare. All rights reserved.</p>
          <p>Designed &amp; Developed by Sheray Vatsya</p>
        </div>
      </footer>
    </motion.main>
  );
};

export default LandingPage;
