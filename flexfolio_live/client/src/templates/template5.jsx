"use client";
import { getImageUrl } from "@/utils/getImageUrl";
import { useEffect, useState } from "react";
import { getInitials } from "../utils/getInitials";

// Neo-Brutalist Project Card
const NeoProjectCard = ({ p, index }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongText = p?.description?.length > 100;

  // Alternate card colors based on index
  const colors = ["bg-[#FF90E8]", "bg-[#FFC900]", "bg-[#90BAFE]"];
  const cardColor = colors[index % colors.length];

  return (
    <div className={`border-4 border-black p-6 flex flex-col transition-transform duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${cardColor}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-black text-black text-2xl uppercase tracking-tight line-clamp-1 border-b-4 border-black pb-1" title={p?.title}>
          {p?.title || "Untitled Project"}
        </h3>
        {p?.year && (
          <span className="bg-white border-2 border-black text-black text-xs font-bold px-3 py-1 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {p.year}
          </span>
        )}
      </div>

      <div className="flex-1 mb-5 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className={`text-black font-medium text-sm leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          {p?.description || "No description provided."}
        </p>
        {isLongText && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-black font-black uppercase text-xs mt-3 hover:underline decoration-4 underline-offset-4"
          >
            {expanded ? "Show Less" : "Read More ->"}
          </button>
        )}
      </div>

      {p?.skills && p.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {p.skills.map((s, idx) => (
            <span key={idx} className="bg-white border-2 border-black text-black font-bold text-[11px] uppercase px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-auto">
        {p?.github && (
          <a href={p.github} target="_blank" rel="noreferrer" className="flex-1 text-center bg-white border-2 border-black hover:bg-black hover:text-white text-black py-2.5 font-black uppercase text-sm transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Code
          </a>
        )}
        {p?.live && (
          <a href={p.live} target="_blank" rel="noreferrer" className="flex-1 text-center bg-[#23A094] border-2 border-black hover:bg-[#1a7a71] text-white py-2.5 font-black uppercase text-sm transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default function TemplateNeoBrutalist({ data }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const hasAbout = !!data?.bio;
  const hasExperience = data?.experience?.length > 0;
  const isSingleExperience = data?.experience?.length === 1;
  const hasProjects = data?.projects?.length > 0;
  const hasSkills = data?.skills?.length > 0;

  const navLinks = [
    { id: "#hero", label: "Home", show: true },
    { id: "#about", label: "About", show: hasAbout },
    { id: "#experience", label: "Experience", show: hasExperience },
    { id: "#projects", label: "Work", show: hasProjects },
    { id: "#skills", label: "Skills", show: hasSkills },
    { id: "#contact", label: "Contact", show: true },
  ];

  return (
    <div className="bg-[#fdfbf7] text-black font-sans min-h-screen pb-10 selection:bg-[#FFC900] selection:text-black font-medium ">

      {/* NEO-BRUTALIST NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#fdfbf7] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center relative z-50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("#hero")}>
            <div className="w-12 h-12 bg-[#FF90E8] border-4 border-black text-black flex items-center justify-center font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              {getInitials(data?.fullName || "Dev")}
            </div>
            <h1 className="font-black text-black uppercase tracking-tighter text-xl hidden sm:block bg-[#FFC900] px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {data?.fullName || "PORTFOLIO"}
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

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32">

        {/* HERO SECTION - Updated flex-col-reverse for mobile image top */}
        <div id="hero" className="scroll-mt-32 flex flex-col-reverse md:flex-row items-center justify-between gap-12 py-10 md:py-20 border-b-4 border-black pb-20">

          <div className="flex-1 space-y-8 z-10 w-full">
            <div className="inline-block bg-[#FF90E8] border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              🚨 Available for hire
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-[0.9] uppercase">
              Hi, I'm <br />
              <span className="bg-[#FFC900] px-2 border-4 border-black inline-block mt-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {data?.fullName?.split(" ")[0] || "There"}
              </span>
            </h1>

            <h2 className="text-2xl md:text-4xl font-black uppercase text-black">
              &gt; {data?.title || "Software Developer"}
            </h2>

            <p className="text-black font-bold text-lg md:text-xl max-w-xl leading-relaxed border-l-8 border-black pl-4">
              {data?.bio || "Building next-generation applications with a focus on seamless user experiences."}
            </p>

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
                <a href={data.resume} target="_blank" rel="noreferrer" className="bg-white border-4 border-black text-black px-8 py-4 font-black uppercase text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center gap-2">
                  RESUME
                </a>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="w-72 h-72 md:w-96 md:h-96 border-8 border-black bg-[#90BAFE] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform rotate-3 overflow-hidden">
              <img
                src={getImageUrl(data?.image)}
                alt={data?.fullName}
                className="w-full h-full object-cover filter contrast-125"
              />
            </div>
            {/* Decorative shapes */}
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-[#FFC900] border-4 border-black rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
          </div>
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
                    {data?.bio}
                  </p>
                </div>
              </div>
            )}

            {hasExperience && (
              <div id="experience" className="scroll-mt-32">
                <div className="bg-[#FF90E8] text-black px-6 py-3 border-4 border-black w-max font-black uppercase text-2xl mb-8 transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Experience
                </div>

                <div className="space-y-8">
                  {data.experience.map((exp, i) => (
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
                            <h3 className="font-black text-black text-xl uppercase leading-tight">{exp.role}</h3>
                            <p className="text-black font-bold border-b-2 border-black w-max mt-1">{exp.company}</p>
                          </div>
                        </div>
                        <span className="bg-[#FFC900] border-2 border-black font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs uppercase shrink-0">
                          {formatDate(exp.startDate)} - {exp.current ? "NOW" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-black font-medium leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {hasProjects && (
          <div id="projects" className="scroll-mt-32 py-20 border-b-4 border-black">
            <div className="bg-[#90BAFE] text-black px-6 py-3 border-4 border-black w-max font-black uppercase text-3xl mb-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              Selected Work
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.map((p, i) => (
                <NeoProjectCard key={i} index={i} p={p} />
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {hasSkills && (
          <div id="skills" className="scroll-mt-32 py-20 border-b-4 border-black">
            <div className="bg-black text-white px-6 py-3 border-4 border-black w-max font-black uppercase text-3xl mb-12 transform -rotate-1">
              Tech Stack
            </div>

            <div className="flex flex-wrap gap-4">
              {data.skills.map((skill, i) => (
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
        <div id="contact" className="scroll-mt-32 py-20">
          <div className="bg-[#FFC900] border-8 border-black p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">

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
              <form suppressHydrationWarning className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="font-black uppercase text-sm">Your Name</label>
                  <input placeholder="JOHN DOE" className="w-full bg-[#fdfbf7] border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#FF90E8]/20 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-sm">Your Email</label>
                  <input placeholder="JOHN@EMAIL.COM" type="email" className="w-full bg-[#fdfbf7] border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#FF90E8]/20 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-sm">Message</label>
                  <textarea placeholder="LET'S BUILD SOMETHING COOL" rows="4" className="w-full bg-[#fdfbf7] border-4 border-black p-4 font-bold focus:outline-none focus:bg-[#FF90E8]/20 transition-colors resize-none"></textarea>
                </div>
                <button type="button" className="w-full bg-black text-white font-black uppercase py-4 text-xl hover:bg-[#FF90E8] hover:text-black border-4 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-2 active:translate-x-2 active:shadow-none mt-2">
                  Submit Form
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
              {getInitials(data?.fullName || "Dev")}
            </div>
            <p className="font-black uppercase">
              © {new Date().getFullYear()} {data?.fullName}.
            </p>
          </div>

          <div className="flex gap-4">
            {data?.github && <a href={data.github} className="bg-[#90BAFE] border-4 border-black p-3 hover:bg-[#FFC900] hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-sm">GitHub</a>}
            {data?.linkedin && <a href={data.linkedin} className="bg-[#FF90E8] border-4 border-black p-3 hover:bg-[#90BAFE] hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-sm">LinkedIn</a>}
          </div>
        </div>

        {/* Scrolling Marquee inside footer for extra brutalist flair */}
        <div className="bg-[#23A094] border-b-4 border-black overflow-hidden py-3 whitespace-nowrap flex text-white font-black uppercase tracking-widest text-xl">
          <span className="animate-[marquee_20s_linear_infinite] inline-block">
            AVAILABLE FOR WORK • FULL STACK DEVELOPER • LET'S BUILD SOMETHING • AVAILABLE FOR WORK • FULL STACK DEVELOPER • LET'S BUILD SOMETHING •
          </span>
        </div>
      </footer>
    </div>
  );
}