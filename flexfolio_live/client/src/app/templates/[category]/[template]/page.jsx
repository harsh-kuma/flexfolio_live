"use client";

import TemplateNotFound from "@/components/portfolio/TemplateNotFound";
import { templates } from "@/lib/templates";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

//  Dummy Data
export const dummyData = {
  fullName: "Alex Carter",
  title: "Senior Full Stack Developer",
  bio: `Full Stack Developer with 4+ years of experience building scalable and high-performance web applications using the MERN stack. Passionate about clean code, modern UI, and future-ready solutions.`,
  about:`I’m a Full Stack Developer who enjoys building modern, scalable, and user-focused web applications. Over the years, I’ve worked on a variety of projects ranging from dynamic frontend interfaces to complex backend systems, always aiming to deliver smooth performance and clean user experiences.

My primary expertise lies in the MERN stack, where I build responsive frontend applications with React and develop powerful backend services using Node.js, Express, and MongoDB. Beyond web development, I’m deeply interested in system design, DevOps practices, and AI integrations that help create smarter and more efficient applications.`,

  image:{
    url:"https://res.cloudinary.com/dr38wac7n/image/upload/v1778401266/flexfolio/wdjs1gdw66a7sqzewjr6.png",
  },

  email: "alex@flexfolio.com",
  phone: "+91 XXXXXXXXXX",
  location: "Jaipur, India",

  github: "https://github.com",
  linkedin: "https://linkedin.com",
  resume: "#",

  skills: [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Redux",
    "Tailwind CSS",
    "TypeScript",
    "GraphQL",
    "Docker",
    "AWS",
    "Git",
    "REST API"
  ],

  projects: [
    {
      title: "Enterprise E-Commerce Platform",
      description: `Designed and developed a scalable e-commerce platform supporting thousands of daily users. 
Implemented secure authentication, dynamic product management, real-time cart system, and integrated payment gateways. 
Optimized performance using lazy loading, caching strategies, and API optimization, resulting in a 40% faster load time.`,
      year: "2025",
      skills: ["React", "Redux", "Node.js", "MongoDB", "Stripe"],
      github: "https://github.com",
      live: "https://flexfolio.online"
    },
    {
      title: "Portfolio Builder SaaS",
      description: `Built a SaaS platform enabling users to create and deploy professional portfolios with customizable templates (like Wix). 
Developed a dynamic template engine, live preview system, and real-time editing features. 
Integrated authentication, database persistence, and deployment pipeline for instant portfolio publishing.`,
      year: "2025",
      skills: ["Next.js", "Tailwind", "Express", "MongoDB"],
      github: "https://github.com",
      live: "https://flexfolio.online"
    },
    {
      title: "Real-Time Chat Application",
      description: `Developed a real-time messaging app with WebSocket integration, supporting one-to-one and group chats.`,
      year: "2024",
      skills: ["React", "Node.js", "Socket.io"],
      github: "https://github.com",
      live: "https://flexfolio.online"
    }
  ],

  experience: [
    {
      role: "Frontend Developer Intern",
      company: "Amazon",
      companyDomain: "amazon.com",
      companyLogo: "https://img.logo.dev/amazon.com?token=pk_BxQc27sjQO-zNmnI6_yF7Q",
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      current: false,
      description: `Worked on large-scale internal dashboards used by operations teams. 
Built reusable UI components using React and improved performance by optimizing rendering and reducing bundle size. 
Collaborated with backend teams to integrate APIs and enhance data visualization features. 
Contributed to improving user experience, reducing load time by 30%.`
    },
    {
      role: "Full Stack Developer",
      company: "Flipkart",
      companyDomain: "flipkart.com",
      companyLogo: "https://img.logo.dev/flipkart.com?token=pk_BxQc27sjQO-zNmnI6_yF7Q",
      startDate: "2024-07-01",
      endDate: "",
      current: true,
      description: `Leading development of scalable full-stack applications using MERN stack. 
Designed RESTful APIs, implemented authentication systems, and optimized database queries for high performance. 
Worked on production systems handling large traffic, ensuring reliability and scalability. 
Collaborated with cross-functional teams to deliver high-quality features and improve overall system architecture.`
    }
  ]
};

export default function TemplatePreview() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isIframe = searchParams.get("view") === "true";

  const key = `${params.category}-${params.template}`;
  const template = templates[key];

  if (!template) return <TemplateNotFound/>;

  const Template = template.component;

  //  iframe render
  if (isIframe) {
    return <Template data={dummyData} working={false} />;
  }

  //  device state
  const [device, setDevice] = useState("desktop");

  const deviceConfig = {
    mobile: 375,
    tablet: 768,
    desktop: 1200
  };

  const width = deviceConfig[device];

  const deviceBtn = (type, Icon) => (
    <button
      onClick={() => setDevice(type)}
      className={`p-2 rounded-lg transition ${device === type
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-white shadow sticky top-0 z-50">
        <div
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center"
          >
            <Image
              src="/flexfolio_full.jpeg"
              alt="FlexFolio"
              width={100}
              height={40}
              priority
              className="object-contain"
            />
        </div>

        <div className="hidden md:flex items-center gap-2">
          {deviceBtn("desktop", Monitor)}
          {deviceBtn("tablet", Tablet)}
          {deviceBtn("mobile", Smartphone)}
        </div>

        <button
          onClick={() => router.push(`/dashboard/builder?template=${key}`)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
        >
          Use Template
        </button>
      </div>

      {/* PREVIEW */}
      <div className="flex-1 flex justify-center mt-4">
        <div style={{ width, maxWidth: "100%" }}>
          <iframe
            title="Template Preview"
            src={`/templates/${params.category}/${params.template}?view=true`}
            className="w-full border-0"
            style={{ height: "calc(100vh - 80px)" }}
          />
        </div>
      </div>
    </div>
  );
}