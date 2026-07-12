"use client";
import { sendContactMessage, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";

// --- Spatial Project Card ---
const ProjectCard = ({ p, trackClick }) => {
  const contentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const isOverflowing = el.scrollHeight > 48; // Approx 2 lines
    setShowButton(isOverflowing);
    setHeight(expanded ? `${el.scrollHeight}px` : "48px");
  }, [expanded, p.description]);

  useEffect(() => {
    const handleResize = () => {
      const el = contentRef.current;
      if (!el) return;
      setHeight(expanded ? `${el.scrollHeight}px` : "48px");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded]);

  return (
    <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 rounded-[2rem] transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col overflow-hidden z-10">
      
      <div className="flex justify-between items-start mb-6 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center shrink-0 shadow-inner text-white group-hover:scale-110 transition-transform duration-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        </div>
        {p.year && (
          <span className="bg-white/5 border border-white/10 text-white/60 text-[10px] uppercase font-bold px-3 py-1 rounded-full shrink-0 tracking-widest backdrop-blur-md">
            {p.year}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-white text-xl md:text-2xl mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">
        {p.title}
      </h3>

      {p.description && (
        <div className="mb-6 relative flex-1">
          <div ref={contentRef} style={{ height }} className="overflow-hidden transition-all duration-500 ease-in-out relative">
            <p className="text-white/60 text-sm leading-relaxed font-light">
              {p.description}
            </p>
            {!expanded && showButton && (
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#141521] group-hover:from-[#1b1c2b] to-transparent transition-colors duration-500 rounded-b-[2rem]"></div>
            )}
          </div>
          {showButton && (
            <button
              onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
              className="text-indigo-300 hover:text-indigo-200 text-xs font-medium mt-3 flex items-center gap-1.5 transition-colors"
            >
              {expanded ? "Collapse Details" : "Expand Details"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {p.skills?.map((s, idx) => (
          <span key={idx} className="bg-black/20 border border-white/5 text-white/70 text-[11px] font-medium px-3 py-1.5 rounded-xl shadow-inner backdrop-blur-md">
            {s}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-auto pt-5 border-t border-white/5">
        {p.github && (
          <a href={p.github} onClick={() => trackClick(`project_code:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 py-3 rounded-xl text-xs font-semibold transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            Code
          </a>
        )}
        {p.live && (
          <a href={p.live} onClick={() => trackClick(`project_live:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] py-3 rounded-xl text-xs font-semibold transition-all">
            Live Preview
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        )}
      </div>
    </div>
  );
};

// --- Spatial Certificate Card ---
const CertificateCard = ({ cert, trackClick }) => {
  const certificate_default = "https://res.cloudinary.com/dr38wac7n/image/upload/v1782923183/certificate_default_flexfolio_qhd3eu.png";
  const [imgSrc, setImgSrc] = useState(cert.image?.url || certificate_default);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, [imgSrc]);

  return (
    <div className="group bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] rounded-[2rem] flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-10">
      
      <div className="relative h-52 bg-black/40 overflow-hidden border-b border-white/[0.05] p-6 flex items-center justify-center">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <img
          ref={imgRef}
          src={imgSrc}
          alt={cert.title}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgSrc(certificate_default)}
          className={`w-full h-full ${imgSrc === certificate_default ? "object-cover" : "object-contain object-center"} transition-transform duration-700 ${imgLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"}`}
        />
        
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            onClick={() => trackClick(`certificate:${cert.title}`)}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 rounded-full hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Verify Credential
          </a>
        )}
      </div>
      
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-lg leading-snug mb-3 line-clamp-2">{cert.title}</h3>
        <div className="flex justify-between items-end mt-auto gap-4">
          <p className="text-sm font-light text-white/50 truncate flex-1">{cert.issuer}</p>
          {cert.issueDate && <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest bg-black/30 px-2 py-1 rounded-md">{cert.issueDate}</span>}
        </div>
      </div>
    </div>
  );
};

export default function TemplateSpatial({ data, owner_key, working, system_allow }) {
  const [activeSection, setActiveSection] = useState("#hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasAbout = !!data?.about;
  const hasExperience = data?.experience?.length > 0;
  const hasProjects = data?.projects?.length > 0;
  const hasSkills = data?.skills?.length > 0;
  const hasCertificates = data?.certificates?.length > 0;

  const navLinks = [
    { id: "#hero", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", show: true },
    { id: "#about", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", show: hasAbout },
    { id: "#experience", label: "Experience", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", show: hasExperience },
    { id: "#projects", label: "Work", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", show: hasProjects },
    { id: "#skills", label: "Toolkit", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", show: hasSkills },
    { id: "#certificates", label: "Awards", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", show: hasCertificates },
    { id: "#contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", show: true },
  ];

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.filter(l => l.show).map(l => document.querySelector(l.id));
      const scrollPosition = window.scrollY + 300;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks.filter(l => l.show)[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const trackClick = (meta) => {
    if (working) {
      const visitorId = localStorage.getItem("visitorId");
      const sessionId = sessionStorage.getItem("sessionId");
      if (!visitorId || !sessionId || !owner_key) return;
      trackAnalyticsEvent({ portfolioId: owner_key, visitorId, sessionId, eventType: "click", meta });
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
      toast.success("Message secured and sent.", { 
        style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Transmission failed.", { 
        style: { background: '#450a0a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#09090b] text-white font-sans min-h-dvh relative selection:bg-indigo-500/30 selection:text-white">
      
      {/* Cinematic Abstract Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#09090b]">
        {/* Deep ambient orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/10 blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[100px] mix-blend-screen opacity-40"></div>
        {/* Grain overlay for cinematic texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
      </div>

      {/* SPATIAL DOCK NAVIGATION (Desktop & Mobile Bottom) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 pointer-events-none w-[90%] md:w-auto">
        
        {/* Mobile Dock */}
        <div className="md:hidden flex items-center justify-between bg-white/[0.05] border border-white/10 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white">
            {getInitials(data?.fullName || "A")}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide">
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Desktop Dock */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-3xl p-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] pointer-events-auto">
          {navLinks.filter(l => l.show).map(link => (
            <button 
              key={link.id} 
              onClick={() => scrollTo(link.id)} 
              className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group ${activeSection === link.id ? "bg-white/10 text-white shadow-inner" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={link.icon}></path>
              </svg>
              {/* Tooltip */}
              <span className="absolute -top-10 bg-white text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-90 group-hover:scale-100 duration-200 shadow-xl">
                {link.label}
              </span>
            </button>
          ))}
          {data?.resume?.url && (
            <div className="pl-2 ml-2 border-l border-white/10">
               <a href={data.resume.url} target="_blank" rel="noreferrer" className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 text-white w-12 h-12 rounded-2xl transition-all duration-300 group relative shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 <span className="absolute -top-10 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-90 group-hover:scale-100 duration-200">
                   Resume
                 </span>
               </a>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#09090b]/80 backdrop-blur-3xl flex flex-col items-center justify-center p-6 md:hidden">
           <div className="w-full max-w-sm bg-white/[0.05] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-3 shadow-2xl">
              {navLinks.filter(l => l.show).map(link => (
                <button 
                  key={link.id} 
                  onClick={() => scrollTo(link.id)} 
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeSection === link.id ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={link.icon}></path></svg>
                  <span className="font-semibold">{link.label}</span>
                </button>
              ))}
              {data?.resume?.url && (
                <a href={data.resume.url} target="_blank" rel="noreferrer" className="mt-4 bg-indigo-500 text-white flex items-center justify-center gap-2 p-4 rounded-2xl font-bold uppercase tracking-wider text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Resume
                </a>
              )}
           </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINERS */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-20 pb-40 flex flex-col gap-24 md:gap-32">
        
        {/* HERO */}
        <section id="hero" className="scroll-mt-40 flex flex-col justify-center items-center text-center">
          
          {data?.image?.url && (
            <div className="relative mb-10 group">
              <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-2xl group-hover:bg-indigo-400/40 transition-colors duration-500"></div>
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 p-1.5 rounded-full bg-gradient-to-br from-white/20 to-white/0 backdrop-blur-md">
                 <img src={data.image.url} alt={data.fullName} className="w-full h-full object-cover rounded-full shadow-2xl" />
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 flex items-center gap-2.5 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
              System Online
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/30 tracking-tighter leading-[1.1] mb-6">
            {data?.fullName}
          </h1>
          
          {data?.title && (
            <h2 className="text-xl sm:text-2xl font-light text-indigo-300 tracking-wide mb-8">
              {data.title}
            </h2>
          )}

          {data?.bio && (
            <p className="text-white/60 text-lg sm:text-xl font-light max-w-2xl leading-relaxed mb-12">
              {data.bio}
            </p>
          )}

          <div className="flex gap-4">
             {data?.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all shadow-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>}
             {data?.github && <a href={data.github} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all shadow-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>}
             {data?.email && <a href={`mailto:${data.email}`} className="w-12 h-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all shadow-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>}
          </div>
        </section>

        {/* PROFILE / ABOUT */}
        {hasAbout && (
          <section id="about" className="scroll-mt-32">
             <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-indigo-400"></span> User Profile
                </h2>
                <p className="text-xl sm:text-2xl font-light text-white/80 leading-relaxed max-w-3xl">
                  {data.about}
                </p>
             </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasExperience && (
          <section id="experience" className="scroll-mt-32">
             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 tracking-tight">Professional Timeline</h2>
             
             <div className="space-y-6">
                {data.experience.map((exp, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 sm:gap-8 shadow-xl hover:bg-white/[0.04] transition-colors">
                     
                     <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-2 shadow-inner">
                        {exp.companyLogo ? (
                          <img src={exp.companyLogo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-white font-bold text-xl">{exp.company?.[0]}</span>
                        )}
                     </div>

                     <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                           <div>
                             <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                             <p className="text-indigo-300 font-medium text-sm mt-0.5">{exp.company}</p>
                           </div>
                           {exp.startDate && (
                             <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 whitespace-nowrap">
                               {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                             </span>
                           )}
                        </div>
                        {exp.description && (
                          <p className="text-white/60 font-light text-sm leading-relaxed mt-4">
                            {exp.description}
                          </p>
                        )}
                     </div>

                  </div>
                ))}
             </div>
          </section>
        )}

        {/* PROJECTS */}
        {hasProjects && (
          <section id="projects" className="scroll-mt-32">
             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 tracking-tight">Selected Deployments</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {data.projects.map((p, i) => (
                  <ProjectCard key={i} p={p} trackClick={trackClick} />
                ))}
             </div>
          </section>
        )}

        {/* SKILLS */}
        {hasSkills && (
          <section id="skills" className="scroll-mt-32">
             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 tracking-tight">Technical Matrix</h2>
             <div className="flex flex-wrap gap-3 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-xl">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-sm font-medium text-white/80 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30 transition-all cursor-default shadow-inner">
                    {skill}
                  </span>
                ))}
             </div>
          </section>
        )}

        {/* CERTIFICATES */}
        {hasCertificates && (
          <section id="certificates" className="scroll-mt-32">
             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 tracking-tight">Credentials & Awards</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.certificates.map((cert, i) => (
                  <CertificateCard key={i} cert={cert} trackClick={trackClick} />
                ))}
             </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-32">
           <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-white/10 p-8 md:p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                 
                 <div className="flex flex-col justify-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tighter">Initiate Contact</h2>
                    <p className="text-white/70 font-light text-lg mb-10 max-w-sm">
                      Secure a channel for collaboration, inquiries, or professional networking.
                    </p>
                    
                    <div className="space-y-6">
                      {data?.email && (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-0.5">Direct Email</p>
                            <a href={`mailto:${data.email}`} className="text-white font-medium hover:text-indigo-300 transition-colors break-all">{data.email}</a>
                          </div>
                        </div>
                      )}
                      {data?.location && (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-0.5">Base Location</p>
                            <p className="text-white font-medium">{data.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                 </div>

                 <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-black/40 border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-widest px-1">Name / Alias</label>
                      <input name="name" type="text" value={formData.name} onChange={handleChange} required 
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-widest px-1">Comms Protocol (Email)</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required 
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-white/50 tracking-widest px-1">Transmission Data</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={3} 
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="mt-2 w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50">
                      {loading ? "Transmitting..." : "Send Data"}
                    </button>
                 </form>

              </div>
           </div>
        </section>

      </main>
      
      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md py-8 pb-32 md:pb-8 text-center text-xs font-medium tracking-wide text-white/40">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <p>© {new Date().getFullYear()} {data?.fullName}. All Rights Reserved.</p>
           {(!system_allow?.removeBranding || !system_allow) &&
            <a href="https://flexfolio.online" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Powered by Flexfolio
            </a>
           }
        </div>
      </footer>

    </div>
  );
}