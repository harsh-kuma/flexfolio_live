export const validateSignup = (form) => {
  const errors = {};

  // FULL NAME
  if (!form.name.trim()) {
    errors.name = "Full name is required";

  } else if (form.name !== form.name.trim()) {
    errors.name =
      "Name cannot start or end with spaces";

  } else if (/\s{2,}/.test(form.name)) {
    errors.name =
      "Name cannot contain multiple spaces";
  }

  // EMAIL
  if (!form.email.trim()) {
    errors.email = "Email is required";

  } else if (form.email !== form.email.trim()) {
    errors.email =
      "Email cannot start or end with spaces";

  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  ) {
    errors.email = "Enter a valid email";
  }

  return errors;
};