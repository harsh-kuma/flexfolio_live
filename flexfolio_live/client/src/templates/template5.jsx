"use client";
import { sendContactMessage, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInitials } from "../utils/getInitials";

// Neo-Brutalist Project Card
const NeoProjectCard = ({ p, index }) => {
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

  const colors = ["bg-[#FF90E8]", "bg-[#FFC900]", "bg-[#90BAFE]"];
  const cardColor = colors[index % colors.length];

  return (
    <div className={`max-w-full border-4 border-black p-6 flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${cardColor}`}>
      <div className="flex justify-between items-start mb-4 gap-3 min-w-0">
        {p?.title && (
          <h3 className="min-w-0 font-black text-black text-xl uppercase tracking-tight line-clamp-2 border-b-4 border-black pb-1 break-words" title={p?.title}>
            {p.title}
          </h3>
        )}
        {p?.year && (
          <span className="bg-white border-2 border-black text-black text-xs font-bold px-3 py-1 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {p.year}
          </span>
        )}
      </div>
      {p?.description && (
        <div className="flex-1 mb-5 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div ref={contentRef} style={{ height }} className="overflow-hidden transition-all duration-500 ease-in-out">
            <p className="text-black font-medium text-sm leading-relaxed">
              {p?.description}
            </p>
          </div>
          {showButton && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-black font-black uppercase text-xs mt-3 hover:underline decoration-4 underline-offset-4"
            >
              {expanded ? "Show Less" : "Read More ->"}
            </button>
          )}
        </div>
      )}

      {p?.skills && p.skills.length > 0 && (
        <div className="flex overflow-x-auto gap-2 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {p.skills.map((s, idx) => (
            <span key={idx} className="bg-white border-2 border-black text-black font-bold text-[11px] uppercase px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-auto">
        {p?.github && (
          <a href={p.github} onClick={() => trackClick("project_code")} target="_blank" rel="noreferrer" className="flex-1 text-center bg-white border-2 border-black hover:bg-black hover:text-white text-black py-2.5 font-black uppercase text-sm transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Code
          </a>
        )}
        {p?.live && (
          <a href={p.live} onClick={() => trackClick("project_live")} target="_blank" rel="noreferrer" className="flex-1 text-center bg-[#23A094] border-2 border-black hover:bg-[#1a7a71] text-white py-2.5 font-black uppercase text-sm transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default function TemplateNeoBrutalist({ data, owner_key, working }) {
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
  const isSingleExperience = data?.experience?.length === 1;
  const hasProjects = data?.projects?.length > 0;
  const hasSkills = data?.skills?.length > 0;

  const aboutExpLayoutClass = (hasExperience && isSingleExperience)
    ? "grid grid-cols-1space-y-8"
    : "grid grid-col-1 md:grid-cols-2  md:gap-8 space-y-8";


  const navLinks = [
    { id: "#hero", label: "Home", show: true },
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

  return (
    <div className="bg-[#fdfbf7] text-black font-sans min-h-screen pb-10 selection:bg-[#FFC900] selection:text-black font-medium ">

      {/* NEO-BRUTALIST NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#fdfbf7] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center relative z-50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("#hero")}>
            <div className="w-12 h-12 bg-[#FF90E8] border-4 border-black text-black flex items-center justify-center font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              {getInitials(data?.fullName)}
            </div>
            <h1 className="font-black text-black uppercase tracking-tighter text-xl hidden sm:block bg-[#FFC900] px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {data?.fullName || "F"}
            </h1>
          </div>

          <div className="hidden md:flex gap-6 text-sm font-black uppercase tracking-widest">
            {navLinks.filter(link => link.show).map((link) => (
              <button
                key={link.id}
                className="px-4 py-2 hover:bg-[#90BAFE] border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden bg-[#FFC900] border-4 border-black p-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>

        {/* NEO-BRUTALIST FULL-SCREEN MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 top-[84px] bg-[#90BAFE] border-t-4 border-black z-40 flex flex-col">
            <div className="flex flex-col p-6 gap-4 h-full overflow-y-auto">
              {navLinks.filter(link => link.show).map((link) => (
                <button
                  key={link.id}
                  className="w-full text-left bg-white border-4 border-black p-6 font-black text-3xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-24">

        {/* HERO SECTION - Updated flex-col-reverse for mobile image top */}
        <div id="hero" className="scroll-mt-32 flex flex-col-reverse md:flex-row items-center justify-between gap-12 py-10 md:py-20 border-b-4 border-black pb-20">

          <div className="flex-1 space-y-8 z-10 w-full">
            <div className="inline-block bg-[#FF90E8] border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              🚨 Available for hire
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter leading-[0.9] uppercase">
              Hi, I'm <br />
              <span className="bg-[#FFC900] px-2 border-4 border-black inline-block mt-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {data?.fullName?.split(" ")[0]}
              </span>
            </h1>

            {data?.title && (
              <h2 className="text-2xl md:text-4xl font-black uppercase text-black">
                &gt; {data.title}
              </h2>
            )}

            {data?.bio && (
              <p className="text-black font-bold text-lg md:text-xl max-w-xl leading-relaxed border-l-8 border-black pl-4">
                {data.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-5 pt-4">
              {hasProjects &&
                <button
                  onClick={() => scrollTo("#projects")}
                  className="bg-[#23A094] border-4 border-black text-white px-8 py-4 font-black uppercase text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
                >
                  View My Work
                </button>
              }
              {data?.resume && (
                <a href={data.resume} onClick={() => trackClick("resume")} target="_blank" rel="noreferrer" className="bg-white border-4 border-black text-black px-8 py-4 font-black uppercase text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center gap-2">
                  RESUME
                </a>
              )}
            </div>
          </div>
          {data?.image?.url && (
            <div className="w-full md:w-1/2 flex justify-center relative">
              <div className="w-72 h-72 md:w-96 md:h-96 border-8 border-black bg-[#90BAFE] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform rotate-3 overflow-hidden">
                <img
                  src={data.image.url}
                  alt={data?.fullName}
                  className="w-full h-full object-cover filter contrast-125"
                />
              </div>
              {/* Decorative shapes */}
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-[#FFC900] border-4 border-black rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
            </div>
          )}
        </div>

        {/* ABOUT & EXPERIENCE SPLIT - Updated logic for single experience */}
        {(hasAbout || hasExperience) && (
          <div className={`grid gap-12 py-20 border-b-4 border-black ${(hasAbout && hasExperience && isSingleExperience) ? "md:grid-cols-2" : "grid-cols-1"}`}>

            {hasAbout && (
              <div id="about" className="scroll-mt-32 flex flex-col h-fit">
                <div className="bg-black text-white px-6 py-3 border-4 border-black w-max font-black uppercase text-2xl mb-8 transform -rotate-2">
                  About Me
                </div>
                <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black font-bold text-lg leading-relaxed">
                    {data?.about}
                  </p>
                </div>
              </div>
            )}

            {hasExperience && (
              <div id="experience" className="scroll-mt-32">
                <div className="bg-[#FF90E8] text-black px-6 py-3 border-4 border-black w-max font-black uppercase text-2xl mb-8 transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Experience
                </div>

                <div className={aboutExpLayoutClass}>
                  {data?.experience?.map((exp, i) => (
                    <div key={i} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-transform">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4 border-b-4 border-black pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-black p-1 border-2 border-black flex-shrink-0">
                            {exp.companyLogo ? (
                              <img src={exp.companyLogo} alt={exp.company} className="w-full h-full object-contain bg-white" />
                            ) : (
                              <div className="w-full h-full bg-white flex items-center justify-center font-black text-xl text-black">{exp.company?.[0] || "C"}</div>
                            )}
                          </div>
                          <div>
                            {exp.role && (<h3 className="font-black text-black text-xl uppercase leading-tight">{exp.role}</h3>)}
                            {exp.company && (<p className="text-black font-bold border-b-2 border-black w-max mt-1">{exp.company}</p>)}
                          </div>
                        </div>
                        {exp.startDate && (
                          <span className="bg-[#FFC900] border-2 border-black font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs uppercase shrink-0">
                            {formatDate(exp.startDate)} - {exp.current ? "NOW" : formatDate(exp.endDate)}
                          </span>
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-black font-medium leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {hasProjects && (
          <div id="projects" className="scroll-mt-24 py-20 border-b-4 border-black">
            <div className="bg-[#90BAFE] text-black px-6 py-3 border-4 border-black w-max font-black uppercase text-3xl mb-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              Selected Work
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.projects?.map((p, i) => (
                <NeoProjectCard key={i} index={i} p={p} />
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {hasSkills && (
          <div id="skills" className="scroll-mt-24 py-20 border-b-4 border-black">
            <div className="bg-black text-white px-6 py-3 border-4 border-black w-max font-black uppercase text-3xl mb-12 transform -rotate-1">
              Tech Stack
            </div>

            <div className="flex flex-wrap gap-4">
              {data?.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white border-4 border-black text-black px-6 py-3 font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT */}
        <div id="contact" className="scroll-mt-24 py-20">
          <div className="bg-[#FFC900] border-8 border-black p-4 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">

            <div className="grid lg:grid-cols-2 gap-12 relative z-10">
              {/* Left: Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-black uppercase leading-none mb-6">Let's <br />Talk.</h2>
                  <p className="text-black font-bold text-xl border-l-4 border-black pl-4 bg-white/50 p-2 border-r-4">Don't be shy, drop a message!</p>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-4 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="font-black uppercase w-20">Email:</span>
                    <span className="font-bold">{data?.email || "Not Provided"}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="font-black uppercase w-20">Phone:</span>
                    <span className="font-bold">{data?.phone || "Not Provided"}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="font-black uppercase w-20">Loc:</span>
                    <span className="font-bold">{data?.location || "Not Provided"}</span>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <form suppressHydrationWarning onSubmit={handleSubmit} className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="font-black uppercase text-sm">Your Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full bg-[#fdfbf7] border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#FF90E8]/20 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-sm">Your Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-[#fdfbf7] border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#FF90E8]/20 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-sm">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    rows={4}
                    className="w-full bg-[#fdfbf7] border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#FF90E8]/20 transition-colors resize-none"></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-black uppercase py-4 text-xl hover:bg-[#FF90E8] hover:text-black border-4 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-2 active:translate-x-2 active:shadow-none mt-2">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b-8 border-black">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black">
              {getInitials(data?.fullName)}
            </div>
            <p className="font-black uppercase">
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
            {data?.github && <a href={data.github} onClick={() => trackClick("github")} className="bg-[#90BAFE] border-4 border-black p-3 hover:bg-[#FFC900] hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-sm">GitHub</a>}
            {data?.linkedin && <a href={data.linkedin} onClick={() => trackClick("linkedin")} className="bg-[#FF90E8] border-4 border-black p-3 hover:bg-[#90BAFE] hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-sm">LinkedIn</a>}
          </div>
        </div>

        {/* Scrolling Marquee inside footer for extra brutalist flair */}
        <div className="bg-[#23A094] border-b-4 border-black overflow-hidden py-3 whitespace-nowrap flex text-white font-black uppercase tracking-widest text-xl">
          <span className="animate-[marquee_20s_linear_infinite] inline-block">
            AVAILABLE FOR WORK • LET'S BUILD SOMETHING • AVAILABLE FOR WORK • LET'S BUILD SOMETHING •AVAILABLE FOR WORK • LET'S BUILD SOMETHING • AVAILABLE FOR WORK • LET'S BUILD SOMETHING •
          </span>
        </div>
      </footer>
    </div>
  );
}