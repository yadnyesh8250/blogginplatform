import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiTrash, HiChatAlt2, HiHeart, HiArrowRight, HiClock } from 'react-icons/hi';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) { console.log(error.message); }
    };
    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) { console.log(error.message); }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
      }
    } catch (error) { console.log(error.message); }
  };

  return (
    <div className='p-6 md:p-10 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Manage Comments</h1>
          <p className='text-slate-500 font-medium'>Monitor and moderate community discussions.</p>
        </div>
        <div className='px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold text-sm'>
          {comments.length} Comments Total
        </div>
      </div>

      {currentUser.isAdmin && comments.length > 0 ? (
        <div className='space-y-4'>
          {/* Header Row (Desktop) */}
          <div className='hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400'>
             <div className='col-span-6'>Comment Content</div>
             <div className='col-span-2 text-center'>Engagement</div>
             <div className='col-span-2 text-center'>Context</div>
             <div className='col-span-2 text-right'>Actions</div>
          </div>

          <div className='space-y-3'>
            {comments.map((comment) => (
              <div key={comment._id} className='bg-white dark:bg-slate-800 rounded-3xl p-4 md:p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 group'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
                  
                  {/* Content */}
                  <div className='col-span-1 md:col-span-6 flex items-start gap-4'>
                    <div className='w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-400'>
                       <HiChatAlt2 size={24} />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm text-slate-700 dark:text-slate-200 line-clamp-2 leading-relaxed'>
                        "{comment.content}"
                      </p>
                      <div className='flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-1'>
                        <HiClock size={12} /> {new Date(comment.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Likes */}
                  <div className='col-span-1 md:col-span-2 text-center'>
                     <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 text-[10px] font-black uppercase'>
                       <HiHeart size={14} /> {comment.numberOfLikes} Likes
                     </span>
                  </div>

                  {/* Context (IDs) */}
                  <div className='col-span-1 md:col-span-2 flex flex-col items-center gap-1'>
                    <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Post ID</span>
                    <span className='text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-lg'>
                      {comment.postId.slice(-6)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className='col-span-1 md:col-span-2 flex justify-end gap-2'>
                    <button 
                      onClick={() => { setShowModal(true); setCommentIdToDelete(comment._id); }} 
                      className='flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all font-bold text-xs'
                    >
                       <HiTrash size={16} /> Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {showMore && (
            <button onClick={handleShowMore} className='w-full py-4 text-sm font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors'>
              Load more comments ↓
            </button>
          )}
        </div>
      ) : (
        <div className='text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700'>
          <HiChatAlt2 className='mx-auto h-16 w-16 text-slate-300 mb-4' />
          <h3 className='text-xl font-bold text-slate-900 dark:text-white'>No comments found</h3>
          <p className='text-slate-500'>Your readers haven't left any feedback yet.</p>
        </div>
      )}

      {/* Delete Comment Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-4'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-red-500 mb-4 mx-auto' />
            <h3 className='mb-2 text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>Moderate Comment</h3>
            <p className='mb-6 text-sm text-slate-500'>Are you sure you want to remove this comment? This action cannot be reversed.</p>
            <div className='flex justify-center gap-3'>
              <button 
                onClick={handleDeleteComment} 
                className='px-6 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all'
              >
                Delete
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className='px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all'
              >
                Keep it
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
