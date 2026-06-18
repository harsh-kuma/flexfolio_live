import { developerSchema } from "./schemas";
export const templates = {
  developer: {
    schema: developerSchema,
    defaultData: {
      image: null,
      resume: null,
      fullName: "",
      email: "",
      phone: "",
      location: "",
      github: "",
      linkedin: "",
      title: "",
      bio: "",
      about:"",
      skills: [],
      projects: [],
      experience: [],
      certificates: [],
    },
  },
};