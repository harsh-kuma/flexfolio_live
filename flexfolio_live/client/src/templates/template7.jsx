"use client";
import { sendContactMessage, trackAnalyticsEvent } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const ProjectCard = ({ p, trackClick }) => {
  return (
    <motion.div
      variants={fadeUp}
      className="group flex flex-col md:flex-row gap-5 p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:bg-[#111111] hover:border-white/10 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-white group-hover:text-black transition-all duration-300">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-neutral-100 truncate pr-4">{p.title}</h3>
          {p.year && (
            <span className="text-[10px] font-medium text-neutral-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              {p.year}
            </span>
          )}
        </div>

        {p.description && (
          <p className="text-sm text-neutral-400 leading-relaxed font-light mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {p.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {p.skills?.map((s, idx) => (
            <span key={idx} className="text-[10px] font-medium text-neutral-400 bg-black border border-white/10 px-2 py-1 rounded-md">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
          {p.github && (
            <a href={p.github} onClick={() => trackClick(`project_code:${p.title}`)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              View Source
            </a>
          )}
          {(p.github && p.live) && <span className="w-1 h-1 rounded-full bg-neutral-700"></span>}
          {p.live && (
            <a href={p.live} onClick={() => trackClick(`project_live:${p.title}`)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-semibold text-white hover:text-blue-400 uppercase tracking-wider transition-colors">
              Live Preview
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Template4({ data, owner_key, working ,system_allow}) {
  const [activeSection, setActiveSection] = useState("#hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainRef = useRef(null);

  const hasAbout = !!data?.about;
  const hasExperience = data?.experience?.length > 0;
  const hasProjects = data?.projects?.length > 0;
  const hasSkills = data?.skills?.length > 0;

  const navLinks = [
    { id: "#hero", label: "Overview", show: true, icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
    { id: "#about", label: "About", show: hasAbout, icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
    { id: "#experience", label: "Experience", show: hasExperience, icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
    { id: "#projects", label: "Projects", show: hasProjects, icon: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" },
    { id: "#skills", label: "Tech Stack", show: hasSkills, icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
    { id: "#contact", label: "Contact", show: true, icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" },
  ];

  // Scroll Spy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.filter(l => l.show).map(l => document.querySelector(l.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks.filter(l => l.show)[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const trackClick = (meta) => {
    if (working) {
      const visitorId = localStorage.getItem("visitorId");
      const sessionId = sessionStorage.getItem("sessionId");
      if (!visitorId || !sessionId || !owner_key) return;
      trackAnalyticsEvent({
        portfolioId: owner_key,
        visitorId,
        sessionId,
        eventType: "click",
        meta,
      });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (working) {
        await sendContactMessage({ portfolioId: owner_key, ...formData });
        trackClick("contact_form");
      }
      toast.success("Message delivered.", {
        style: { background: '#111', color: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' },
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message.", {
        style: { background: '#111', color: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-neutral-300 font-sans min-h-dvh flex flex-col md:flex-row selection:bg-white/20 selection:text-white">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
            {getInitials(data?.fullName || "F")}
          </div>
          <span className="font-semibold text-sm text-white">{data?.fullName}</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white outline-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></> : <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-3xl z-40 flex flex-col p-6 overflow-y-auto"
          >
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.filter(l => l.show).map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-colors ${activeSection === link.id ? "bg-white text-black" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={link.icon}></path>
                  </svg>
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-8 flex gap-4 justify-center">
              {data?.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>}
              {data?.github && <a href={data.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>}
              {data?.email && <a href={`mailto:${data.email}`} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[280px] lg:w-[320px] fixed top-0 left-0 h-screen border-r border-white/5 bg-[#050505] overflow-y-auto p-6 lg:p-8 z-40">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 mb-10 mt-4">
          {data?.image?.url ? (
            <img src={data.image.url} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl shadow-lg">
              {getInitials(data?.fullName || "F")}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{data?.fullName}</h1>
            <p className="text-sm text-neutral-400 mt-1 font-medium">{data?.title}</p>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest mt-2 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Open to work
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 px-3">Navigation</p>
          {navLinks.filter(l => l.show).map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 outline-none ${activeSection === link.id ? "bg-white text-black shadow-sm" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeSection === link.id ? "opacity-100" : "opacity-70"}>
                <path d={link.icon}></path>
              </svg>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5 flex gap-3">
          {data?.linkedin && <a href={data.linkedin} onClick={() => trackClick("linkedin")} target="_blank" rel="noreferrer" className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-md transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>}
          {data?.github && <a href={data.github} onClick={() => trackClick("github")} target="_blank" rel="noreferrer" className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-md transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>}
          {data?.email && <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-md transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main ref={mainRef} className="flex-1 md:ml-[280px] lg:ml-[320px] pt-16 md:pt-0 pb-20 md:pb-32 px-5 sm:px-8 lg:px-16 max-w-5xl">
        
        {/* HERO SECTION */}
        <section id="hero" className="scroll-mt-32 pt-16 md:pt-32 pb-16 border-b border-white/5">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="text-neutral-500 font-semibold uppercase tracking-widest text-xs mb-4">
              Dashboard / Overview
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6 max-w-2xl">
              Building robust digital experiences and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">scalable interfaces.</span>
            </motion.h1>
            {data?.bio && (
              <motion.p variants={fadeUp} className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl font-light mb-10">
                {data.bio}
              </motion.p>
            )}
            
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {hasProjects && (
                <button onClick={() => scrollTo("#projects")} className="px-6 py-3 bg-white text-black text-sm font-bold rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-shadow">
                  View Projects
                </button>
              )}
              {data?.resume?.url && (
                <a href={data.resume.url} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/5 text-white border border-white/10 text-sm font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Resume
                </a>
              )}
            </motion.div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        {hasAbout && (
          <section id="about" className="scroll-mt-32 py-16 border-b border-white/5">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> About
              </motion.h2>
              <motion.div variants={fadeUp} className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-2xl">
                <p className="text-neutral-400 text-sm md:text-base leading-loose font-light">
                  {data.about}
                </p>
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {hasExperience && (
          <section id="experience" className="scroll-mt-32 py-16 border-b border-white/5">
             <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span> Experience
              </motion.h2>
              
              <div className="flex flex-col gap-4">
                {data.experience.map((exp, i) => (
                  <motion.div key={i} variants={fadeUp} className="group bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-white/10 hover:bg-[#111111] transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            {exp.companyLogo ? (
                              <img src={exp.companyLogo} alt="logo" className="w-6 h-6 object-contain" />
                            ) : (
                              <span className="text-white font-bold">{exp.company?.[0] || "C"}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{exp.role}</h3>
                            <p className="text-sm font-medium text-neutral-500">{exp.company}</p>
                          </div>
                       </div>
                       {exp.startDate && (
                          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest bg-white/5 px-2.5 py-1.5 rounded border border-white/5 shrink-0">
                            {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                          </div>
                       )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-neutral-400 leading-relaxed font-light ml-0 sm:ml-14">
                        {exp.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {hasProjects && (
          <section id="projects" className="scroll-mt-32 py-16 border-b border-white/5">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span> Projects
              </motion.h2>
              
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((p, i) => (
                  <ProjectCard key={i} p={p} trackClick={trackClick} />
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {hasSkills && (
          <section id="skills" className="scroll-mt-32 py-16 border-b border-white/5">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span> Tech Stack
              </motion.h2>
              
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-[#0a0a0a] border border-white/5 text-neutral-300 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* CONTACT SECTION */}
        <section id="contact" className="scroll-mt-32 py-16">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span> Contact
            </motion.h2>

            <motion.div variants={fadeUp} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-10">
               
               <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Get in touch</h3>
                    <p className="text-sm text-neutral-400 font-light">Fill out the form and I'll get back to you as soon as possible.</p>
                  </div>

                  <div className="space-y-4">
                    {data?.email && (
                      <div className="flex items-center gap-4 text-sm text-neutral-300">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                        <span className="break-all">{data.email}</span>
                      </div>
                    )}
                    {data?.location && (
                      <div className="flex items-center gap-4 text-sm text-neutral-300">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                        <span>{data.location}</span>
                      </div>
                    )}
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Name</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="mt-2 bg-white text-black font-bold text-sm py-3 rounded-lg hover:bg-neutral-200 transition-colors flex justify-center items-center">
                    {loading ? "Sending..." : "Submit"}
                  </button>
               </form>

            </motion.div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <p className="text-xs text-neutral-500 font-medium">© {new Date().getFullYear()} {data?.fullName}. All rights reserved.</p>
          {(!system_allow?.removeBranding || !system_allow) &&
          <a href="https://flexfolio.online" target="_blank" rel="noreferrer" className="text-xs text-neutral-600 hover:text-white transition-colors">Built with Flexfolio</a>
          }
          </footer>

      </main>
    </div>
  );
}