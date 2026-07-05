function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-12">
          <h1 className="text-5xl font-bold mb-6">
            EventPilot
          </h1>

          <p className="text-lg leading-8 text-blue-100">
            AI-powered smart event management for registrations,
            attendance tracking, analytics, and insights.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-10 lg:p-14">
          <h2 className="text-3xl font-bold">{title}</h2>

          <p className="text-gray-500 mt-2 mb-8">
            {subtitle}
          </p>

          {children}
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;