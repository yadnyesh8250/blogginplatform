import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlinePencilAlt, HiOutlineGlobe, HiOutlineClipboardList, HiOutlineShieldCheck, HiOutlineAdjustments } from 'react-icons/hi';
import PostCard from '../components/PostCard';
import CallToAction from '../components/CallToAction';
import { useSelector } from 'react-redux';
import { api } from '../utils/api.config';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api('/api/post/getPosts?limit=6&status=published');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    };
    const fetchSettings = async () => {
      const res = await api('/api/settings/get');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    };
    fetchPosts();
    fetchSettings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden'>
      {/* ── Minimalist Hero ── */}
      <section className='relative pt-32 pb-40 md:pt-48 md:pb-60 border-b border-slate-100 dark:border-slate-900/50'>
        <div className='max-w-7xl mx-auto px-6 text-center z-10 relative'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='space-y-12'
          >
            <motion.div
              variants={itemVariants}
              className='inline-flex items-center gap-3 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 glass dark:glass-dark'
            >
              Digital Publishing Made Simple
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className='text-6xl md:text-[10rem] font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter uppercase'
            >
              {settings?.siteTitle || 'Blogify'}{' '}
              <span className='block text-indigo-500 italic font-serif lowercase tracking-normal bg-transparent'>
                articles.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className='max-w-2xl mx-auto text-lg md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-bold tracking-tight'
            >
              {settings?.siteTagline || 'A minimalist blogging platform built for storytellers, developers, and creative visionaries.'}
            </motion.p>

            <motion.div variants={itemVariants} className='flex flex-wrap justify-center items-center gap-6 pt-10'>
              {currentUser ? (
                <Link to='/create-post'>
                  <button className='flex items-center gap-3 px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-3d-hover active:scale-95 transition-all'>
                    <HiOutlinePencilAlt size={20} />
                    Write New Post
                  </button>
                </Link>
              ) : (
                <Link to='/sign-up'>
                  <button className='flex items-center gap-3 px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-3d-hover active:scale-95 transition-all'>
                    Get Started
                  </button>
                </Link>
              )}
              
              <Link to='/search'>
                <button className='flex items-center gap-3 px-12 py-6 bg-white dark:bg-slate-950 border border-slate-900 dark:border-white text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 transition-all rounded-2xl'>
                  Browse Archive
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient Background Glows */}
        <div className='absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse' />
        <div className='absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] -z-10 animate-pulse' style={{ animationDelay: '2s' }} />
      </section>

      {/* ── Modern Features ── */}
      <section className='bg-white dark:bg-slate-950 py-40'>
        <motion.div 
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'
        >
          <FeatureBlock 
             variants={itemVariants}
             icon={<HiOutlineAdjustments />}
             title='Dynamic Themes'
             desc='Personalize every post with unique fonts, colors, and premium editorial layouts.'
          />
          <FeatureBlock 
             variants={itemVariants}
             icon={<HiOutlineClipboardList />}
             title='Content Control'
             desc='Manage your drafts, schedule publishing, and live broadcasts effortlessly.'
          />
          <FeatureBlock 
             variants={itemVariants}
             icon={<HiOutlineShieldCheck />}
             title='Secure Access'
             desc='Robust authentication and high-performance data encryption for your privacy.'
          />
          <FeatureBlock 
             variants={itemVariants}
             icon={<HiOutlineGlobe />}
             title='Fast Delivery'
             desc='Optimized for performance to ensure your stories load instantly everywhere.'
          />
        </motion.div>
      </section>

      {/* ── Story Feed ── */}
      <section className='bg-slate-50 dark:bg-slate-900/40 py-40 border-y border-slate-100 dark:border-slate-800/50'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='flex flex-col md:flex-row justify-between items-end mb-24 gap-8'
          >
             <div className='space-y-4 max-w-xl'>
                <div className='text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em]'>Latest Stories</div>
                <h2 className='text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>
                   Recent Posts<span className='text-slate-300 dark:text-slate-700'>.</span>
                </h2>
             </div>
             <Link to='/search' className='group flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.3em]'>
               Full Archive <HiArrowRight className='group-hover:translate-x-2 transition-transform' />
             </Link>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='mt-40'
          >
             <CallToAction />
          </motion.div>
        </div>
      </section>

      {/* ── Professional Statistics ── */}
      <section className='bg-slate-950 dark:bg-black py-40 relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-6 relative z-10'>
          <motion.div 
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
            className='grid grid-cols-1 md:grid-cols-4 gap-20 text-center'
          >
            <StatItem variants={itemVariants} label='Active Authors' value='1,200+' />
            <StatItem variants={itemVariants} label='Global Uptime' value='99.9%' />
            <StatItem variants={itemVariants} label='Total Views' value='8.4M' />
            <StatItem variants={itemVariants} label='Latency' value='<10ms' />
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className='mt-32 text-center space-y-12'
          >
             <h3 className='text-4xl md:text-6xl font-black text-white uppercase tracking-tighter max-w-4xl mx-auto leading-tight'>Accelerate your <span className='text-indigo-500 italic font-serif lowercase tracking-normal'>digital</span> storytelling workflow.</h3>
             <Link to='/sign-up'>
                <button className='px-16 py-7 bg-white text-slate-950 font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-3d-hover rounded-2xl'>
                   Get Started Now
                </button>
             </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureBlock({ icon, title, desc, variants }) {
  return (
    <motion.div variants={variants} className='group space-y-8 glass dark:glass-dark p-8 rounded-3xl border-transparent hover:border-indigo-500/30 transition-all'>
       <div className='w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl text-slate-900 dark:text-white group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm'>
          {icon}
       </div>
       <div className='space-y-4'>
          <h3 className='text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors'>{title}</h3>
          <p className='text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed tracking-tight'>{desc}</p>
       </div>
    </motion.div>
  )
}

function StatItem({ label, value, variants }) {
  return (
    <motion.div variants={variants} className='space-y-4'>
       <div className='text-5xl md:text-7xl font-black text-white tracking-tighter uppercase'>{value}</div>
       <div className='text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500'>{label}</div>
    </motion.div>
  )
}
