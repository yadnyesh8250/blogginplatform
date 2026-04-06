import { Link } from 'react-router-dom';
import { THEMES } from '../themes/themes';
import { motion } from 'framer-motion';

export default function PostCard({ post, index = 0 }) {
  const theme = THEMES.find(t => t.id === post.theme) || THEMES[0];
  const readingTime = post.content
    ? Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)
    : 1;

  const author = typeof post.userId === 'object' ? post.userId : { _id: post.userId, username: 'Author' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='block group perspective-1000'
    >
      <Link to={`/post/${post.slug}`}>
        <motion.article 
          whileHover={{ 
            rotateY: 5, 
            rotateX: -2,
            scale: 1.02,
            z: 50
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className='relative h-full glass dark:glass-dark rounded-2xl border border-slate-200/50 dark:border-slate-800/50 transition-shadow duration-500 hover:shadow-3d-hover flex flex-col overflow-hidden transform-gpu'
        >
          {/* ── Visual Header ── */}
          <div className='relative overflow-hidden h-64 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/50'>
            {post.image ? (
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={post.image}
                alt={post.title}
                className='h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700'
              />
            ) : (
              <div className='h-full w-full flex items-center justify-center text-5xl opacity-20'>
                <span>{theme.icon}</span>
              </div>
            )}

            {/* Float Badge */}
            <div className='absolute top-4 left-4'>
              <span className='text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-white backdrop-blur-md rounded-full border border-slate-200/50 dark:border-slate-800/50 shadow-sm'>
                {readingTime} MIN READ
              </span>
            </div>
          </div>

          {/* ── Content ── */}
          <div className='p-8 flex flex-col gap-5 flex-1 relative z-10'>
            <div className='space-y-4'>
              {/* Taxonomy */}
              {post.tags && post.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {post.tags.slice(0, 1).map(tag => (
                    <span key={tag} className='text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500'>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className='text-xl font-black text-slate-900 dark:text-white line-clamp-2 leading-[1.2] uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                {post.title}
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className='text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium tracking-tight'>
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Attribution Area */}
            <div className='mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between'>
               <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-slate-900 dark:bg-white overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 transition-transform group-hover:-rotate-6'>
                     {author.profilePicture ? (
                       <img src={author.profilePicture} alt={author.username} className='w-full h-full object-cover' />
                     ) : (
                       <div className='w-full h-full flex items-center justify-center text-[10px] text-white dark:text-slate-950 font-black'>B</div>
                     )}
                  </div>
                  <div className='flex flex-col'>
                     <span className='text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white'>{author.username}</span>
                     <span className='text-[8px] font-bold text-slate-400 uppercase tracking-tighter'>Verified Author</span>
                  </div>
               </div>
               <div className='text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700'>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
               </div>
            </div>

            {/* Interactive Glow (Hidden by default) */}
            <div className='absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10' />
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
