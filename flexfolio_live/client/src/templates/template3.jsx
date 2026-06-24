"use client";
import { sendContactMessage, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";

// Reusable Project Card for Dark Theme
const DarkProjectCard = ({ p ,trackClick }) => {
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
    <div className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition-all flex flex-col group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        {p?.title && (<h3 className="font-bold text-neutral-100 text-xl line-clamp-1" title={p.title}>{p.title}</h3>)}
        {p?.year && (
          <span className="bg-neutral-800 text-emerald-400 text-xs font-mono px-2.5 py-1 rounded-md shrink-0 border border-neutral-700">
            {p.year}
          </span>
        )}
      </div>

      {p.description && (
        <div className="flex-1 mb-4">
          <div ref={contentRef} style={{ height }} className="overflow-hidden transition-all duration-500 ease-in-out">
            <p className="text-neutral-400 text-sm leading-relaxed">
              {p.description}
            </p>
          </div>
          {showButton && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-emerald-400 text-xs font-semibold mt-2 hover:text-emerald-300 transition-colors focus:outline-none"
            >
              {expanded ? "View Less" : "View More"}
            </button>
          )}
        </div>
      )}

      {p?.skills && p.skills.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full relative z-10">
          {p.skills.map((s, idx) => (
            <span key={idx} className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-[11px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap shrink-0">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-auto relative z-10">
        {p?.github && (
          <a href={p.github} onClick={() => trackClick(`project_code:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-2 rounded-lg text-sm font-medium transition-colors border border-neutral-700">
            Code
          </a>
        )}
        {p?.live && (
          <a href={p.live} onClick={() => trackClick(`project_live:${p.title}`)} target="_blank" rel="noreferrer" className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default function Template3({ data, owner_key, working ,system_allow}) {
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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <div className="bg-neutral-950 text-neutral-300 font-sans min-h-dvh pb-2 selection:bg-emerald-500/30 selection:text-emerald-200">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[60] bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center relative z-[60]">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo("#hero")}>
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-400 flex items-center justify-center font-bold shrink-0 group-hover:border-emerald-500 transition-colors">
              {getInitials(data?.fullName || "F")}
            </div>
            <h1 className="font-bold text-neutral-100 tracking-wide hidden sm:block">
              {data?.fullName?.split(" ")[0]?.toUpperCase() || "PORTFOLIO"}
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            {navLinks.filter(link => link.show).map((link) => (
              <button
                key={link.id}
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="text-2xl md:hidden text-neutral-300 hover:text-emerald-400 focus:outline-none p-1 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full z-50">
            {/* Dark Overlay Backdrop */}
            <div
              className="fixed inset-0 top-[73px] h-dvh w-screen bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            ></div>

            {/* Menu Panel */}
            <div className="relative bg-neutral-900 border-b border-neutral-800 shadow-2xl flex flex-col items-center py-6 gap-6">
              {navLinks.filter(link => link.show).map((link) => (
                <button
                  key={link.id}
                  className="text-neutral-300 hover:text-emerald-400 text-base font-medium w-full text-center py-2"
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-12 pt-16">

        {/* HERO SECTION */}
        <div id="hero" className="scroll-mt-32 flex flex-col items-center text-center py-10 md:py-16">
          {data?.image?.url && (
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 w-full h-full"></div>
              <img
                src={data.image.url}
                alt={data.fullName}
                className="w-64 h-64 rounded-full object-cover shadow-2xl border-2 border-neutral-800 relative z-10"
              />
            </div>)}

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            {data?.fullName}
          </h1>
          {data?.title && (
            <h2 className="text-xl md:text-2xl text-emerald-400 font-mono mb-6 flex items-center gap-2">
              <span className="text-neutral-600">&gt;</span> {data.title} <span className="animate-pulse">_</span>
            </h2>
          )}

          {data?.bio && (
            <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed mb-8 line-clamp-3" title={data?.bio}>
              {data.bio}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => scrollTo("#contact")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Get In Touch
            </button>
            {data?.resume?.url && (
              <a href={data.resume?.url} onClick={() => trackClick("resume")} target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-8 py-3 rounded-full font-medium transition-colors">
                Resume
              </a>
            )}
          </div>

          {/* Social Links under Hero */}
          <div className="flex gap-6 mt-12">
            {data?.github && (
              <a href={data.github} onClick={() => trackClick("github")} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} onClick={() => trackClick("linkedin")} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-[#0a66c2] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            )}
            {data?.email && (
              <a href={`mailto:${data.email}`} onClick={() => trackClick("email")} className="text-neutral-500 hover:text-emerald-400 transition-colors">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>

        {/* ABOUT (Centered) */}
        {hasAbout && (
          <div id="about" className="scroll-mt-24 py-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              {data.about}
            </p>
          </div>
        )}

        {/* EXPERIENCE (Timeline layout) */}
        {hasExperience && (
          <div id="experience" className="scroll-mt-24 py-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Experience</h2>

            <div className="border-l-2 border-neutral-800 ml-4 md:ml-10 pl-8 md:pl-12 space-y-12">
              {data?.experience.map((exp, i) => (
                <div key={i} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[43px] md:-left-[59px] top-1.5 w-5 h-5 bg-neutral-950 border-4 border-neutral-700 rounded-full group-hover:border-emerald-500 transition-colors"></span>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-2">
                    {exp.role && (<h3 className="text-xl font-bold text-neutral-100">{exp.role}</h3>)}
                    <span className="text-emerald-400 font-mono text-sm">
                      {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    {exp.companyLogo ? (
                      <img src={exp.companyLogo} alt={exp.company} className="w-7 h-7 object-contain drop-shadow-md" />
                    ) : (
                      <div className="w-7 h-7 bg-neutral-800 text-neutral-400 rounded flex items-center justify-center font-bold text-xs shrink-0">
                        {exp.company?.[0] || "C"}
                      </div>
                    )}
                    {exp.company && (<span className="text-neutral-300 font-medium">{exp.company}</span>)}
                  </div>
                  {exp.description && (
                    <p className="text-neutral-400 leading-relaxed text-sm">
                      {exp.description}
                    </p>)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS (Grid) */}
        {hasProjects && (
          <div id="projects" className="scroll-mt-24 py-16">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {data?.projects?.map((p, i) => (
                <DarkProjectCard key={i} p={p} trackClick={trackClick}/>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS (Minimal Pills) */}
        {hasSkills && (
          <div id="skills" className="scroll-mt-24 py-16 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-10">Technical Arsenal</h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {data?.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-6 py-3 rounded-full text-sm font-medium hover:text-emerald-400 hover:border-emerald-500/50 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT (Minimal Form) */}
        <div id="contact" className="scroll-mt-24 py-16 max-w-3xl mx-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Let's Connect</h2>
              <p className="text-neutral-400 text-sm">My inbox is always open. Whether you have a question or just want to say hi!</p>
            </div>

            <form suppressHydrationWarning onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  rows={4}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl transition-colors mt-2">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 mt-6">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm font-mono">
            © {new Date().getFullYear()} {data?.fullName || "Portfolio"}. All rights reserved.
            {(!system_allow?.removeBranding || !system_allow) && <a
              href="https://flexfolio.online"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Built with Flexfolio
            </a>}
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