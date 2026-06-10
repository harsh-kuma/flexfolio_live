"use client";
import { sendContactMessage, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";

// Separate component to handle individual project state (View More / View Less)
const ProjectCard = ({ p , trackClick}) => {
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
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-shadow flex flex-col group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        {p.year && (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
            {p.year}
          </span>
        )}
      </div>

      {p.title && (<h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1" title={p.title}>{p.title}</h3>)}
      {p.description && (
        <div className="flex-1 mb-4">
          <div ref={contentRef} style={{ height }} className="overflow-hidden transition-all duration-500 ease-in-out">
            <p className="text-slate-500 text-sm leading-6">
              {p.description}
            </p>
          </div>
          {showButton && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 text-xs font-semibold mt-1.5 hover:text-blue-800 focus:outline-none transition-colors"
            >
              {expanded ? "View Less" : "View More"}
            </button>
          )}
        </div>
      )}

      {/* Horizontal Scroll for Skills inside projects */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {p.skills?.map((s, idx) => (
          <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2 py-1 rounded whitespace-nowrap shrink-0">
            {s}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-auto">
        {p.github && (
          <a href={p.github} onClick={() => trackClick(`project_code:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors">
            View Code
          </a>
        )}
        {p.live && (
          <a href={p.live} onClick={() => trackClick(`project_live:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Live App
          </a>
        )}
      </div>
    </div>
  );
};

export default function Template2({ data, owner_key, working }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  // Helper to format dates for experience
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Dynamic menu checking to hide sections that have no data
  const hasAbout = !!data?.about;
  const hasExperience = data?.experience?.length > 0;
  const hasProjects = data?.projects?.length > 0;
  const hasSkills = data?.skills?.length > 0;

  // Dynamic layout logic for About & Experience
  const isSingleExperience = data?.experience?.length === 1;
  const aboutExpLayoutClass = (hasAbout && hasExperience && isSingleExperience)
    ? "grid md:grid-cols-2 gap-8 py-8" // Side-by-side if only 1 experience
    : "flex flex-col gap-10 py-8";     // Stacked if multiple experiences

  const navLinks = [
    { id: "#hero", label: "Home", show: true },
    { id: "#about", label: "About", show: hasAbout },
    { id: "#projects", label: "Projects", show: hasProjects },
    { id: "#experience", label: "Experience", show: hasExperience },
    { id: "#skills", label: "Tech Stack", show: hasSkills },
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
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans min-h-dvh">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 bg-[#0B1120] text-slate-200 shadow-md">
        <div className="flex justify-between items-center relative z-50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("#hero")}>
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 bg-transparent text-white flex items-center justify-center font-bold shrink-0">
              {getInitials(data?.fullName || "F")}
            </div>
            <div>
              <h1 className="font-bold text-white tracking-wide">{data?.fullName?.split(" ")[0]?.toUpperCase() || "PORTFOLIO"}</h1>
              {data?.title && (<p className="text-[10px] tracking-wider text-slate-400">{data.title}</p>)}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            {navLinks.filter(link => link.show).map((link) => (
              <button
                key={link.id}
                className="hover:text-blue-400 transition-colors"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-slate-200 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu Overlay & Dropdown */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 h-screen w-screen bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            ></div>

            <div className="md:hidden absolute top-full left-0 w-full bg-[#0B1120] border-t border-slate-800 shadow-xl flex flex-col items-center py-6 gap-6 z-50">
              {navLinks.filter(link => link.show).map((link) => (
                <button
                  key={link.id}
                  className="text-slate-200 hover:text-blue-400"
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-24">
        {/* HERO SECTION */}
        <div id="hero" className="scroll-mt-24 flex flex-col-reverse md:flex-row items-center justify-between gap-10 py-6 md:py-8">
          {/* Left Text */}
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
              <span>👋</span> Hi, I'm
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {data?.fullName} <br />
              {data?.title && (
                <>
                  <span className="text-slate-800">I'm a </span>
                  <span className="text-blue-600">{data.title}</span>
                </>
              )}
            </h1>
            {data?.bio && (
              <p className="text-slate-600 text-md max-w-xl leading-relaxed line-clamp-3" title={data?.bio}>
                {data?.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-4 pt-2">
              {hasProjects && (
                <button onClick={() => scrollTo("#projects")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-200">
                  View Projects
                </button>
              )}

              {/* Only show resume button if data.resume exists */}
              {data?.resume && (
                <a href={data.resume} onClick={() => trackClick("resume")} target="_blank" rel="noreferrer" className="border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Resume
                </a>
              )}
            </div>

            <div className="pt-4">
              <p className="text-sm text-slate-500 mb-3">Connect with me</p>
              <div className="flex gap-4">
                {data?.linkedin && (
                  <a href={data.linkedin} onClick={() => trackClick("linkedin")} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-blue-600 hover:-translate-y-1 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                )}
                {data?.github && (
                  <a href={data.github} onClick={() => trackClick("github")} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-slate-800 hover:-translate-y-1 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                )}
                {data?.email && (
                  <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-red-500 hover:-translate-y-1 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Image */}
          {data?.image?.url && (
            <div className="flex-1 flex justify-center relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 w-64 h-64 m-auto -z-10"></div>
              <div className="relative">
                <img
                  src={data?.image?.url}
                  alt={data?.fullName}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-white"
                />
                <div className="absolute bottom-6 right-0 bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-slate-100">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-slate-700">Open to work</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {(hasAbout || hasExperience) && <hr className="border-slate-200 my-4" />}

        {/* ABOUT & EXPERIENCE DYNAMIC LAYOUT */}
        {(hasAbout || hasExperience) && (
          <div className={aboutExpLayoutClass}>

            {/* About Section */}
            {hasAbout && (
              <div id="about" className="scroll-mt-24 h-fit">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">About Me</h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>{data?.about}</p>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {hasExperience && (
              <div id="experience" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Experience</h2>
                </div>

                {/* Dynamic Experience Cards Container */}
                <div className={!isSingleExperience ? "grid md:grid-cols-2 gap-5" : "space-y-4"}>
                  {data?.experience?.map((exp, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative h-fit">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {exp.companyLogo ? (
                            <img src={exp.companyLogo} alt={exp.company} className="w-10 h-10 object-contain shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded flex items-center justify-center font-bold text-lg shrink-0">
                              {exp.company?.[0] || "C"}
                            </div>
                          )}
                          <div>
                            {exp.role && (<h3 className="font-bold text-slate-800 text-base">{exp.role}</h3>)}
                            {exp.company && (<p className="text-blue-600 font-medium text-xs">{exp.company}</p>)}
                          </div>
                        </div>
                        {exp.startDate && (
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 whitespace-nowrap">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                          </div>
                        )}
                      </div>
                      {exp.description && (<p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {hasProjects && (
          <div id="projects" className="scroll-mt-24 py-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.projects?.map((p, i) => (
                <ProjectCard key={i} p={p} trackClick={trackClick} />
              ))}
            </div>
          </div>
        )}

        {/* TECH STACK */}
        {hasSkills && (
          <div id="skills" className="scroll-mt-24 py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Tech Stack</h2>
            </div>

            <div className="flex flex-wrap gap-4">
              {data?.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2.5 bg-white border border-slate-200 text-slate-800 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-blue-300 transition-all cursor-default"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT ME - Always shown */}
        <div id="contact" className="scroll-mt-24 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Contact Me</h2>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 grid md:grid-cols-2 gap-10 items-center">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Let's build something amazing together!</h3>
                <p className="text-slate-500 text-sm">Feel free to reach out for collaborations or just a friendly hello.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-sm break-all">{data?.email || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-sm">{data?.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-medium text-sm break-all">{data?.location || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form suppressHydrationWarning onSubmit={handleSubmit} className="flex flex-col gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Your Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full border border-slate-200 p-2.5 text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full border border-slate-200 p-2.5 text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  rows={4}
                  className="w-full border border-slate-200 p-2.5 text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors mt-1 flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>

                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0B1120] text-slate-400 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs flex flex-wrap items-center gap-1 text-slate-400">
            © {new Date().getFullYear()} {data?.fullName || "Portfolio"}.
            All rights reserved.
            <a
              href="https://flexfolio.online"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Built with Flexfolio
            </a>
          </p>
          <div className="flex gap-5 text-slate-500">
            {data?.linkedin && <a href={data.linkedin} onClick={() => trackClick("linkedin")} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>}
            {data?.github && <a href={data.github} onClick={() => trackClick("github")} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>}
            {data?.email && <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>}
          </div>
        </div>
      </footer>
    </div>
  );
}