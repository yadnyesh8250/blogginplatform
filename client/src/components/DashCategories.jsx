import { Alert, Button, Table, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiCollection, HiPlus, HiTrash } from 'react-icons/hi';
import { api } from '../utils/api.config';

export default function DashCategories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [publishError, setPublishError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api('/api/category/get');
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api('/api/category/create', {
        method: 'POST',
        body: JSON.stringify({ name: categoryName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setCategories([...categories, data]);
        setCategoryName('');
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-6 md:p-10 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Categories</h1>
          <p className='text-slate-500 font-medium'>Organize your content into meaningful sections.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:opacity-90 active:scale-95 transition-all'
        >
          <HiPlus /> New Category
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {categories.map((category) => (
          <div key={category._id} className='bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 group'>
            <div className='flex items-center gap-4 mb-4'>
               <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-inner'>
                  <HiCollection />
               </div>
               <div className='min-w-0'>
                  <h3 className='text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors capitalize'>
                    {category.name}
                  </h3>
                  <div className='flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase'>
                    <HiCalendar size={12} /> {new Date(category.createdAt).toLocaleDateString()}
                  </div>
               </div>
            </div>

            <p className='text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed'>
              {category.description || 'No description provided for this category.'}
            </p>

            <div className='flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700'>
               <div className='flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  <HiLink size={14} className='text-slate-300' /> {category.slug}
               </div>
               <button className='text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline'>
                  Quick Edit
               </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className='text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700'>
          <HiCollection className='mx-auto h-16 w-16 text-slate-300 mb-4' />
          <h3 className='text-xl font-bold text-slate-900 dark:text-white'>No categories yet</h3>
          <p className='text-slate-500 mb-6'>Categorize your posts to help readers find them easily.</p>
        </div>
      )}

      {/* Add Category Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='p-4'>
            <div className='flex items-center gap-3 mb-6'>
               <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl'>
                 <HiPlus />
               </div>
               <h3 className='text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>
                 New Category
               </h3>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5'>Category Name</label>
                <input
                  type='text'
                  placeholder='e.g. Technology'
                  required
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
                />
              </div>
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5'>Description (Optional)</label>
                <textarea
                  placeholder='Briefly describe what this category covers...'
                  rows={3}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none'
                />
              </div>

              <button 
                type='submit' 
                className='w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:opacity-90 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all'
              >
                💾 Save Category
              </button>
              
              {publishError && <Alert color='failure' icon={HiInformationCircle}>{publishError}</Alert>}
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
