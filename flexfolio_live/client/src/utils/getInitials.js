export function getInitials(fullName) {
  if (!fullName) return "";

  const nameParts = fullName.trim().split(" ").filter(Boolean);

  if (nameParts.length === 1) {
    return nameParts[0][0].toUpperCase();
  }

  const first = nameParts[0][0];
  const last = nameParts[nameParts.length - 1][0];

  return (first + last).toUpperCase();
}