
"use client";
export default function Template1({ data }) {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10">

        {/* PROFILE */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <img
            src={data?.image}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {data.fullName}
            </h1>
            <p className="text-gray-600">{data.title}</p>
            <p className="text-sm text-gray-500">{data.location}</p>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700">{data.about}</p>
        </div>

        {/* SKILLS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill, i) => (
              <span
                key={i}
                className="bg-black text-white px-3 py-1 rounded-md text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Projects</h2>

          {data.projects?.map((p, i) => (
            <div
              key={i}
              className="bg-gray-50 p-4 rounded-lg mb-3 shadow-sm"
            >
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {p.description}
              </p>

              <div className="flex gap-4 mt-3">
                <a
                  href={p.github}
                  target="_blank"
                  className="text-blue-600 text-sm font-medium"
                >
                  GitHub
                </a>
                <a
                  href={p.live}
                  target="_blank"
                  className="text-blue-600 text-sm font-medium"
                >
                  Live
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* EXPERIENCE */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Experience</h2>

          {data.experience?.map((exp, i) => (
            <div
              key={i}
              className="bg-gray-50 p-4 rounded-lg mb-3 shadow-sm"
            >
              <h3 className="font-semibold">{exp.role}</h3>
              <p className="text-gray-500 text-sm">
                {exp.company} • {exp.duration}
              </p>
              <p className="text-gray-700 text-sm mt-1">
                {exp.description}
              </p>
            </div>
          ))}
        </div>

        {/* SOCIAL */}
        <div className="flex gap-4 mt-6">
          <a
            href={data.github}
            target="_blank"
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            GitHub
          </a>

          <a
            href={data.linkedin}
            target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}