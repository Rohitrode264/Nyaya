import { useState } from "react";
import {
  Scale,
  MessageCircle,
  FileText,
  Shield,
  PenSquare,
  Menu,
} from "lucide-react";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Legal Guidance",
      subtitle: "Instant, Reliable, Accessible",
      description:
        "Get clear, precise, and easy-to-understand legal insights powered by advanced AI trained on Indian legal frameworks.",
      benefits: [
        "24/7 availability",
        "Multi-language support",
        "Simplified explanations",
        "Personalized responses",
      ],
      accent: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Document Analysis",
      subtitle: "Understand Every Clause",
      description:
        "Upload contracts, agreements, or notices. Our AI highlights important sections, identifies risks, and provides plain-English summaries.",
      benefits: [
        "Accurate OCR extraction",
        "Key clause identification",
        "Actionable insights",
        "Risk evaluation",
      ],
      accent: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Tenant Protection Tools",
      subtitle: "Safeguard Your Rights",
      description:
        "Step-by-step legal support for tenants. Access ready-to-use notice templates, rights explanations, and compliance-friendly guidance.",
      benefits: [
        "Customizable templates",
        "Clear rights overview",
        "Local law alignment",
        "Practical next steps",
      ],
      accent: "from-red-500 to-pink-500",
    },
    {
      icon: <PenSquare className="w-8 h-8" />,
      title: "One-Click Blog Publishing",
      subtitle: "Turn Chats into Stories",
      description:
        "After finishing a conversation with our AI, publish your story directly to Nyaya’s blog with a single click. The system automatically summarizes the chat, removes sensitive details, and creates a clean, shareable post.",
      benefits: [
        "Automatic summarization",
        "Privacy protection",
        "Community knowledge sharing",
        "Seamless publishing",
      ],
      accent: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-5 border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-black rounded-lg flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Nyaya</h1>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Features
            </a>
            <button className="px-5 py-2  rounded-lg font-medium bg-white text-black">
              Login
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium">
              Login
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-4 flex flex-col space-y-3 md:hidden">
            <a href="#" className="text-gray-400 hover:text-white">
              Features
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              About
            </a>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="px-6 py-32 text-center mb-24">
        <h1 className="text-4xl sm:text-6xl p-4 font-extrabold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Legal Help. Simplified.
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">
          Get instant AI-powered legal guidance that’s clear, fast, and accessible.
        </p>
        <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
          Powerful Features at Your Fingertips
        </h2>
        <div className="space-y-16">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row ${
                i % 2 ? "md:flex-row-reverse" : ""
              } gap-10`}
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${f.accent} rounded-lg flex items-center justify-center`}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{f.title}</h3>
                    <p className="text-gray-400">{f.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-400">{f.description}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {f.benefits.map((b, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-gray-400 text-sm"
                    >
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl h-52 flex items-center justify-center">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${f.accent} rounded-lg flex items-center justify-center`}
                  >
                    {f.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gradient-to-b from-black to-gray-900 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Take the First Step Towards Smarter Legal Help
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Nyaya empowers you with accessible, AI-driven legal solutions tailored to your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition">
            Get Started
          </button>
          <button className="px-8 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-white transition">
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-800 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-gray-400" />
            <span>© 2025 Nyaya</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
