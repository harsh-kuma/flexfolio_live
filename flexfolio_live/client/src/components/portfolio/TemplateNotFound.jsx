export default function TemplateNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-slate-800 mb-4">
          404
        </h1>

        <p className="text-xl font-semibold text-slate-700 mb-2">
          Template Not Found
        </p>

        <p className="text-slate-500 mb-6">
          The requested template does not exist.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}