import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiUsers,
  HiChat,
  HiChartPie,
  HiCollection,
  HiTag,
  HiCog,
  HiPlusCircle,
} from 'react-icons/hi';
import { signoutSuccess } from '../redux/user/userSlice';
import { api } from '../utils/api.config';

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab('dash');
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await api('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const menuItems = [
    { id: 'dash', label: 'Dashboard', icon: HiChartPie, adminOnly: true },
    { id: 'profile', label: 'Profile', icon: HiUser, adminOnly: false },
    { id: 'posts', label: 'All Posts', icon: HiDocumentText, adminOnly: true },
    { id: 'users', label: 'Users', icon: HiUsers, adminOnly: true },
    { id: 'comments', label: 'Comments', icon: HiChat, adminOnly: true },
    { id: 'categories', label: 'Categories', icon: HiCollection, adminOnly: true },
    { id: 'tags', label: 'Tags', icon: HiTag, adminOnly: true },
    { id: 'settings', label: 'Site Settings', icon: HiCog, adminOnly: true },
  ];

  return (
    <aside className='hidden md:flex flex-col w-72 h-screen sticky top-0 bg-slate-950 text-slate-400 p-6 border-r border-slate-900/50 dash-scroll overflow-y-auto'>
      <div className='flex items-center gap-3 mb-10 px-2'>
        <div className='w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20'>
          <span className='text-white text-xl font-black'>B</span>
        </div>
        <h2 className='text-xl font-black text-white tracking-tight'>Blogify <span className='text-[10px] uppercase tracking-widest text-indigo-400 block -mt-1'>Management</span></h2>
      </div>

      <nav className='flex-1 flex flex-col gap-1.5'>
        {/* Quick Post Button */}
        {currentUser?.isAdmin && (
           <Link 
            to='/create-post' 
            className='flex items-center gap-3 p-3 mb-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-90 active:scale-95 transition-all'
           >
             <HiPlusCircle className='text-xl' />
             Create New Post
           </Link>
        )}

        <p className='text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 text-slate-600'>Menu</p>

        {menuItems.map((item) => {
          if (item.adminOnly && !currentUser?.isAdmin) return null;
          const isActive = tab === item.id;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={`/dashboard?tab=${item.id}`}
              className={`group flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all duration-200 border border-transparent ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
                  : 'hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-500 text-white' : 'bg-slate-900 group-hover:bg-slate-800 text-slate-500 group-hover:text-slate-300'
              }`}>
                <Icon size={18} />
              </div>
              {item.label}
              {isActive && <div className='ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500' />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className='mt-10 pt-6 border-t border-slate-900'>
        <button
          onClick={handleSignout}
          className='w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all'
        >
          <div className='p-2 rounded-lg bg-red-500/10'>
            <HiArrowSmRight size={18} />
          </div>
          Sign Out
        </button>
        
        <div className='mt-6 p-4 rounded-2xl bg-slate-900/50 border border-slate-900 flex items-center gap-3'>
           <img 
            src={currentUser?.profilePicture} 
            alt='user' 
            className='w-8 h-8 rounded-full border border-slate-700'
           />
           <div className='min-w-0'>
              <p className='text-xs font-bold text-slate-200 truncate capitalize'>{currentUser?.username}</p>
              <p className='text-[10px] text-slate-500 truncate'>{currentUser?.isAdmin ? 'Administrator' : 'Author'}</p>
           </div>
        </div>
      </div>
    </aside>
  );
}