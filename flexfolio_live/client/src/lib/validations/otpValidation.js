export const validateOTP = (form) => {
  const errors = {};
  const trimmedOtp = form.otp.trim();
  if (!trimmedOtp) {
    errors.otp = "OTP is required";
  } else if (trimmedOtp.length !== 6) {
    errors.otp = "OTP must be 6 digits";
  } else if(/\s/.test(trimmedOtp)){
    errors.otp = "OTP cannot contain spaces";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password !== form.password.trim()) {
    errors.password = "Password cannot start or end with spaces";
  } else if (/\s/.test(form.password)) {
    errors.password = "Password cannot contain spaces";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }else if (!/[A-Z]/.test(form.password)) {
    errors.password = "Password must contain one uppercase letter";
  } else if (!/[a-z]/.test(form.password)) {
    errors.password = "Password must contain one lowercase letter";
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = "Password must contain one number";
  } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(form.password)) {
    errors.password = "Password must contain one special character";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};