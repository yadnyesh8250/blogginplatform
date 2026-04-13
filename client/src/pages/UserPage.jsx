import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import PostCard from '../components/PostCard';
import { HiOutlineMail, HiOutlineGlobeAlt, HiOutlineLightningBolt, HiOutlineHeart, HiOutlineBookOpen } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { api } from '../utils/api.config';

export default function UserPage() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        setLoading(true);
        // Fetch user data and stats
        const res = await api(`/api/user/stats/${userId}`);
        const data = await res.json();
        if (!res.ok) { setError(true); setLoading(false); return; }
        setUser(data);

        // Fetch user's posts
        const postsRes = await api(`/api/post/getposts?userId=${userId}`);
        const postsData = await postsRes.json();
        if (postsRes.ok) setUserPosts(postsData.posts);

        setLoading(false);
      } catch (error) { setError(true); setLoading(false); }
    };
    fetchUserAndStats();
  }, [userId]);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen bg-white dark:bg-slate-950'>
        <div className='w-12 h-px bg-slate-200 dark:bg-slate-800 animate-[width_2s_ease-in-out_infinite] overflow-hidden'>
           <div className='w-full h-full bg-slate-950 dark:bg-white animate-[slide_2s_infinite]'></div>
        </div>
      </div>
    );

  if (error || !user)
    return (
      <div className='flex justify-center items-center min-h-screen text-slate-400 uppercase tracking-widest text-xs font-black'>
        Author Not Found
      </div>
    );

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 transition-colors duration-700'>
      
      {/* ── Author Hero (Profile) ── */}
      <header className='relative pt-48 pb-32 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50'>
         <div className='absolute inset-0 opacity-5 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
         
         <div className='max-w-7xl mx-auto px-6 relative z-10'>
            <div className='flex flex-col md:flex-row items-center md:items-end gap-12'>
               {/* Avatar */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className='w-48 h-48 rounded bg-slate-950 dark:bg-white border-[12px] border-white dark:border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden'
               >
                  <img src={user.profilePicture} alt={user.username} className='w-full h-full object-cover grayscale-[0.2]' />
               </motion.div>

               {/* Profile Identity */}
               <div className='flex-1 text-center md:text-left space-y-4'>
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <h1 className='text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none'>
                       {user.username}
                    </h1>
                    {user.isAdmin && (
                      <span className='px-4 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest h-fit mt-2'>Verified Admin</span>
                    )}
                  </div>
                  <p className='text-sm font-black uppercase tracking-[0.4em] text-slate-400'>
                    {user.specialty || 'Contributing Author'} <span className='mx-4 opacity-20'>/</span> Joined {new Date(user.createdAt).getFullYear()}
                  </p>
               </div>

               {/* Impact Stats */}
               <div className='grid grid-cols-2 gap-4 w-full md:w-auto'>
                  <StatCard icon={<HiOutlineBookOpen className='text-xl' />} label='Volume' value={user.postCount || 0} unit='POSTS' />
                  <StatCard icon={<HiOutlineHeart className='text-xl' />} label='Engagement' value={user.totalLikes || 0} unit='LIKES' />
               </div>
            </div>
         </div>
      </header>

      {/* ── Author Bio & Feed ── */}
      <main className='max-w-7xl mx-auto px-6 py-32'>
         <div className='grid grid-cols-1 lg:grid-cols-12 gap-24'>
            
            {/* Sidebar metadata */}
            <aside className='lg:col-span-4 space-y-16'>
               <div className='space-y-10'>
                  <div className='flex items-center gap-4 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.5em]'>
                    <div className='w-2 h-2 bg-slate-950 dark:bg-white'></div>
                    Biography
                  </div>
                  <p className='text-xl font-serif italic text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 pl-8 border-slate-100 dark:border-slate-800'>
                     {user.bio || 'This author has not provided a biography yet. Their work on Blogify represents a dedication to great storytelling.'}
                  </p>
               </div>

               <div className='space-y-10'>
                  <div className='flex items-center gap-4 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.5em]'>
                    <div className='w-2 h-2 bg-slate-950 dark:bg-white'></div>
                    Account Details
                  </div>
                  <div className='space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                     <div className='flex items-center gap-4 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer pb-4 border-b border-slate-50 dark:border-slate-900'>
                        <HiOutlineMail size={18} /> {user.email}
                     </div>
                     <div className='flex items-center gap-4 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-900 pb-4'>
                        <HiOutlineGlobeAlt size={18} /> Public Profile
                     </div>
                     <div className='flex items-center gap-4 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer'>
                        <HiOutlineLightningBolt size={18} /> Total Views: {user.totalViews || 0}
                     </div>
                  </div>
               </div>
            </aside>

            {/* Main Content Feed */}
            <div className='lg:col-span-8'>
               <div className='flex items-center justify-between mb-16'>
                  <h2 className='text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>Recent Posts</h2>
                  <div className='h-px flex-1 mx-10 bg-slate-100 dark:bg-slate-900 opacity-50'></div>
                  <span className='text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest'>{userPosts.length} Articles</span>
               </div>

               <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => <PostCard key={post._id} post={post} />)
                  ) : (
                    <div className='col-span-2 py-32 border-2 border-dashed border-slate-100 dark:border-slate-900 rounded flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 space-y-4'>
                        <HiOutlineBookOpen size={48} />
                        <p className='text-xs font-black uppercase tracking-widest'>No Articles Found</p>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </main>

    </div>
  );
}

function StatCard({ icon, label, value, unit }) {
  return (
    <div className='bg-white dark:bg-slate-900 p-8 rounded border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 min-w-[140px]'>
       <div className='flex justify-between items-center text-slate-300 dark:text-slate-700'>
          {icon}
          <span className='text-[9px] font-black uppercase tracking-widest'>{label}</span>
       </div>
       <div>
          <div className='text-4xl font-black text-slate-950 dark:text-white leading-none mb-1'>{value}</div>
          <div className='text-[8px] font-black uppercase tracking-[0.3em] text-slate-400'>{unit}</div>
       </div>
    </div>
  )
}
