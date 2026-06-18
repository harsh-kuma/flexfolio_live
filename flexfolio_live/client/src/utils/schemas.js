export const developerSchema = [
  // 🔹 PERSONAL (Merged Image here)
  {
    section: "Personal Details",
    fields: [
      { name: "image", label: "Profile Image", type: "file" },
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
      { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
      { name: "phone", label: "Phone", type: "tel", placeholder: "+1 (555) 000-0000" },
      { name: "location", label: "Location", type: "text", placeholder: "New York, USA" },
      { name: "resume", label: "Resume (PDF)", type: "document" },
    ],
  },
  // 🔹 PROFESSIONAL
  {
    section: "Professional Overview",
    fields: [
      { name: "title", label: "Job Title", type: "text", placeholder: "Full Stack Developer" },
      { name: "bio", label: "Short Bio", type: "textarea", placeholder: "Full Stack Developer passionate about..." },
      { name: "skills", label: "Core Skills", type: "tags" },
      { name: "about", label: "professional description", type: "textarea", placeholder: "I am a MERN stack developer with experience ..."}
    ],
  },
  // 🔹 SOCIAL
  {
    section: "Social Links",
    fields: [
      { name: "github", label: "GitHub URL", type: "text", placeholder: "https://github.com/..." },
      { name: "linkedin", label: "LinkedIn URL", type: "text", placeholder: "https://linkedin.com/in/..." },
    ],
  },
  // 🔹 PROJECTS
  {
    section: "Projects",
    key: "projects",
    repeatable: true,
    fields: [
      { name: "title", label: "Project Title", type: "text", placeholder: "E-commerce Platform" },
      { name: "year", label: "Year", type: "text", placeholder: "2023" },
      { name: "github", label: "GitHub Link", type: "text", placeholder: "https://github.com/..." },
      { name: "live", label: "Live Link", type: "text", placeholder: "https://myproject.com" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Describe what you built..." },
      { name: "skills", label: "Tech Stack", type: "tags" },
      {name: "image",label: "Project Screenshot",type: "file"},
    ],
  },
  // 🔹 EXPERIENCE
  {
    section: "Experience",
    key: "experience",
    repeatable: true,
    fields: [
      {
        name: "company",
        label: "Company",
        type: "autocomplete",
        placeholder: "Search company name...",
        mapResult: (item) => ({
          company: item.name,
          companyDomain: item.domain,
          companyLogo: item.logo || (item.domain ? `https://img.logo.dev/${item.domain}?token=pk_BxQc27sjQO-zNmnI6_yF7Q` : ""),
        }),
      },
      { name: "companyDomain", type: "hidden" },
      { name: "companyLogo", type: "hidden" },
      { name: "role", label: "Role", type: "text", placeholder: "Software Engineer" },
      {
        name: "jobType",
        label: "Job Type",
        type: "select",
        options: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "current", label: "I currently work here", type: "checkbox" },
      { name: "description", label: "Description & Achievements", type: "textarea", placeholder: "Led a team of 5 to deliver..." },
      { name: "skills", label: "Skills Used", type: "tags" },
    ],
  },
  // 🔹 Certificate
  {
  section: "Certificates",
  repeatable: true,
  key: "certificates",

  fields: [
    {
      name: "title",
      label: "Certificate Name",
      type: "text"
    },

    {
      name: "issuer",
      label: "Issuer",
      type: "text"
    },

    {
      name: "issueDate",
      label: "Issue Date",
      type: "date"
    },

    {
      name: "credentialUrl",
      label: "Credential URL",
      type: "url"
    },

    {
      name: "image",
      label: "Certificate Image",
      type: "file"
    }
  ]
}
];

