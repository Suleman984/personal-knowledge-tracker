"use client";
import { useEffect, useState } from "react";
import { Brain, BookOpen, Bell, Search, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    router.push("/login");
    // alert("Redirecting to login...");
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800">KnowledgeTrack</span>
        </div>
        <button
          onClick={handleGetStarted}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className={`text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>Your Personal Knowledge Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Capture, Organize,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Remember Everything
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Transform scattered information into organized knowledge. Summarize content, set reminders, and never lose track of important information again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button
              onClick={handleLearnMore}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all border border-gray-200"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className={`mt-16 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Smart Summaries</h3>
                  <p className="text-sm text-gray-600">Automatically summarize articles and content</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <Bell className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Smart Reminders</h3>
                  <p className="text-sm text-gray-600">Never forget important information</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                    <Search className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quick Search</h3>
                  <p className="text-sm text-gray-600">Find anything in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage knowledge
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you stay organized and productive
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Access your knowledge base instantly. Search, filter, and organize with blazing speed.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Organization</h3>
              <p className="text-gray-600">
                Automatically categorize and tag your content. Let AI help you stay organized.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and secure. We respect your privacy and never share your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to organize your knowledge?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of users who never lose important information
              </p>
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                Start Free Today
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2025 KnowledgeTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}