import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiShield, FiClock, FiActivity, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Navbar from '../components/common/Navbar';

const LandingPage = () => {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  // GSAP animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );
      
      gsap.fromTo(
        '.floating-card',
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.2, ease: 'back.out(1.5)', delay: 0.5 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: 'Avg Resolution Time', val: '< 24 Hours', icon: <FiClock className="text-cyber-cyan w-6 h-6" /> },
    { label: 'Successful Resolves', val: '98%', icon: <FiCheckCircle className="text-cyber-green w-6 h-6" /> },
    { label: 'Student Satisfaction', val: '4.8/5.0', icon: <FiZap className="text-cyber-amber w-6 h-6" /> }
  ];

  const steps = [
    { num: '01', title: 'File Quick Complaint', desc: 'Login, select category, upload snapshots, and submit description.' },
    { num: '02', title: 'AI Categorizer Triage', desc: 'Our smart heuristic models suggest priority and auto-draft summary tags.' },
    { num: '03', title: 'Warden Inspection', desc: 'Chief Warden accepts complaint and assigns local plumbers or electricians.' },
    { num: '04', title: 'Live Update Tracker', desc: 'Get notified in real-time on status transitions up to resolution.' }
  ];

  return (
    <div ref={heroRef} className="min-h-screen bg-radial-gradient-light dark:bg-radial-gradient-dark text-slate-800 dark:text-slate-100 overflow-x-hidden">
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-24 left-1/4 w-80 h-80 rounded-full bg-primary-500/10 dark:bg-primary-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-44 right-1/4 w-[500px] h-[500px] rounded-full bg-cyber-violet/10 dark:bg-cyber-violet/20 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div ref={titleRef} className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 dark:text-primary-400 font-bold text-xs uppercase tracking-widest">
            <FiActivity className="animate-pulse" /> Advanced Complaint Desk
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Streamlining Hostel Complaints With{' '}
            <span className="bg-gradient-to-r from-primary-500 via-cyber-violet to-cyber-pink bg-clip-text text-transparent">
              Glassmorphism UI
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            A comprehensive, production-ready solution empowering students to lodge complaints, track progress in real-time, and admins to manage issues seamlessly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <Link to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="btn-neon-primary px-8 py-3.5 text-base">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-neon-primary px-8 py-3.5 text-base">
                  Get Started
                </Link>
                <Link to="/login" className="btn-glass px-8 py-3.5 text-base">
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -8 }}
              className="floating-card glass-card rounded-2xl p-6 flex items-center gap-5 border border-slate-200/40 dark:border-slate-800/80 text-left"
            >
              <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/10 shadow-inner">
                {s.icon}
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{s.val}</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Timeline Section */}
      <section className="py-20 bg-slate-500/5 border-y border-slate-200/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How It Works</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Follow our simple, high-speed resolution flow to get broken amenities repaired.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <motion.div
                key={st.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="glass-card rounded-2xl p-6 border border-slate-200/20 dark:border-slate-800/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 text-8xl font-black text-slate-500/[0.04] dark:text-white/[0.02]">
                  {st.num}
                </div>
                <span className="text-xs font-black text-primary-500 px-2.5 py-1 rounded-md bg-primary-500/10 border border-primary-500/20 uppercase tracking-widest">
                  Step {st.num}
                </span>
                <h3 className="text-lg font-bold mt-4 mb-2 text-slate-800 dark:text-white">{st.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {st.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Callout */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <div className="glass-card rounded-3xl p-10 border border-primary-500/20 shadow-neon-indigo space-y-6">
          <FiShield className="mx-auto w-12 h-12 text-primary-500 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            Secure, Managed & Responsive
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Authorized by JWT verification keys and equipped with instant notifications. Admin dashboards track resolutions to ensure standard student lifestyle care.
          </p>
          <div className="pt-2">
            <Link to="/register" className="btn-neon-primary px-8 py-3.5">
              Launch Complaints Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/10">
        <p>© 2026 Hostel Complaint Management Portal. Designed under senior UI/UX guidelines.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
