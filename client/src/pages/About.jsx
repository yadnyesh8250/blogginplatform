import { motion } from 'framer-motion';
import { HiOutlineGlobe, HiOutlineTerminal, HiOutlineChartBar, HiOutlineLightningBolt } from 'react-icons/hi';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 transition-colors duration-700 font-sans overflow-hidden'>
      {/* ── Editorial Header ── */}
      <header className='relative pt-48 pb-40 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/10 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-6 relative z-10 text-center'>
          <motion.div 
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='flex flex-col gap-12'
          >
            <motion.div 
              variants={itemVariants}
              className='inline-flex items-center justify-center gap-4 text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em]'
            >
               Our Vision & Mission
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className='text-6xl md:text-9xl font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter uppercase mb-6'
            >
              The Blogify <span className='text-indigo-600 dark:text-indigo-500 italic font-serif lowercase tracking-normal bg-transparent'>Story.</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className='text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight'
            >
              “Empowering the next generation of digital storytellers through minimalist design and high-performance technology.”
            </motion.p>
          </motion.div>
        </div>

        {/* Ambient background accent */}
        <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-0' />
      </header>

      {/* ── Impact Statistics ── */}
      <section className='py-32 border-b border-slate-50 dark:border-slate-900'>
         <div className='max-w-7xl mx-auto px-6'>
            <motion.div 
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={containerVariants}
              className='grid grid-cols-1 md:grid-cols-4 gap-16'
            >
               <StatBlock variants={itemVariants} label='Active Readers' value='86.4K' unit='WEEKLY' />
               <StatBlock variants={itemVariants} label='Total Articles' value='12.2K' unit='ARCHIVED' />
               <StatBlock variants={itemVariants} label='Global Uptime' value='99.9%' unit='REAL-TIME' />
               <StatBlock variants={itemVariants} label='Custom Themes' value='12.0' unit='EDITORIAL' />
            </motion.div>
         </div>
      </section>

      {/* ── Core Philosophy ── */}
      <section className='py-48'>
         <div className='max-w-7xl mx-auto px-6'>
            <div className='space-y-40'>
               <div className='flex flex-col md:flex-row gap-24 items-start'>
                  <div className='md:w-1/3'>
                     <h2 className='text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none'>
                        Our Digital <br />Manifesto<span className='text-indigo-500'>.</span>
                     </h2>
                  </div>
                  <div className='md:w-2/3 space-y-12'>
                     <p className='text-2xl md:text-3xl text-slate-500 dark:text-slate-400 font-serif italic leading-relaxed'>
                        Blogify was built to solve a simple problem: the web is too noisy. We provide a clean, focused sanctuary for words to breathe and ideas to flourish.
                     </p>
                     <p className='text-lg text-slate-400 dark:text-slate-500 font-bold tracking-tight leading-loose'>
                        Our philosophy is centered on three core principles: Absolute Form, Fluid Performance, and Recursive Simplicity. Every feature we build is designed to minimize friction between the author’s mind and the reader’s soul.
                     </p>
                  </div>
               </div>

               {/* 🎨 Pillars of Excellence */}
               <motion.div 
                 initial='hidden'
                 whileInView='visible'
                 viewport={{ once: true, margin: '-100px' }}
                 variants={containerVariants}
                 className='grid grid-cols-1 md:grid-cols-3 gap-10'
               >
                  <PillarCard 
                     variants={itemVariants}
                     icon={<HiOutlineGlobe size={32} />} 
                     title="Global Reach" 
                     desc="Distributing your voice across a zero-latency worldwide content delivery network." 
                  />
                  <PillarCard 
                     variants={itemVariants}
                     icon={<HiOutlineTerminal size={32} />} 
                     title="Modern Stack" 
                     desc="Leveraging the MERN architecture to deliver sub-millisecond page loads and high security." 
                  />
                  <PillarCard 
                     variants={itemVariants}
                     icon={<HiOutlineLightningBolt size={32} />} 
                     title="Instant Feedback" 
                     desc="Real-time analytics and interaction protocols to track the deep resonance of your stories." 
                  />
               </motion.div>
            </div>
         </div>
      </section>

      {/* ── Brand Signature ── */}
      <footer className='pb-48 pt-32 text-center border-t border-slate-50 dark:border-slate-800/50'>
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='flex flex-col items-center gap-12'
          >
            <div className='w-px h-24 bg-slate-900 dark:bg-white opacity-10'></div>
            <div className='max-w-xl space-y-10'>
               <div className='w-24 h-24 bg-slate-900 dark:bg-white rounded-3xl mx-auto flex items-center justify-center text-white dark:text-slate-950 text-5xl font-black shadow-3d-hover'>B</div>
               <div className='space-y-4'>
                 <h3 className='text-[10px] font-black uppercase tracking-[0.8em] text-slate-300 dark:text-slate-700'>The Blogify Mark</h3>
                 <p className='text-xs font-black uppercase tracking-[0.2em] text-slate-400 max-w-xs mx-auto leading-loose'>
                    ESTABLISHED MMXXIV <br /> 
                    DESIGNED FOR THE BOLD.
                 </p>
               </div>
            </div>
         </motion.div>
      </footer>
    </div>
  );
}

function StatBlock({ label, value, unit, variants }) {
  return (
    <motion.div variants={variants} className='space-y-6'>
       <div className='h-px w-full bg-slate-100 dark:bg-slate-800'></div>
       <div className='text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500'>{label}</div>
       <div className='flex flex-col items-start'>
          <span className='text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>{value}</span>
          <span className='text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2'>{unit}</span>
       </div>
    </motion.div>
  )
}

function PillarCard({ icon, title, desc, variants }) {
  return (
    <motion.div variants={variants} className='glass dark:glass-dark p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all duration-500 shadow-sm hover:shadow-3d-hover'>
       <div className='text-indigo-500 transition-transform group-hover:-translate-y-2 group-hover:scale-110 mb-10'>
          {icon}
       </div>
       <h4 className='text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-6'>
          {title}
       </h4>
       <p className='text-sm font-bold text-slate-500 dark:text-slate-400 tracking-tight leading-relaxed italic'>
          {desc}
       </p>
    </motion.div>
  )
}
