import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle, HiPencil, HiTrash, HiDocumentText, HiEye, HiGlobeAlt, HiLockClosed, HiClock } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, published, draft, scheduled

  useEffect(() => {
    fetchPosts();
  }, [currentUser._id, activeTab]);

  const fetchPosts = async () => {
    try {
      const statusParam = activeTab === 'all' ? '' : `&status=${activeTab}`;
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}${statusParam}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts(data.posts);
        if (data.posts.length < 9) setShowMore(false);
        else setShowMore(true);
      }
    } catch (error) { console.log(error.message); }
  };

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    const statusParam = activeTab === 'all' ? '' : `&status=${activeTab}`;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}${statusParam}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) { console.log(error.message); }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, { method: 'DELETE' });
      if (res.ok) setUserPosts((prev) => prev.filter((p) => p._id !== postIdToDelete));
    } catch (error) { console.log(error.message); }
  };

  const tabClasses = (tab) => `
    px-6 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all relative
    ${activeTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}
  `;

  return (
    <div className='p-6 md:p-10 max-w-6xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Content Management</h1>
          <p className='text-slate-500 font-medium text-sm italic'>Organize, filter, and publish your digital stories.</p>
        </div>
        <div className='flex items-center gap-3'>
          <Link to='/create-post'>
            <button className='px-6 py-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95'>
               Create New Post
            </button>
          </Link>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className='flex items-center border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar'>
        <button onClick={() => setActiveTab('all')} className={tabClasses('all')}>
          All Posts {activeTab === 'all' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500'></div>}
        </button>
        <button onClick={() => setActiveTab('published')} className={tabClasses('published')}>
          Published {activeTab === 'published' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500'></div>}
        </button>
        <button onClick={() => setActiveTab('draft')} className={tabClasses('draft')}>
          Drafts {activeTab === 'draft' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500'></div>}
        </button>
        <button onClick={() => setActiveTab('scheduled')} className={tabClasses('scheduled')}>
          Scheduled {activeTab === 'scheduled' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500'></div>}
        </button>
      </div>

      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div className='space-y-4'>
          {/* Header Row (Desktop) */}
          <div className='hidden md:grid grid-cols-12 gap-4 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400'>
             <div className='col-span-6'>Article Details</div>
             <div className='col-span-2 text-center'>Engagement</div>
             <div className='col-span-2 text-center'>Status</div>
             <div className='col-span-2 text-right'>Actions</div>
          </div>

          <div className='space-y-4'>
            {userPosts.map((post) => (
              <div key={post._id} className='group relative bg-white dark:bg-slate-900/50 rounded-[32px] p-5 md:p-6 border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-center uppercase'>
                  
                  {/* Article Info */}
                  <div className='col-span-1 md:col-span-6 flex items-center gap-5'>
                    <div className='w-20 h-20 md:w-24 md:h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative'>
                      <img src={post.image} alt={post.title} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' />
                      <div className='absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    </div>
                    <div className='min-w-0 space-y-1'>
                      <Link to={`/post/${post.slug}`} className='text-base font-black text-slate-900 dark:text-white hover:text-indigo-500 transition-colors truncate block tracking-tight'>
                        {post.title}
                      </Link>
                      <div className='flex items-center gap-3 text-[10px] text-slate-400 font-bold'>
                         <span className='px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800'>{post.category}</span>
                         <span className='flex items-center gap-1'><HiClock /> {new Date(post.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Placeholder/Engagement */}
                  <div className='col-span-1 md:col-span-2 text-center space-y-1'>
                     <div className='text-sm font-black text-slate-900 dark:text-white'>{(post.views || 0).toLocaleString()}</div>
                     <div className='text-[9px] text-slate-400 font-black tracking-widest'>Impact Score</div>
                  </div>

                  {/* Status Badge */}
                  <div className='col-span-1 md:col-span-2 flex justify-center'>
                     <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest transition-colors ${
                       post.status === 'published' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                     }`}>
                       {post.status === 'published' ? <HiGlobeAlt size={14} /> : <HiLockClosed size={14} />}
                       {post.status}
                     </div>
                  </div>

                  {/* Actions */}
                  <div className='col-span-1 md:col-span-2 flex justify-end gap-3'>
                    <Link to={`/update-post/${post._id}`} className='w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm'>
                       <HiPencil size={18} />
                    </Link>
                    <button 
                      onClick={() => { setShowModal(true); setPostIdToDelete(post._id); }} 
                      className='w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm'
                    >
                       <HiTrash size={18} />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {showMore && (
            <div className='pt-10 flex justify-center'>
               <button onClick={handleShowMore} className='px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-indigo-500 transition-all border-b border-transparent hover:border-indigo-500'>
                 Load Infinity Content ↓
               </button>
            </div>
          )}
        </div>
      ) : (
        <div className='text-center py-32 bg-white dark:bg-slate-900/30 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800'>
          <div className='w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300'>
             <HiDocumentText size={40} />
          </div>
          <h3 className='text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>Silence in the Archive</h3>
          <p className='text-slate-500 max-w-sm mx-auto mt-2 font-medium'>You have no {activeTab !== 'all' ? activeTab : ''} stories in this category yet. Time to unleash your creativity.</p>
          <Link to='/create-post' className='mt-8 inline-block'>
            <button className='px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all'>
               Begin Novel Article
            </button>
          </Link>
        </div>
      )}

      {/* Delete Modal Premium */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-6'>
            <div className='w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500'>
               <HiOutlineExclamationCircle size={32} />
            </div>
            <h3 className='mb-2 text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>Obliterate Content?</h3>
            <p className='mb-8 text-sm text-slate-500 font-medium'>This action will permanently delete Article Data, SEO Meta, and Comment Threads. There is no recovery path.</p>
            <div className='grid grid-cols-2 gap-4'>
              <button 
                onClick={handleDeletePost} 
                className='px-6 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-red-600/20 transition-all active:scale-95'
              >
                Permanently Delete
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className='px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all'
              >
                Abort Action
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
