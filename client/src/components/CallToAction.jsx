import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <div className="bg-slate-950 dark:bg-white p-16 rounded-lg text-center mt-20 relative overflow-hidden border border-slate-900 dark:border-slate-100">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="relative z-10 space-y-8">
        <h2 className="text-3xl md:text-5xl font-black text-white dark:text-slate-950 uppercase tracking-tighter leading-none">
          Ready to commence your <span className="text-slate-600 italic font-serif lowercase tracking-normal">chronicle?</span>
        </h2>
        <p className="text-slate-400 dark:text-slate-600 mb-10 max-w-xl mx-auto font-bold tracking-tight italic">
          Join the professional-grade ecosystem for deep technical insights and high-fidelity storytelling.
        </p>
        <Link to="/search">
          <button className="px-10 py-5 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
            Explore All Entries
          </button>
        </Link>
      </div>
    </div>
  );
}