export const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150";
  return `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${path}`;
};