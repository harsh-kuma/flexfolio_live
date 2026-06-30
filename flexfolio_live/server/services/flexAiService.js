const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = async (resumeText) => {
  const prompt = `
You are an expert resume analyzer and portfolio content writer.

Your job is to convert the resume into a professional portfolio JSON.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Never return markdown.
3. Never wrap JSON in \`\`\`.
4. If a section does not exist in the resume, return an empty array [].
5. Do NOT create fake work experience.
6. Do NOT create fake certificates.
7. Do NOT create fake projects.
8. Improve and rewrite the bio and about sections professionally.
9. Bio should be concise and impactful (1-2 lines).
10. About should be detailed, professional and portfolio-ready.
11. Skills must be unique.
12. If a project exists but description is weak, generate a better professional description.
13. If experience exists but description is weak, improve it professionally.
14. Extract social links whenever possible.
15. If company website/domain can be confidently identified, include it.
16. If company domain is unavailable, return empty string.
17. Only generate companyLogo when companyDomain exists.
18. Never hallucinate company domains.
19. Preserve all factual information from the resume.
20. Return dates exactly as found when possible.

JSON STRUCTURE:

{
  "image": null,
  "resume": null,

  "fullName": "",
  "email": "",
  "phone": "",
  "location": "",

  "github": "",
  "linkedin": "",

  "title": "",

  "bio": "",

  "about": "",

  "skills": [],

  "projects": [],

  "experience": [],

  "certificates": []
}

PROJECT OBJECT:

{
  "title": "",
  "year": "",
  "github": "",
  "live": "",
  "description": "",
  "skills": [],
  "image": ""
}

EXPERIENCE OBJECT:

{
  "company": "",
  "role": "",
  "jobType": "",
  "startDate": "",
  "endDate": "",
  "current": false,
  "description": "",
  "skills": [],
  "companyDomain": "",
  "companyLogo": ""
}

CERTIFICATE OBJECT:

{
  "title": "",
  "issuer": "",
  "issueDate": "",
  "credentialUrl": "",
  "image": ""
}

SPECIAL RULES:

- If no projects exist:
  "projects": []

- If no experience exists:
  "experience": []

- If no certificates exist:
  "certificates": []

- If companyDomain exists:
  companyLogo MUST be:
  "https://img.logo.dev/<companyDomain>?token=pk_BxQc27sjQO-zNmnI6_yF7Q"

Example:

companyDomain:
"google.com"

companyLogo:
"https://img.logo.dev/google.com?token=pk_BxQc27sjQO-zNmnI6_yF7Q"

- If companyDomain is empty:
  companyLogo MUST be empty string.

Resume:

${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.text;

  // remove markdown fences if Gemini adds them
  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "");
  return JSON.parse(text);
};