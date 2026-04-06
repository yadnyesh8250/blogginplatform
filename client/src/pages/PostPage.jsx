import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { THEMES } from '../themes/themes';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { motion, useScroll, useSpring } from 'framer-motion';
import { api } from '../utils/api.config';
import { HiHeart, HiOutlineShare, HiOutlineBookmark, HiOutlineClock } from 'react-icons/hi';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [liked, setLiked] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await api(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  const handleLike = async () => {
    if (!post) return;
    try {
      const res = await api(`/api/post/likePost/${post._id}`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setPost({ ...post, likes: data.likes, numberOfLikes: data.likes.length });
        setLiked(!liked);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen bg-white dark:bg-slate-950'>
        <Spinner size='xl' />
      </div>
    );

  if (error || !post)
    return (
      <div className='flex justify-center items-center min-h-screen bg-white dark:bg-slate-950'>
        <div className='text-center space-y-6'>
          <h2 className='text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>Article Not Found</h2>
          <Link to='/search'>
            <Button color='gray' className='mx-auto rounded-xl font-black uppercase tracking-widest text-[10px]'>Back to Archive</Button>
          </Link>
        </div>
      </div>
    );

  const readingTime = post.content ? Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200) : 1;

  return (
    <main className='min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden'>
      {/* Scroll Progress Bar */}
      <motion.div
        className='fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-[60] shadow-[0_0_15px_rgba(79,70,229,0.5)]'
        style={{ scaleX }}
      />

      {/* ── Editorial Header ── */}
      <section className='relative pt-32 pb-24 md:pt-48 md:pb-40 border-b border-slate-100 dark:border-slate-800/50 overflow-hidden'>
        <div className='max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10'>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='inline-flex items-center gap-3 px-6 py-2 rounded-full glass dark:glass-dark border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 shadow-sm'
          >
            {post.category}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className='text-5xl md:text-8xl lg:text-[7rem] font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter uppercase'
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='flex flex-wrap items-center justify-center gap-10 pt-10'
          >
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 rounded-2xl overflow-hidden glass p-1 shadow-md border border-slate-200 dark:border-slate-800'>
                 <img src={post.userId.profilePicture} alt='author' className='w-full h-full object-cover rounded-[14px]' />
              </div>
              <div className='text-left'>
                <span className='block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5'>Published By</span>
                <span className='block text-md font-black text-slate-900 dark:text-white uppercase tracking-tight'>{post.userId.username}</span>
              </div>
            </div>
            <div className='hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-800' />
            <div className='text-left'>
              <span className='block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5'>Release Date</span>
              <span className='block text-md font-black text-slate-900 dark:text-white uppercase tracking-tight'>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className='hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-800' />
            <div className='text-left'>
              <span className='block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5'>Time Commitment</span>
              <span className='block text-md font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2'>
                <HiOutlineClock className='text-indigo-500' /> {readingTime} MIN
              </span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Background Element */}
        <div className='absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -z-0' />
        <div className='absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[120px] -z-0' />
      </section>

      {/* ── Featured Media ── */}
      <motion.div 
        initial={{ opacity: 0, clipPath: 'inset(10% 20% 10% 20% round 3rem)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0rem)' }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className='max-w-7xl mx-auto px-6 -mt-16 md:-mt-24 relative z-10'
      >
        <div className='aspect-[21/10] rounded-[3rem] overflow-hidden shadow-3d-hover border-[12px] border-white dark:border-slate-950 group'>
           <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 10, ease: 'linear' }}
            src={post.image} 
            alt={post.title} 
            className='w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700' 
           />
        </div>
      </motion.div>

      {/* ── Narrative Body ── */}
      <div className='relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 px-6 py-24 md:py-40'>
        
        {/* Sidebar Interactions (Desktop) */}
        <aside className='hidden lg:block lg:col-span-1 border-r border-slate-100 dark:border-slate-900 pr-10'>
           <div className='sticky top-40 space-y-12 flex flex-col items-center'>
              <button 
                onClick={handleLike}
                className={`group flex flex-col items-center gap-3 transition-all ${liked ? 'text-pink-500' : 'text-slate-300 dark:text-slate-700 hover:text-pink-500'}`}
              >
                 <HiHeart size={28} className={`${liked ? 'scale-110' : 'group-hover:scale-125'} transition-all`} />
                 <span className='text-[10px] font-black uppercase tracking-widest'>{post.numberOfLikes || 0}</span>
              </button>
              <button className='text-slate-300 dark:text-slate-700 hover:text-indigo-500 transition-colors'>
                 <HiOutlineShare size={24} />
              </button>
              <button className='text-slate-300 dark:text-slate-700 hover:text-indigo-500 transition-colors'>
                 <HiOutlineBookmark size={24} />
              </button>
           </div>
        </aside>

        {/* Content Core */}
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='lg:col-span-8 col-span-1'
        >
          <div
            className='themed-content prose lg:prose-xl dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          {/* Social Proof Footer */}
          <div className='mt-32 pt-20 border-t border-slate-100 dark:border-slate-900'>
             <CommentSection postId={post._id} />
          </div>
        </motion.article>

        {/* Content Meta (Desktop) */}
        <aside className='hidden lg:block lg:col-span-3 space-y-16'>
           <div className='sticky top-40 space-y-16'>
              <div className='space-y-6'>
                <h4 className='text-[10px] font-black uppercase tracking-[0.4em] text-slate-400'>Metadata Registry</h4>
                <div className='space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300'>
                   <div className='flex justify-between py-3 border-b border-slate-50 dark:border-slate-900'>
                      <span className='italic font-serif'>Index Symbol</span>
                      <span className='uppercase tracking-widest font-black text-indigo-500'>{post._id.slice(-6)}</span>
                   </div>
                   <div className='flex justify-between py-3 border-b border-slate-50 dark:border-slate-900'>
                      <span className='italic font-serif'>Access Protocol</span>
                      <span className='uppercase tracking-widest font-black'>Public</span>
                   </div>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className='space-y-6'>
                  <h4 className='text-[10px] font-black uppercase tracking-[0.4em] text-slate-400'>Defined Tags</h4>
                  <div className='flex flex-wrap gap-2'>
                    {post.tags.map(tag => (
                      <span key={tag} className='px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest'>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
           </div>
        </aside>
      </div>

      {/* ── Recommendation Archive ── */}
      <section className='bg-slate-50 dark:bg-black py-40 border-t border-slate-100 dark:border-slate-900 transition-colors'>
        <div className='max-w-7xl mx-auto px-6'>
           <div className='flex flex-col md:flex-row justify-between items-end mb-24 gap-8'>
              <div className='space-y-4'>
                 <div className='text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em]'>Continuing the context</div>
                 <h2 className='text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>Recent Articles<span className='text-slate-200 dark:text-slate-800'>.</span></h2>
              </div>
              <Link to='/search' className='group flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-[0.3em] transition-colors'>
                Full Archive <motion.span whileHover={{ x: 5 }} className='inline-block'>→</motion.span>
              </Link>
           </div>

           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
             {recentPosts && recentPosts.map((post, index) => (
                <PostCard key={post._id} post={post} index={index} />
             ))}
           </div>
        </div>
      </section>
    </main>
  );
}