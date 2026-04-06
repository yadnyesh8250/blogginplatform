import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import DashSidebar from '../components/DashSidebar';
import DashboardComp from '../components/DashboardComp';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashProfile from '../components/DashProfile';
import DashCategories from '../components/DashCategories';
import DashTags from '../components/DashTags';
import DashSettings from '../components/DashSettings';
import Header from '../components/Header';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('dash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    setTab(tabFromUrl || 'dash');
    setIsSidebarOpen(false); // Close sidebar on tab change
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/30'>
      {/* Premium Header with Mobile Toggle */}
      <Header onMobileMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className='flex-1 flex overflow-hidden'>
        {/* Desktop Sidebar + Mobile Drawer Overlay */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-0 z-40 transition-transform duration-300 md:duration-0 bg-slate-950/50 md:bg-transparent`}
             onClick={() => setIsSidebarOpen(false)}>
           <div className='w-72 h-full' onClick={(e) => e.stopPropagation()}>
              <DashSidebar />
           </div>
        </div>

        {/* Main Content Area */}
        <main className='flex-1 overflow-y-auto dash-scroll scroll-smooth'>
          <div className='p-0 transition-opacity duration-200'>
             {tab === 'dash' && <DashboardComp />}
             {tab === 'posts' && <DashPosts />}
             {tab === 'users' && <DashUsers />}
             {tab === 'comments' && <DashComments />}
             {tab === 'profile' && <DashProfile />}
             {tab === 'categories' && <DashCategories />}
             {tab === 'tags' && <DashTags />}
             {tab === 'settings' && <DashSettings />}
          </div>
        </main>
      </div>
    </div>
  );
}