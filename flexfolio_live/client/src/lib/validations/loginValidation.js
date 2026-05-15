export const validateLogin = (form) => {
  const errors = {};

  // EMAIL
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (form.email !== form.email.trim()) {
    errors.email = "Email cannot contain spaces";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email";
  }

  // PASSWORD
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password !== form.password.trim()) {
    errors.password = "Password cannot start or end with spaces";
  } else if (/\s/.test(form.password)) {
    errors.password = "Password cannot contain spaces";
  }

  return errors;
};