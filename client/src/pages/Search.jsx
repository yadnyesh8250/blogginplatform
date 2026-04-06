import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { api } from '../utils/api.config';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineFilter, HiOutlineSearch, HiOutlineSortDescending, HiOutlineCollection } from 'react-icons/hi';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'all',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'all',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await api(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'all';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await api(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-white dark:bg-slate-950'>
      {/* ── Filter Sidebar ── */}
      <aside className='w-full md:w-80 p-8 md:min-h-screen border-b md:border-r border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/10 backdrop-blur-sm'>
        <div className='sticky top-32 space-y-12'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3 text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em]'>
              <HiOutlineFilter /> Search Filters
            </div>
            <h2 className='text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>Discovery.</h2>
          </div>

          <form className='space-y-10' onSubmit={handleSubmit}>
            <div className='space-y-4 font-black uppercase text-[10px] tracking-widest text-slate-400'>
              <label className='flex items-center gap-3'><HiOutlineSearch className='text-indigo-500' /> Keyword</label>
              <input
                placeholder='Identify content...'
                id='searchTerm'
                type='text'
                value={sidebarData.searchTerm}
                onChange={handleChange}
                className='w-full px-5 py-3.5 rounded-2xl glass dark:glass-dark border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/30 transition-all font-bold text-slate-900 dark:text-white'
              />
            </div>

            <div className='space-y-4 font-black uppercase text-[10px] tracking-widest text-slate-400'>
              <label className='flex items-center gap-3'><HiOutlineSortDescending className='text-indigo-500' /> Chronology</label>
              <Select
                onChange={handleChange}
                value={sidebarData.sort}
                id='sort'
                className='custom-select'
              >
                <option value='desc'>Latest Releases</option>
                <option value='asc'>Oldest Archives</option>
              </Select>
            </div>

            <div className='space-y-4 font-black uppercase text-[10px] tracking-widest text-slate-400'>
              <label className='flex items-center gap-3'><HiOutlineCollection className='text-indigo-500' /> Taxonomy</label>
              <Select
                onChange={handleChange}
                value={sidebarData.category}
                id='category'
                className='custom-select'
              >
                <option value='all'>All Intelligence</option>
                <option value='uncategorized'>Uncategorized</option>
                <option value='reactjs'>React.js</option>
                <option value='nextjs'>Next.js</option>
                <option value='javascript'>JavaScript</option>
              </Select>
            </div>

            <button 
              type='submit' 
              className='w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg hover:shadow-3d-hover active:scale-95 transition-all'
            >
              Analyze & Search
            </button>
          </form>
        </div>
      </aside>

      {/* ── Results Feed ── */}
      <main className='flex-1 p-8 md:p-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-wrap items-end justify-between gap-6 mb-16 pb-8 border-b border-slate-100 dark:border-slate-900'>
            <div className='space-y-2'>
              <div className='text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em]'>Query Results</div>
              <h1 className='text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>
                Archive <span className='text-slate-300 dark:text-slate-700 font-serif lowercase italic tracking-normal'>feed.</span>
              </h1>
            </div>
            <div className='text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl'>
              {posts.length} Document(s) Found
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10'>
            <AnimatePresence mode='popLayout'>
              {!loading && posts.length === 0 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-xl text-slate-400 font-serif italic col-span-3 py-20 text-center'
                >
                  No intelligence matching your query was discovered.
                </motion.p>
              )}
              {loading && (
                <div className='col-span-3 py-40 flex justify-center'>
                  <div className='w-12 h-px bg-slate-200 dark:bg-slate-800 overflow-hidden relative'>
                    <div className='absolute inset-0 bg-indigo-500 animate-[loading-bar_1.5s_infinite_ease-in-out]' />
                  </div>
                </div>
              )}
              {!loading &&
                posts &&
                posts.map((post, index) => (
                  <PostCard key={post._id} post={post} index={index} />
                ))}
            </AnimatePresence>
          </div>

          {showMore && (
            <div className='mt-20 flex justify-center'>
              <button
                onClick={handleShowMore}
                className='px-12 py-4 rounded-2xl glass dark:glass-dark border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-900 dark:hover:border-white transition-all active:scale-95'
              >
                Reveal More Documents
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
