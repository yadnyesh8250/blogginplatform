import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin, BsArrowUp } from 'react-icons/bs';
import { useEffect, useState } from "react";
import { api } from '../utils/api.config';

export default function FooterComp() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api('/api/settings/get');
        const data = await res.json();
        if (res.ok) setSettings(data);
      } catch (error) { console.log(error.message); }
    };
    fetchSettings();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white dark:bg-black text-slate-400 pt-32 pb-20 border-t border-slate-100 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-10 uppercase tracking-tighter">
            <Link to ="/" className='flex items-center gap-4 group'>
              <div className='w-12 h-12 bg-slate-900 dark:bg-white rounded flex items-center justify-center transition-transform group-hover:-rotate-6'>
                 <span className="text-white dark:text-slate-950 text-xl font-black">B</span>
              </div>
              <span className='text-3xl font-black text-slate-900 dark:text-white'>
                {settings?.siteTitle || 'Blogify'}<span className="text-slate-300">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-bold tracking-tight text-slate-500 dark:text-slate-400 normal-case">
              {settings?.siteTagline || "A professional-grade blogging platform designed for storytellers, engineers, and creators who value aesthetics and performance."}
            </p>
            <div className="flex gap-6">
              {settings?.socialLinks?.facebook && <a href={settings.socialLinks.facebook} className="text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"><BsFacebook size={18} /></a>}
              {settings?.socialLinks?.twitter && <a href={settings.socialLinks.twitter} className="text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"><BsTwitter size={18} /></a>}
              {settings?.socialLinks?.instagram && <a href={settings.socialLinks.instagram} className="text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"><BsInstagram size={18} /></a>}
              {settings?.socialLinks?.linkedin && <a href={settings.socialLinks.linkedin} className="text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"><BsLinkedin size={18} /></a>}
            </div>
          </div>

          {/* Spacer Component */}
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white italic opacity-40">Navigate</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <li><Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/search" className="hover:text-slate-900 dark:hover:text-white transition-colors">Discover</Link></li>
              <li><Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white italic opacity-40">Privacy</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <li><Link to="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Return Anchor */}
          <div className="md:col-span-3 flex md:justify-end items-start pt-2">
             <button 
              onClick={scrollToTop}
              className="group flex flex-col items-center gap-4 text-[9px] font-black uppercase tracking-[0.6em] text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-all"
             >
               <BsArrowUp className="text-xl group-hover:-translate-y-2 transition-transform" />
               Return To Top
             </button>
          </div>

        </div>

        {/* Global Footer Meta */}
        <div className="pt-20 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">
            {settings?.footerText || `© ${new Date().getFullYear()} ${settings?.siteTitle || 'Blogify'}. ALL RIGHTS RESERVED.`}
          </p>
          <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-200 dark:text-slate-800">
             <div className="flex items-center gap-4">
                <span>Infrastructure:</span>
                <span className="text-slate-900 dark:text-white uppercase">MERN</span>
             </div>
             <div className="flex items-center gap-4">
                <span>Rendering:</span>
                <span className="text-slate-900 dark:text-white uppercase">Tailwind</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
