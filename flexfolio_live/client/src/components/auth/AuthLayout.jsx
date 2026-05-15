export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
        <div className="hidden lg:flex bg-gradient-to-br from-black to-slate-900 text-white p-12 flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold">Flexfolio</h1>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Build your professional portfolio with modern templates,
              analytics, custom domains and AI-powered tools.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              Trusted by creators and developers.
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              Production-level portfolio SaaS platform.
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="text-slate-500 mt-2">
              {subtitle}
            </p>

            <div className="mt-8 space-y-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}