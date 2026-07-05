import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  CalendarCheck,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  Users,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  Heart,
  ChevronRight
} from "lucide-react";

function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl -z-10" />

      {/* Header / Navbar */}
      <header className="sticky top-0 bg-slate-950/70 backdrop-blur-md border-b border-slate-900 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            EventPilot <span className="text-xs bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-500/20">AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#ai-highlights" className="hover:text-white transition">AI Insights</a>
            <a href="#stats" className="hover:text-white transition">Platform Stats</a>
            <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
            <a href="#about" className="hover:text-white transition">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-400 hover:text-white transition text-sm font-medium">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              Get Started <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-400 mb-2"
          >
            <Sparkles size={14} className="animate-pulse text-purple-400" />
            Next-Gen Event Operations Powered by AI
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
          >
            Create, Manage, and Optimize <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Smart Events Effortlessly
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto"
          >
            EventPilot handles registrations, QR passes, real-time check-ins, and analytics. 
            Train predictive models and run sentiment analysis on user feedback automatically.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-indigo-500/20 transition flex items-center justify-center gap-2 group text-base"
            >
              Get Started Free 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-8 py-4 rounded-xl font-semibold transition flex items-center justify-center"
            >
              Explore Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics Row */}
      <section id="stats" className="border-y border-slate-900 bg-slate-950/50 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">28k+</p>
            <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase">Tickets Issued</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">98.4%</p>
            <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase">Scan Accuracy</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">95%</p>
            <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase">Predictive Success</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">4.9/5</p>
            <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase">User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for modern event organizers.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Packed with features that take the manual labor out of registration and checking.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 p-8 rounded-2xl transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                <CalendarCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Seamless Management</h3>
              <p className="text-slate-400 text-sm">
                Create, edit, cancel, and publish events easily. Set capacities, locations, deadlines, and view all active participants in dynamic tables.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
              Learn more <ChevronRight size={14} />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 p-8 rounded-2xl transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">QR Code Check-ins</h3>
              <p className="text-slate-400 text-sm">
                Generate unique QR passes upon registration. Organizers scan them instantly using any device camera to log attendance, preventing duplicates.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-purple-400 hover:underline cursor-pointer">
              Learn more <ChevronRight size={14} />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 hover:border-pink-500/50 p-8 rounded-2xl transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-pink-600/10 border border-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Excel & PDF Reports</h3>
              <p className="text-slate-400 text-sm">
                Download fully formatted Excel sheets or professional PDFs listing check-in times, registered users, and feedback scores for stakeholders.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-pink-400 hover:underline cursor-pointer">
              Learn more <ChevronRight size={14} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* AI Highlights Section */}
      <section id="ai-highlights" className="bg-slate-900/30 border-t border-slate-900 py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-400">
              <Brain size={14} /> AI Engine Core
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Predictive Models & <br /> Sentiment Intelligence
            </h2>
            <p className="text-slate-400 leading-relaxed">
              EventPilot doesn't just display lists. It uses advanced machine learning models (trained on historical patterns) to forecast event attendance rates instantly. It also runs sentiment classification on comments, grouping keywords and suggesting improvements.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Attendance Forecasts</h4>
                  <p className="text-slate-400 text-sm">ML model predicts the check-in percentage based on category, registrations, and date/time.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Feedback Sentiment Matrix</h4>
                  <p className="text-slate-400 text-sm">Classifies reviews as Positive, Neutral, or Negative. Displays keywords and generates actionable recommendations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphic/Demo Dashboard Widget Mockup */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl -z-10" />
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
              <span className="font-semibold text-slate-200">AI Predictive Module</span>
              <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Attendance Predictor</p>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-4xl font-extrabold text-white">92.4%</p>
                  <p className="text-xs text-slate-400">Confidence Rate: <span className="text-green-400 font-bold">95%</span></p>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: "92.4%" }} />
                </div>
                <p className="text-slate-500 text-[11px] mt-2 font-medium">Estimated attendees: 185 / 200 registered.</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Sentiment Analyser</p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded-xl">
                    <span className="text-xs text-green-400 font-bold">78%</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Positive</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-xs text-slate-300 font-bold">15%</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Neutral</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                    <span className="text-xs text-red-400 font-bold">7%</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Negative</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-850 flex gap-2 items-center">
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold">"Interactive"</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold">"Speakers"</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold">"Awesome"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-28 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Loved by event coordinators.</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            See what actual team leads are saying about EventPilot.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-905 border border-slate-850 p-8 rounded-2xl relative">
            <div className="flex gap-1 text-yellow-400 mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              "We managed a 500-attendee developer event with EventPilot. The QR code check-in was fast and flawless—we checked in 10 people per minute. The attendance report and prediction model were extremely handy!"
            </p>
            <div>
              <p className="font-bold text-white text-sm">Marcus Vance</p>
              <p className="text-slate-500 text-xs">Director, DevTech Summit</p>
            </div>
          </div>

          <div className="bg-slate-905 border border-slate-850 p-8 rounded-2xl relative">
            <div className="flex gap-1 text-yellow-400 mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              "The sentiment analysis feedback tool is incredible. We discovered immediately that the attendees didn't like the cold temperature and wanted more interactive labs. Definitely using it for all our future events."
            </p>
            <div>
              <p className="font-bold text-white text-sm">Clara Oswald</p>
              <p className="text-slate-500 text-xs">Head of Culture, Vercel Hub</p>
            </div>
          </div>

          <div className="bg-slate-905 border border-slate-850 p-8 rounded-2xl relative">
            <div className="flex gap-1 text-yellow-400 mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              "The integration of drag-and-drop calendars and analytics charts makes EventPilot a complete solution. It has saved our administration team over 25 hours per month in Excel cleanups and data formatting."
            </p>
            <div>
              <p className="font-bold text-white text-sm">Nathan Drake</p>
              <p className="text-slate-500 text-xs">Admin, Global Sports Guild</p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Contact Section */}
      <section id="about" className="bg-slate-950/50 border-t border-slate-900 py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">About EventPilot</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              EventPilot was engineered to bridge the gap between traditional registration platforms and analytical tools. By incorporating modern ML models and sentiment classifiers alongside essential features like QR code scanning and calendar views, EventPilot guarantees a premium event check-in and analysis flow.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Created for organizers who value time, security, and insight, our platform supports JWT role-based controls, downloadable reports (Excel, CSV, PDF), and sleek responsive dashboard designs.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Contact EventPilot Support</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! We will reach out to you shortly."); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input required type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                <textarea required rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="How can we help you?" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-750 text-white py-3.5 rounded-xl font-semibold transition text-sm">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 EventPilot Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;