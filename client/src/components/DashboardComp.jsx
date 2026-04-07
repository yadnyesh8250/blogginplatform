import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiArrowNarrowUp,
  HiChatAlt,
  HiDocumentText,
  HiOutlineUserGroup,
  HiTrendingUp,
} from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api.config';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api('/api/dashboard');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setPosts(data.posts);
          setComments(data.comments);
          setTotalUsers(data.totalUsers);
          setTotalPosts(data.totalPosts);
          setTotalComments(data.totalComments);
          setLastMonthUsers(data.lastMonthUsers);
          setLastMonthPosts(data.lastMonthPosts);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className='p-6 md:p-10 max-w-7xl mx-auto space-y-12'>
      {/* ── Welcome Header ── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='flex flex-col md:flex-row md:items-center justify-between gap-6'
      >
        <div className='space-y-1'>
          <h1 className='text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase'>
            Analytics <span className='text-indigo-600 dark:text-indigo-400 italic font-serif lowercase tracking-normal'>overview.</span>
          </h1>
          <p className='text-slate-500 font-bold tracking-tight'>Welcome back, {currentUser.username}. Here is your site performance summary.</p>
        </div>
        <div className='flex gap-3'>
          <Link to='/dashboard?tab=posts'>
            <button className='px-6 py-3 rounded-2xl glass dark:glass-dark border border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95'>
              Manage Content
            </button>
          </Link>
          <Link to='/create-post'>
            <button className='px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:opacity-90 transition-all active:scale-95'>
              New Article
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ── Stats Overview ── */}
      <motion.div 
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'
      >
        <StatCard 
          variants={itemVariants}
          title="Total Users" 
          value={totalUsers} 
          lastMonth={lastMonthUsers} 
          icon={<HiOutlineUserGroup className='bg-indigo-500 text-white rounded-2xl p-4 shadow-xl' size={56} />}
        />
        <StatCard 
          variants={itemVariants}
          title="Total Comments" 
          value={totalComments} 
          lastMonth={lastMonthComments} 
          icon={<HiChatAlt className='bg-pink-500 text-white rounded-2xl p-4 shadow-xl' size={56} />}
        />
        <StatCard 
          variants={itemVariants}
          title="Total Articles" 
          value={totalPosts} 
          lastMonth={lastMonthPosts} 
          icon={<HiDocumentText className='bg-emerald-500 text-white rounded-2xl p-4 shadow-xl' size={56} />}
        />
      </motion.div>

      {/* ── Detailed Activity ── */}
      {!currentUser.isAdmin ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='p-16 md:p-32 text-center space-y-8 glass dark:glass-dark rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm'
        >
           <div className='w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto text-indigo-500'>
              <HiOutlineUserGroup size={48} />
           </div>
           <div className='space-y-4'>
              <h3 className='text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>Administrator View Only</h3>
              <p className='text-slate-500 max-w-md mx-auto font-bold leading-relaxed tracking-tight'>
                Detailed site analytics and management controls are reserved for site administrators. 
                Manage your user content via the Posts and Profile tabs.
              </p>
           </div>
        </motion.div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10'>
          {/* Recent Users */}
          <ActivityBox title="Recent Users" link="/dashboard?tab=users">
             <div className='space-y-6'>
               {users.length > 0 ? users.map(user => (
                 <div key={user._id} className='flex items-center justify-between group p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl transition-all'>
                   <div className='flex items-center gap-5'>
                      <div className='w-12 h-12 rounded-2xl overflow-hidden glass p-0.5 border border-slate-200 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110'>
                         <img src={user.profilePicture} alt={user.username} className='w-full h-full rounded-[14px] object-cover' />
                      </div>
                      <p className='text-sm font-black text-slate-700 dark:text-slate-200 truncate capitalize tracking-tight'>{user.username}</p>
                   </div>
                   <div className='text-[10px] font-black text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm'>
                     {user.isAdmin ? 'Admin' : 'Author'}
                   </div>
                 </div>
               )) : <p className='text-xs text-slate-400 italic text-center py-10'>No recent users found.</p>}
             </div>
          </ActivityBox>

          {/* Recent Comments */}
          <ActivityBox title="Recent Comments" link="/dashboard?tab=comments">
             <div className='space-y-6'>
               {comments.length > 0 ? comments.map(comment => (
                 <div key={comment._id} className='glass dark:glass-dark p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all shadow-sm'>
                   <p className='text-xs text-slate-600 dark:text-slate-400 italic line-clamp-2 leading-relaxed font-medium capitalize'>"{comment.content}"</p>
                   <div className='flex items-center justify-between mt-5 text-[10px] font-black uppercase tracking-widest'>
                      <span className='text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg'>Auth: {comment.userId.slice(-6)}</span>
                      <span className='text-pink-500 flex items-center gap-2 bg-pink-500/10 px-3 py-1.5 rounded-lg'>❤️ {comment.numberOfLikes}</span>
                   </div>
                 </div>
               )) : <p className='text-xs text-slate-400 italic text-center py-10'>No recent comments found.</p>}
             </div>
          </ActivityBox>

          {/* Recent Articles */}
          <ActivityBox title="Recent Articles" link="/dashboard?tab=posts" className="lg:col-span-2 xl:col-span-1">
             <div className='space-y-6'>
               {posts.length > 0 ? posts.map(post => (
                 <Link to={`/post/${post.slug}`} key={post._id} className='flex items-center gap-6 group'>
                   <div className='w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 glass p-1.5 shadow-sm border border-slate-200 dark:border-slate-800'>
                      <img src={post.image} alt={post.title} className='w-full h-full object-cover group-hover:scale-110 transition-transform rounded-[14px]' />
                   </div>
                   <div className='min-w-0 flex-1 border-b border-slate-100 dark:border-slate-800/50 pb-5 group-last:border-0 group-hover:border-indigo-500/30 transition-all'>
                      <p className='text-sm font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-500 transition-colors uppercase tracking-tight'>{post.title}</p>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5'>{post.category}</p>
                   </div>
                 </Link>
               )) : <p className='text-xs text-slate-400 italic text-center py-10'>No recent posts found.</p>}
             </div>
          </ActivityBox>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, lastMonth, icon, variants }) {
  return (
    <motion.div variants={variants} className='glass dark:glass-dark p-10 rounded-[2.5rem] shadow-3d-hover group relative overflow-hidden transition-all duration-500 border-2 border-transparent hover:border-indigo-500/10'>
      <div className='flex justify-between items-start relative z-10'>
        <div className='space-y-2'>
          <h3 className='text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]'>{title}</h3>
          <p className='text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter'>{value}</p>
        </div>
        <div className='transform group-hover:rotate-12 transition-transform duration-500'>
          {icon}
        </div>
      </div>
      <div className='flex items-center gap-4 mt-10 text-xs font-black relative z-10 uppercase tracking-widest'>
        <span className='text-emerald-500 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl'>
          <HiTrendingUp size={14} /> +{lastMonth}
        </span>
        <span className='text-slate-400 text-[9px]'>Increased Growth</span>
      </div>
      {/* Decorative Glow */}
      <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700' />
    </motion.div>
  );
}

function ActivityBox({ title, children, link, className = '' }) {
  return (
    <div className={`glass dark:glass-dark rounded-[2.5rem] p-10 space-y-10 shadow-sm border border-slate-100 dark:border-slate-800/50 ${className}`}>
       <div className='flex items-center justify-between'>
          <h3 className='font-black text-xl text-slate-900 dark:text-white uppercase tracking-tighter'>{title}</h3>
          <Link to={link}>
             <button className='px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-widest text-[9px] shadow-sm hover:scale-105 active:scale-95 transition-all'>
               View All
             </button>
          </Link>
       </div>
       {children}
    </div>
  );
}
