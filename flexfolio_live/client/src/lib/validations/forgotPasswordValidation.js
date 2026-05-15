export const validateForgotPassword = (email) => {
  const errors = {};

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (/\s/.test(trimmedEmail)) {
    errors.email = "Email cannot contain spaces";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
  ) {
    errors.email = "Enter a valid email";
  }

  return errors;
};