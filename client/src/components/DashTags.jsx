import { Modal, Button, TextInput, Label, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiTag, HiPlus, HiLink, HiCalendar, HiInformationCircle } from 'react-icons/hi';
import { api } from '../utils/api.config';

export default function DashTags() {
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await api('/api/tag/get');
      const data = await res.json();
      if (res.ok) setTags(data);
    } catch (error) { console.log(error.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api('/api/tag/create', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setPublishError(data.message); return; }
      setPublishError(null);
      setShowModal(false);
      setFormData({});
      fetchTags();
    } catch (error) { setPublishError('Something went wrong'); }
  };

  return (
    <div className='p-6 md:p-10 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Active Tags</h1>
          <p className='text-slate-500 font-medium'>Manage the semantic markers used to group your content.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:opacity-90 active:scale-95 transition-all'
        >
          <HiPlus /> New Tag
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {tags.map((tag) => (
          <div key={tag._id} className='bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all group'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500'>
                   <HiTag size={16} />
                </div>
                <h3 className='font-bold text-slate-800 dark:text-slate-200 capitalize'>{tag.name}</h3>
              </div>
              <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md'>#{tag.slug.slice(0, 6)}</span>
            </div>
            
            <div className='mt-4 flex items-center justify-between text-[10px] text-slate-400 font-bold'>
               <div className='flex items-center gap-1'>
                  <HiCalendar size={12} /> {new Date(tag.createdAt).toLocaleDateString()}
               </div>
               <button className='text-red-400 hover:text-red-500 transition-colors uppercase'>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className='text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700'>
          <HiTag className='mx-auto h-16 w-16 text-slate-300 mb-4' />
          <h3 className='text-xl font-bold text-slate-900 dark:text-white'>No tags created</h3>
          <p className='text-slate-500'>Tags help users find related content through cross-referencing.</p>
        </div>
      )}

      {/* Add Tag Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='sm'>
        <Modal.Header />
        <Modal.Body>
          <div className='p-3'>
            <div className='flex items-center gap-3 mb-6'>
               <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl'>
                 <HiPlus />
               </div>
               <h3 className='text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>
                 New Tag
               </h3>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5'>Tag Name</label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold'>#</span>
                  <input
                    type='text'
                    placeholder='tutorial'
                    required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='w-full pl-7 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold'
                  />
                </div>
              </div>

              <button 
                type='submit' 
                className='w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:opacity-90 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all'
              >
                Create Tag
              </button>
              
              {publishError && <Alert color='failure' icon={HiInformationCircle}>{publishError}</Alert>}
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
