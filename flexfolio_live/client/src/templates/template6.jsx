"use client";
import { sendContactMessage, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";

const ProjectCard = ({ p, trackClick }) => {
  const contentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const isOverflowing = el.scrollHeight > 72;
    setShowButton(isOverflowing);

    setHeight(expanded ? `${el.scrollHeight}px` : "72px");
  }, [expanded, p.description]);

  useEffect(() => {
    const handleResize = () => {
      const el = contentRef.current;
      if (!el) return;

      setHeight(expanded ? `${el.scrollHeight}px` : "72px");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded]);

  return (
    <div className="group relative bg-[#0f1117]/80 backdrop-blur-2xl border border-white/5 rounded-2xl p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] flex flex-col overflow-hidden z-10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10">
      <div className="flex justify-between items-start mb-5">
        <div className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-400 group-hover:text-white transition-all duration-500 shrink-0 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        {p.year && (
          <span className="bg-white/5 border border-white/10 text-slate-300 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shrink-0">
            {p.year}
          </span>
        )}
      </div>

      {p.title && (
        <h3 className="font-semibold text-white text-lg sm:text-xl mb-2.5 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-300 transition-all duration-300 line-clamp-1" title={p.title}>
          {p.title}
        </h3>
      )}
      
      {p.description && (
        <div className="flex-1 mb-5 relative">
          <div ref={contentRef} style={{ height }} className="overflow-hidden transition-all duration-500 ease-in-out relative">
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              {p.description}
            </p>
            {!expanded && showButton && (
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0f1117] to-transparent"></div>
            )}
          </div>
          {showButton && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-400 text-[11px] font-semibold mt-2.5 hover:text-blue-300 focus:outline-none flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              {expanded ? "Read Less" : "Read More"}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {p.skills?.map((s, idx) => (
          <span key={idx} className="bg-black/30 border border-white/5 text-slate-300 text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 hover:border-white/20 transition-colors">
            {s}
          </span>
        ))}
      </div>

      <div className="flex gap-2.5 mt-auto pt-4 border-t border-white/5">
        {p.github && (
          <a href={p.github} onClick={() => trackClick(`project_code:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/5 py-2.5 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            Code
          </a>
        )}
        {p.live && (
          <a href={p.live} onClick={() => trackClick(`project_live:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] py-2.5 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all">
            Live App
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default function Template6({ data, owner_key, working }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const hasAbout = !!data?.about;
  const hasExperience = data?.experience?.length > 0;
  const hasProjects = data?.projects?.length > 0;
  const hasSkills = data?.skills?.length > 0;

  const isSingleExperience = data?.experience?.length === 1;
  const aboutExpLayoutClass = (hasAbout && hasExperience && isSingleExperience)
    ? "grid lg:grid-cols-2 gap-6 md:gap-8 py-8 md:py-10"
    : "flex flex-col gap-8 md:gap-12 py-8 md:py-10";

  const navLinks = [
    { id: "#hero", label: "Overview", show: true },
    { id: "#about", label: "About", show: hasAbout },
    { id: "#experience", label: "Experience", show: hasExperience },
    { id: "#projects", label: "Work", show: hasProjects },
    { id: "#skills", label: "Skills", show: hasSkills },
    { id: "#contact", label: "Contact", show: true },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const trackClick = (meta) => {
    if (working) {
      const visitorId = sessionStorage.getItem("visitorId");
      if (!visitorId || !owner_key) return;
      trackAnalyticsEvent({
        portfolioId: owner_key,
        visitorId,
        eventType: "click",
        meta,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (working) {
        await sendContactMessage({
          portfolioId: owner_key,
          ...formData,
        });
        trackClick("contact_form");
      }
      toast.success("Message sent successfully!", {
        style: {
          background: '#1e293b',
          color: '#fff',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '14px'
        },
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message", {
        style: {
          background: '#1e293b',
          color: '#fff',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '14px'
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <div className="bg-[#050505] text-slate-300 font-sans min-h-dvh relative selection:bg-blue-500/30 selection:text-white overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] sm:w-[60vw] h-[80vw] sm:h-[60vw] rounded-full bg-blue-600/10 blur-[100px] sm:blur-[150px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] sm:w-[50vw] h-[70vw] sm:h-[50vw] rounded-full bg-cyan-600/10 blur-[100px] sm:blur-[150px] mix-blend-screen opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025] mix-blend-overlay"></div>
      </div>

      {/* FLOATING NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 sm:py-4" : "py-5 sm:py-6"}`}>
        <div className={`mx-auto flex justify-between items-center transition-all duration-300 ${scrolled ? "max-w-[95%] sm:max-w-4xl px-4 py-2 sm:py-2.5 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-full shadow-lg" : "max-w-7xl px-5 md:px-10"}`}>
          
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => scrollTo("#hero")}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-white group-hover:text-black transition-all duration-300">
              {getInitials(data?.fullName || "F")}
            </div>
            {!scrolled && (
              <div className="hidden sm:block">
                <h1 className="font-semibold text-white tracking-tight text-xs sm:text-sm">
                  {data?.fullName?.toUpperCase() || "PORTFOLIO"}
                </h1>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-0.5 bg-white/[0.02] p-1 rounded-full border border-white/5">
            {navLinks.filter(link => link.show).map((link) => (
              <button
                key={link.id}
                className="text-slate-400 hover:text-white px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest transition-all hover:bg-white/10"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {data?.resume && (
              <a href={data.resume} onClick={() => trackClick("resume")} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all">
                Resume
              </a>
            )}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white border border-white/20 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></> : <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
            <>
           <div
              className="fixed inset-0 h-dvh w-screen bg-black/40  z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            ></div>
          <div className="absolute top-full left-3 right-3 mt-2 bg-[#0f1117]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl flex flex-col items-center py-4 gap-1 z-50 md:hidden overflow-hidden">
            {navLinks.filter(link => link.show).map((link) => (
              <button
                key={link.id}
                className="text-slate-300 font-semibold text-xs uppercase tracking-widest hover:text-white hover:bg-white/5 w-full text-center py-3 transition-colors rounded-lg mx-2"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
          </>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-5 md:px-10 pt-28 sm:pt-32 pb-16 relative z-10">
        
        {/* HERO SECTION */}
        <div id="hero" className="scroll-mt-32 flex flex-col items-center text-center gap-6 sm:gap-8 py-8 md:py-12">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Available for work
          </div>

          <div className="space-y-4 sm:space-y-5 max-w-3xl relative px-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Hi, I'm {data?.fullName?.split(" ")[0]}. <br className="hidden sm:block" />
              {data?.title && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white block sm:inline mt-1 sm:mt-0">
                  {data.title}
                </span>
              )}
            </h1>
            
            {data?.bio && (
              <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto px-4 sm:px-0">
                {data?.bio}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
            {hasProjects && (
              <button onClick={() => scrollTo("#projects")} className="bg-white text-black px-6 py-3 sm:py-3.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                Explore Work
              </button>
            )}
            {data?.email && (
              <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 px-6 py-3 sm:py-3.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2">
                Get in touch
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-5 pt-8 sm:pt-10">
            {data?.linkedin && (
              <a href={data.linkedin} onClick={() => trackClick("linkedin")} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors p-1.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            )}
            {data?.github && (
              <a href={data.github} onClick={() => trackClick("github")} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors p-1.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
            )}
          </div>
        </div>

        {(hasAbout || hasExperience) && <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 sm:my-12 md:my-16"></div>}

        {/* ABOUT & EXPERIENCE (Bento Grid Style) */}
        {(hasAbout || hasExperience) && (
          <div className={aboutExpLayoutClass}>
            
            {hasAbout && (
              <div id="about" className="scroll-mt-28 h-full">
                <div className="bg-[#0f1117]/60 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 sm:p-8 md:p-10 h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -z-10 group-hover:bg-blue-500/15 transition-colors duration-700"></div>
                  
                  <div className="flex items-center gap-3 mb-5 sm:mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">Background</h2>
                  </div>
                  
                  <div className="text-slate-400 leading-relaxed text-sm sm:text-base font-light space-y-4 flex-1">
                    <p>{data?.about}</p>
                  </div>

                  {data?.image?.url && (
                     <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5 flex items-center gap-4">
                        <img src={data.image.url} alt="Profile" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-white/10 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                        <div>
                          <p className="text-white text-sm sm:text-base font-semibold">{data.fullName}</p>
                          <p className="text-slate-500 text-xs sm:text-sm">{data.title}</p>
                        </div>
                     </div>
                  )}
                </div>
              </div>
            )}

            {hasExperience && (
              <div id="experience" className="scroll-mt-28 h-full">
                <div className="bg-[#0f1117]/60 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 sm:p-8 md:p-10 h-full relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -z-10"></div>
                  
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">Experience</h2>
                  </div>

                  <div className="space-y-6 sm:space-y-8 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {data?.experience?.map((exp, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-[#0f1117] text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_3px_rgba(15,17,23,1)] z-10 transition-colors duration-300 group-hover:border-blue-500 group-hover:text-blue-400">
                          {exp.companyLogo ? (
                            <img src={exp.companyLogo} alt={exp.company} className="w-10 h-10 object-contain shrink-0 rounded-full p-1" />
                          ) :(
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                          )}
                          </div>
                        
                        <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2rem)] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-4 sm:p-5 rounded-xl transition-all duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <h3 className="font-semibold text-white text-sm sm:text-base">{exp.role}</h3>
                            {exp.startDate && (
                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-black/40 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                                {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                              </span>
                            )}
                          </div>
                          <p className="text-blue-400 font-medium text-xs sm:text-sm mb-2">{exp.company}</p>
                          {exp.description && (<p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">{exp.description}</p>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS SECTION */}
        {hasProjects && (
          <div id="projects" className="scroll-mt-28 py-8 md:py-12">
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12">
              <span className="text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Portfolio</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Selected Work</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {data?.projects?.map((p, i) => (
                <ProjectCard key={i} p={p} trackClick={trackClick} />
              ))}
            </div>
          </div>
        )}

        {/* TECH STACK SECTION */}
        {hasSkills && (
          <div id="skills" className="scroll-mt-28 py-8 md:py-12 border-y border-white/5 my-6 sm:my-8 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
              <span className="text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Technical Arsenal</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mx-auto px-2">
              {data?.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#0f1117] border border-white/10 text-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:border-white/30 hover:text-white transition-all cursor-default shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:-translate-y-0.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT ME SECTION */}
        <div id="contact" className="scroll-mt-28 py-8 md:py-12">
          <div className="bg-[#0f1117]/80 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent -z-10"></div>
            
            <div className="grid lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-5 border border-white/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tight">Let's Talk</h3>
                  <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">Have a project in mind or just want to say hi? I'd love to hear from you.</p>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {data?.email && (
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Email</p>
                      <a href={`mailto:${data.email}`} className="text-sm sm:text-base text-white hover:text-blue-400 transition-colors break-all">{data.email}</a>
                    </div>
                  )}
                  {data?.phone && (
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</p>
                      <p className="text-sm sm:text-base text-white">{data.phone}</p>
                    </div>
                  )}
                  {data?.location && (
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Location</p>
                      <p className="text-sm sm:text-base text-white">{data.location}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3">
                <form suppressHydrationWarning onSubmit={handleSubmit} className="flex flex-col gap-4 bg-black/20 p-5 sm:p-6 md:p-8 rounded-[1.5rem] border border-white/5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full bg-white/5 border border-white/10 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white font-medium rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full bg-white/5 border border-white/10 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white font-medium rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can I help you?"
                      required
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white font-medium rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[11px] sm:text-xs font-bold uppercase tracking-widest py-3 sm:py-3.5 rounded-lg transition-all mt-2 sm:mt-3 flex items-center justify-center gap-2 sm:gap-3"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505] py-6 sm:py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1 sm:gap-1.5 text-center sm:text-left">
             <p className="text-xs sm:text-sm font-semibold text-white tracking-tight">
               {data?.fullName || "Portfolio"} © {new Date().getFullYear()}
             </p>
             <p className="text-[10px] sm:text-xs text-slate-500 font-light flex items-center justify-center sm:justify-start gap-1">
               Powered by
               <a href="https://flexfolio.online" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors underline decoration-white/20 underline-offset-2 sm:underline-offset-4">
                 Flexfolio
               </a>
             </p>
          </div>
          
          <div className="flex gap-3 sm:gap-4">
            {data?.linkedin && <a href={data.linkedin} onClick={() => trackClick("linkedin")} target="_blank" rel="noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>}
            {data?.github && <a href={data.github} onClick={() => trackClick("github")} target="_blank" rel="noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>}
            {data?.email && <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>}
          </div>
        </div>
      </footer>
    </div>
  );
}