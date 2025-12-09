export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              RupeeMate
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your Smart Money Companion
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl w-full">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
              <p className="text-gray-600">
                Keep track of every rupee you spend with smart categorization
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Split Bills</h3>
              <p className="text-gray-600">
                Easily split expenses with friends and settle up hassle-free
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
              <p className="text-gray-600">
                Get AI-powered insights about your spending patterns
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <button className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-lg transition-all hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Tech Stack Badge */}
          <div className="mt-16 text-sm text-gray-500">
            Built with Next.js 15 + TypeScript + Tailwind CSS
          </div>
        </div>
      </main>
    </div>
  );
}
