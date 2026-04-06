import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaBars, FaPenNib, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api.config';

export default function Header({ onMobileMenuClick }) {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api('/api/settings/get');
        const data = await res.json();
        if (res.ok) setSettings(data);
      } catch (error) { console.log(error.message); }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await api('/api/user/signout', { method: 'POST' });
      if (res.ok) dispatch(signoutSuccess());
    } catch (error) { console.log(error.message); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <header className='sticky top-0 z-50 glass dark:glass-dark border-b border-slate-200/50 dark:border-slate-800/50'>
      <Navbar className='bg-transparent dark:bg-transparent px-4 py-4 max-w-7xl mx-auto'>
        <div className='flex items-center gap-4'>
          {/* Mobile Menu Toggle for Dashboard */}
          {path.startsWith('/dashboard') && (
            <button 
              onClick={onMobileMenuClick}
              className='md:hidden p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-sm'
            >
              <FaBars />
            </button>
          )}

          <Link to='/' className='flex items-center gap-3 group'>
            <motion.div 
              whileHover={{ rotate: -10, scale: 1.1 }}
              className='w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg transition-transform'
            >
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt='logo' className='w-6 h-6 object-contain' />
              ) : (
                <span className='text-white dark:text-slate-950 text-xl font-black'>B</span>
              )}
            </motion.div>
            <span className='hidden sm:block text-xl font-black text-slate-900 dark:text-white tracking-widest uppercase'>
              {settings?.siteTitle || 'Blogify'}<span className='text-indigo-500 font-normal'>.</span>
            </span>
          </Link>
        </div>

        <div className='flex items-center gap-3 md:order-2'>
          {/* Search Desktop */}
          <form onSubmit={handleSubmit} className='hidden lg:block relative'>
            <AiOutlineSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
            <input
              type='text'
              placeholder='Search archive...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-11 pr-5 py-2.5 w-64 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-slate-900 dark:text-white backdrop-blur-md'
            />
          </form>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(toggleTheme())}
            className='w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-slate-900/50'
          >
            {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
          </motion.button>

          {currentUser?.isAdmin && (
            <Link to='/create-post' className='hidden sm:block'>
               <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 transition-all'
               >
                 <FaPenNib className='text-xs' /> Write
               </motion.button>
            </Link>
          )}

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<img src={currentUser.profilePicture} className='w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 object-cover shadow-md hover:scale-110 transition-transform' alt='user' />}
            >
              <Dropdown.Header className='px-5 py-4'>
                <span className='block text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-1.5'>Author</span>
                <span className='block text-sm font-black text-slate-900 dark:text-white tracking-tight capitalize'>{currentUser.username}</span>
                <span className='block text-[10px] text-slate-500 truncate mt-1 italic'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to='/dashboard?tab=profile'>
                <Dropdown.Item className='text-xs font-bold text-slate-600 dark:text-slate-300'>Account Settings</Dropdown.Item>
              </Link>
              <Link to='/dashboard?tab=dash'>
                <Dropdown.Item className='text-xs font-bold text-slate-600 dark:text-slate-300'>Site Dashboard</Dropdown.Item>
              </Link>
              {currentUser.isAdmin && (
                <Link to='/create-post'>
                  <Dropdown.Item className='text-xs font-bold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800 mt-2 pt-3'>Create New Post</Dropdown.Item>
                </Link>
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout} className='text-xs font-black text-red-500 uppercase tracking-[0.2em]'>Sign Out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in' className='hidden sm:block'>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className='px-6 py-2.5 rounded-xl bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white text-[10px] font-black text-slate-950 dark:text-white hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all uppercase tracking-widest'
              >
                Sign In
              </motion.button>
            </Link>
          )}

          {/* Toggle Mobile Menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white'
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Global Desktop Navigation */}
        <div className='hidden md:flex gap-10 font-black text-[10px] uppercase tracking-[0.3em] text-slate-400'>
          <Link to='/' className={`hover:text-indigo-500 transition-colors ${path === '/' && 'text-indigo-600'}`}>Feed</Link>
          <Link to='/about' className={`hover:text-indigo-500 transition-colors ${path === '/about' && 'text-indigo-600'}`}>About</Link>
          <Link to='/search' className={`hover:text-indigo-500 transition-colors ${path === '/search' && 'text-indigo-600'}`}>Archive</Link>
        </div>
      </Navbar>

      {/* ── Premium Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden'
          >
            <nav className='flex flex-col p-6 gap-6 font-black text-[11px] uppercase tracking-[0.4em]'>
              <Link onClick={() => setIsMobileMenuOpen(false)} to='/' className='flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-indigo-500'>Feed <span className='text-[8px] opacity-20'>01</span></Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to='/about' className='flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-indigo-500'>About <span className='text-[8px] opacity-20'>02</span></Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to='/search' className='flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-indigo-500'>Archive <span className='text-[8px] opacity-20'>03</span></Link>
              {!currentUser && (
                <Link onClick={() => setIsMobileMenuOpen(false)} to='/sign-in' className='mt-4 p-4 rounded-2xl bg-slate-900 text-white text-center tracking-widest'>Sign In</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
