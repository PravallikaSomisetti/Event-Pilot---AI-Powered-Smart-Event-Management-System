import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";

function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="bg-blue-500/20 px-4 py-2 rounded-full">
            🚀 AI Powered Platform
          </span>

          <h1 className="mt-6 text-6xl font-extrabold leading-tight">

            Smart Event
            <br />

            <span className="text-blue-400">

              Management

            </span>

          </h1>

          <p className="mt-8 text-lg text-slate-300 max-w-xl">

            Create events, register participants,
            predict attendance using AI,
            manage QR check-ins and analyze feedback
            from one intelligent dashboard.

          </p>

          <div className="flex gap-4 mt-10">

            <Link to="/register">
              <Button>Get Started</Button>
            </Link>

            <Link to="/login">
              <Button variant="secondary">
                Login
              </Button>
            </Link>

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >

          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900"
            alt="Conference"
            className="rounded-3xl shadow-2xl"
          />

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;