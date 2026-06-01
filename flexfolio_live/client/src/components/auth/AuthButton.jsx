export default function AuthButton({
  children,
  loading,
  disabled,
  isCredentialLogin,
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      {...props}
      className="
        w-full h-12 rounded-xl bg-black text-white
        font-semibold transition
        hover:opacity-90
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {loading && isCredentialLogin ? "Please wait..." : children}
    </button>
  );
}