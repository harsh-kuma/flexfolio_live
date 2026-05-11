"use client";

export default function Template1({ data }) {
  // Prevent crash if data is not passed
  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Helper function to format experience dates from the dummy data structure
  const formatDuration = (start, end, current) => {
    const startYear = start ? new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "";
    const endYear = current ? "Present" : (end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "");
    return `${startYear} - ${endYear}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center text-gray-900">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 md:p-12">
        
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {data.image && (
            <img
              src={data.image}
              alt={`${data.fullName || "Profile"} image`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 shadow-sm shrink-0"
            />
          )}

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {data.fullName}
            </h1>
            <p className="text-lg text-blue-600 font-semibold mt-1">{data.title}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-5 mt-3 text-sm text-gray-600">
              {data.location && <span className="flex items-center gap-1">📍 {data.location}</span>}
              {data.email && <span className="flex items-center gap-1">✉️ {data.email}</span>}
              {data.phone && <span className="flex items-center gap-1">📞 {data.phone}</span>}
            </div>

            {data.bio && (
              <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
                {data.bio}
              </p>
            )}
          </div>
        </div>

        <hr className="border-gray-200 mb-10" />

        {/* ABOUT */}
        {data.about && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            {/* whitespace-pre-line ensures the line breaks in your template string are rendered */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.about}
            </p>
          </div>
        )}

        {/* SKILLS */}
        {data.skills?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-800 border border-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {data.experience?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="bg-white border border-gray-100 p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      {exp.companyLogo && (
                        <img 
                          src={exp.companyLogo} 
                          alt={exp.company} 
                          className="w-12 h-12 rounded-lg object-contain border border-gray-100 p-1 bg-gray-50 shrink-0" 
                        />
                      )}
                      <div>
                       {exp.role &&( <h3 className="font-semibold text-lg">{exp.role}</h3>)}
                       {exp.company && (<p className="text-blue-600 font-medium text-sm">{exp.company}</p>)}
                      </div>
                    </div>
                    {exp.startDate && (
                    <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                      {formatDuration(exp.startDate, exp.endDate, exp.current)}
                    </span>
                    )}
                  </div>
                  {exp.description && (
                  <p className="text-gray-600 text-sm mt-3 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((p, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-5 rounded-xl flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold text-lg leading-tight">{p.title}</h3>
                    {p.year && (
                      <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shrink-0">
                        {p.year}
                      </span>
                    )}
                  </div>
                  {p.description && (
                  <p className="text-gray-600 text-sm mt-2 whitespace-pre-line flex-grow leading-relaxed">
                    {p.description}
                  </p>
                  )}

                  {p.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.skills.map((skill, idx) => (
                        <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 mt-5 pt-4 border-t border-gray-200">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-gray-900 text-sm font-semibold hover:text-blue-600 transition-colors">
                        GitHub ↗
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-gray-900 text-sm font-semibold hover:text-blue-600 transition-colors">
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOCIAL LINKS / FOOTER */}
        <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-gray-200">
          {data.github && (
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors">
              GitHub Profile
            </a>
          )}
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
              LinkedIn Profile
            </a>
          )}
          {data.resume && data.resume !== "#" && (
            <a href={data.resume} target="_blank" rel="noopener noreferrer" className="bg-gray-100 text-gray-900 border border-gray-300 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
              Download Resume
            </a>
          )}
        </div>

      </div>
    </div>
  );
}