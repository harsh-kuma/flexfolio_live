"use client";
import { sendContactMessage, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";
// Reusable Interactive Project Card
const AnimatedProjectCard = ({ p ,trackClick}) => {
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
    <div className="relative group bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] hover:border-violet-500/50">
      {/* Animated Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        {p.year && (
          <span className="bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.1)]">
            {p.year}
          </span>
        )}
      </div>

      {p.title && (<h3 className="relative z-10 font-bold text-slate-100 text-xl mb-3 group-hover:text-violet-300 transition-colors">{p.title}</h3>)}

      {p.description && (
        <div className="relative z-10 flex-1 mb-6">
          <div ref={contentRef} style={{ height }} className="overflow-hidden transition-all duration-500 ease-in-out">
            <p className="text-slate-400 text-sm leading-relaxed ">
              {p.description}
            </p>
          </div>
          {showButton && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-violet-400 text-xs font-bold mt-3 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              {expanded ? "Show Less" : "Read More"}
              <svg className={`w-3 h-3 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          )}
        </div>
      )}
      <div className="relative z-10 flex gap-2 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
        {p?.skills?.map((s, idx) => (
          <span key={idx} className="bg-slate-950/50 border border-slate-700/50 text-slate-300 text-[11px] font-medium px-3 py-1.5 rounded-xl whitespace-nowrap group-hover:border-violet-500/30 transition-colors">
            {s}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex gap-3 mt-auto pt-4 border-t border-slate-800/50">
        {p?.github && (
          <a href={p.github} onClick={() => trackClick(`project_code:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg">
            Source Code
          </a>
        )}
        {p?.live && (
          <a href={p.live} onClick={() => trackClick(`project_live:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]">
            Live Preview
          </a>
        )}
      </div>
    </div>
  );
};

export default function Template4Animated({ data, owner_key, working }) {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const navLinks = [
    { id: "#hero", label: "Home", show: true },
    { id: "#about", label: "About", show: hasAbout },
    { id: "#experience", label: "Experience", show: hasExperience },
    { id: "#projects", label: "Projects", show: hasProjects },
    { id: "#skills", label: "Skills", show: hasSkills },
    { id: "#contact", label: "Contact", show: true },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  
  // new analytics 
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

      toast("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [menuOpen]);


  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Global Mouse Tracking for Spotlight Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Body scroll lock for mobile menu


  return (
    <div className="relative bg-slate-950 text-slate-300 font-sans min-h-dvh pb-2 selection:bg-violet-500/30 selection:text-violet-200 overflow-hidden">

      {/* --- DYNAMIC MOUSE SPOTLIGHT (Desktop Only) --- */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden lg:block transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.08), transparent 40%)`
        }}
      />

      {/* FLOATING NAVBAR */}
      <nav className="fixed top-6 left-0 right-0 mx-auto w-[90%] md:w-max z-[60] bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-full px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo("#hero")}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:animate-spin-slow">
              {getInitials(data?.fullName || "F")}
            </div>
            <span className="font-bold text-slate-100 hidden md:block group-hover:text-violet-400 transition-colors">
              {data?.fullName?.split(" ")[0].toUpperCase() || "Portfolio"}
            </span>
          </div>

          <div className="hidden md:flex gap-6 text-sm font-semibold">
            {navLinks.filter(link => link.show).map((link) => (
              <button
                key={link.id}
                className="text-slate-400 hover:text-white relative group px-2 py-1 transition-colors"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button - Animated */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-slate-300 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-300 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-300 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* FULL SCREEN MOBILE OVERLAY */}
      <div className={`fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col gap-6 items-center text-center">
          {navLinks.filter(link => link.show).map((link, idx) => (
            <button
              key={link.id}
              className="text-4xl font-extrabold text-slate-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-400 hover:to-fuchsia-400 transition-all transform hover:scale-110 duration-300"
              style={{ transitionDelay: `${idx * 50}ms`, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: menuOpen ? 1 : 0 }}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-40">

        {/* ANIMATED HERO SECTION */}
        <div id="hero" className="scroll-mt-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 min-h-[70vh]">

          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-violet-300 text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.1)] animate-[pulse_3s_infinite]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
              </span>
              Available for work
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              Hi, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 animate-gradient-x">
                {data?.fullName}
              </span>
            </h1>

            {data?.title && (
              <h2 className="text-xl md:text-3xl text-slate-400 font-medium">
                I'm a <span className="text-white border-b-2 border-violet-500">{data.title}</span>
              </h2>
            )}

            {data?.bio && (
              <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed line-clamp-3 mx-auto lg:mx-0" title={data?.bio}>
                {data.bio}
              </p>
            )}


            <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
              {hasProjects &&
                <button
                  onClick={() => scrollTo("#projects")}
                  className="group relative px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">View My Work</span>
                </button>}

              {data?.resume && (
                <a href={data.resume} onClick={() => trackClick("resume")} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 border-2 border-slate-700 text-slate-300 rounded-2xl font-bold hover:bg-slate-800 hover:text-white transition-all hover:border-slate-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download CV
                </a>
              )}
            </div>

            {/* Socials */}
            <div className="flex justify-center lg:justify-start gap-5 pt-6">
              {data?.github && (
                <a href={data.github} onClick={() => trackClick("github")} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </a>
              )}
              {data?.linkedin && (
                <a href={data.linkedin} onClick={() => trackClick("linkedin")} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
              )}
              {data?.email && (
                <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-500 hover:border-rose-400 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
              )}
            </div>
          </div>

          {/* Floarting Hero Image */}
          {data?.image?.url && (
            <div className="relative flex justify-center lg:justify-end w-full lg:w-1/2">
              {/* Pulsing Aura Rings */}
              <div className="absolute inset-0 bg-violet-600 rounded-full blur-[100px] opacity-20 w-[300px] h-[300px] m-auto animate-[pulse_4s_infinite]"></div>
              <div className="absolute inset-0 bg-fuchsia-600 rounded-full blur-[100px] opacity-20 w-[200px] h-[200px] m-auto animate-[pulse_3s_infinite_reverse]"></div>

              <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 rounded-[2rem] overflow-hidden border-2 border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:rotate-2 hover:scale-105 transition-all duration-500 animate-[bounce_6s_infinite]">
                <img
                  src={data?.image?.url}
                  alt={data?.fullName}
                  className="w-full h-full object-cover"
                />
                {/* Glass overlay on image bottom */}
                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
              </div>

              {/* Floating Decals */}
              <div className="absolute -left-10 top-20 w-16 h-16 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 flex items-center justify-center animate-[bounce_5s_infinite_1s]">
                <span className="text-2xl">💻</span>
              </div>
              <div className="absolute -right-5 bottom-10 w-20 h-20 bg-slate-800/80 backdrop-blur-md rounded-full border border-slate-700 flex items-center justify-center animate-[bounce_7s_infinite_0.5s]">
                <span className="text-3xl">🚀</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION DIVIDER */}
        <div className="py-10 flex justify-center">
          <div className="w-1 px-8 py-4 rounded-full bg-slate-800 border border-slate-700 flex flex-col gap-2 shadow-[0_0_15px_rgba(139,92,246,0.2)] animate-bounce">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          </div>
        </div>

        {/* ABOUT */}
        {hasAbout && (
          <div id="about" className="scroll-mt-24 py-10 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              <span className="text-violet-400 font-bold tracking-widest uppercase text-sm border-b-2 border-violet-500/50 pb-1">Discover</span>
              <h2 className="text-4xl md:text-5xl font-black text-white">About Me</h2>
              <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-slate-700 transition-colors">
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                  {data?.about}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE (Interactive Timeline) */}
        {hasExperience && (
          <div id="experience" className="scroll-mt-24 py-10">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-bold tracking-widest uppercase text-sm border-b-2 border-violet-500/50 pb-1">Journey</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-4">Experience</h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {data?.experience?.map((exp, i) => (
                <div key={i}
                  className="group relative flex flex-col md:flex-row gap-6 bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl hover:bg-slate-800/60 hover:border-violet-500/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Left Side: Logo & Dates */}
                  <div className="md:w-1/3 flex flex-row md:flex-col justify-between md:justify-start md:border-r border-slate-800 pr-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 p-2 border border-slate-700 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {exp.companyLogo ? (
                        <img src={exp.companyLogo} alt={exp.company} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-500">{exp.company?.[0] || "C"}</div>
                      )}
                    </div>
                    <div className="">
                      {exp.company && (<h3 className="font-bold text-xl text-slate-100 mb-1 group-hover:text-violet-300 transition-colors mb-2">{exp.company}</h3>)}
                      {exp.startDate && (
                        <span className="text-violet-400 font-mono text-sm bg-violet-500/10 px-3 py-1 rounded-lg w-max border border-violet-500/20">
                          {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Details */}
                  <div className="md:w-2/3 relative z-10">
                    {exp.role && (
                      <h4 className="text-2xl font-black text-white mb-3 flex items-center gap-3">
                        {exp.role}
                        {exp.current && <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></span>}
                      </h4>
                    )}
                    {exp.description && (
                      <p className="text-slate-400 leading-relaxed text-base">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {hasProjects && (
          <div id="projects" className="scroll-mt-24 py-10 relative">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none transform -translate-y-1/2 -z-10"></div>

            <div className="text-center mb-16">
              <span className="text-violet-400 font-bold tracking-widest uppercase text-sm border-b-2 border-violet-500/50 pb-1">Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-4">Featured Work</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.projects?.map((p, i) => (
                <AnimatedProjectCard key={i} p={p} trackClick={trackClick}/>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS (Floating Orbs) */}
        {hasSkills && (
          <div id="skills" className="scroll-mt-24 py-10">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-bold tracking-widest uppercase text-sm border-b-2 border-violet-500/50 pb-1">Expertise</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-4">Tech Arsenal</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
              {data?.skills?.map((skill, i) => (
                <div
                  key={i}
                  className="group relative bg-slate-900 border border-slate-800 text-slate-200 px-8 py-4 rounded-2xl text-lg font-bold cursor-default overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(139,92,246,0.2)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-white transition-colors"></span>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT SECTION */}
        <div id="contact" className="scroll-mt-24 py-10 mb-10 relative">

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-5xl mx-auto relative overflow-hidden">

            {/* Decorative Background inside contact */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="grid lg:grid-cols-2 gap-16 relative z-10">

              {/* Left: Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Let's build something <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">extraordinary.</span></h2>
                  <p className="text-slate-400 text-lg">Whether you have a project in mind or just want to chat, my inbox is open.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white group-hover:scale-110 transition-all shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Email</p>
                      <p className="text-xl font-bold text-slate-200 break-all">{data?.email || "Not Provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Phone</p>
                      <p className="text-xl font-bold text-slate-200">{data?.phone || "Not Provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <form suppressHydrationWarning onSubmit={handleSubmit} className="bg-slate-950/50 p-4 md:p-8 rounded-3xl border border-slate-800/80 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 ">Your Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full mt-2 bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Your Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full mt-2 bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    rows={4}
                    className="w-full mt-2 bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_30px_rgba(139,92,246,0.5)] hover:-translate-y-1">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative border-t border-slate-800 bg-slate-950 pt-10 pb-6 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
              {getInitials(data?.fullName)}
            </div>
            <p className="text-slate-400 font-medium">
              © {new Date().getFullYear()} {data?.fullName}. All rights reserved.
              <a
                href="https://flexfolio.online"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Built with Flexfolio
              </a>
            </p>

          </div>

          <div className="flex gap-4">
            {data?.github && <a href={data.github} onClick={() => trackClick("github")} className="text-slate-500 hover:text-white transition-colors p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>}
            {data?.linkedin && <a href={data.linkedin} onClick={() => trackClick("linkedin")} className="text-slate-500 hover:text-[#0a66c2] transition-colors p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>}
            {data?.email && <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="text-slate-500 hover:text-[#0a66c2] transition-colors p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>}
          </div>
        </div>
      </footer>
    </div>
  );
}