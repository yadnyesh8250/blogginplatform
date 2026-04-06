import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiCog, HiPhotograph, HiShare, HiViewBoards, HiCheckCircle, HiExclamationCircle, HiMail, HiGlobe, HiHashtag } from 'react-icons/hi';
import { api } from '../utils/api.config';
import MediaLibraryPane from './MediaLibraryPane';

export default function DashSettings() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api('/api/settings/get');
      const data = await res.json();
      if (res.ok) setFormData(data);
      else setError(data.message);
      setLoading(false);
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.includes('.')) {
      const [parent, child] = id.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const res = await api('/api/settings/update', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message);
      else {
        setSuccess('Settings updated successfully!');
        setFormData(data);
      }
      setLoading(false);
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const handleMediaSelect = (url) => {
    setFormData({ ...formData, [mediaType]: url });
    setShowMediaLibrary(false);
  };

  const sectionHeader = (icon, title, desc) => (
    <div className='flex items-center gap-4 mb-6'>
       <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-inner'>
          {icon}
       </div>
       <div>
          <h2 className='text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>{title}</h2>
          <p className='text-xs text-slate-400 font-bold uppercase tracking-widest'>{desc}</p>
       </div>
    </div>
  );

  return (
    <div className='p-6 md:p-10 max-w-5xl mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Site Settings</h1>
          <p className='text-slate-500 font-medium'>Global configuration for your blogging platform.</p>
        </div>
        <div className='flex items-center gap-2'>
           {success && <div className='flex items-center gap-1 text-green-500 font-bold text-xs animate-bounce'><HiCheckCircle /> Saved</div>}
        </div>
      </div>

      <form className='space-y-8' onSubmit={handleSubmit}>
        
        {/* General Settings */}
        <div className='bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm'>
          {sectionHeader(<HiCog />, 'General Configuration', 'Core Site Identity')}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
            <div className='space-y-2'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>Site Title</label>
              <input
                id='siteTitle'
                type='text'
                placeholder='e.g. Blogify'
                value={formData.siteTitle || ''}
                onChange={handleChange}
                className='w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold'
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>Site Tagline</label>
              <input
                id='siteTagline'
                type='text'
                placeholder='e.g. Elevate your stories'
                value={formData.siteTagline || ''}
                onChange={handleChange}
                className='w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold'
              />
            </div>
            <div className='md:col-span-2 space-y-2'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>Contact Email</label>
              <div className='relative'>
                 <HiMail className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                 <input
                  id='contactEmail'
                  type='email'
                  placeholder='hello@yourblog.com'
                  value={formData.contactEmail || ''}
                  onChange={handleChange}
                  className='w-full pl-11 pr-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branding Media */}
        <div className='bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm'>
          {sectionHeader(<HiPhotograph />, 'Branding & Assets', 'Logos and Favicons')}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-8'>
            <div className='flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800'>
              <div className='w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center p-2 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden'>
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt='logo' className='max-w-full max-h-full object-contain' />
                ) : (
                  <HiHashtag size={32} className='text-slate-200' />
                )}
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight'>Main Logo</p>
                <button
                  type='button'
                  onClick={() => { setMediaType('logoUrl'); setShowMediaLibrary(true); }}
                  className='text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4'
                >
                  Change Asset
                </button>
              </div>
            </div>
            
            <div className='flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800'>
              <div className='w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center p-2 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden'>
                {formData.faviconUrl ? (
                  <img src={formData.faviconUrl} alt='favicon' className='w-10 h-10 object-contain' />
                ) : (
                  <HiGlobe size={24} className='text-slate-200' />
                )}
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight'>Favicon</p>
                <button
                  type='button'
                  onClick={() => { setMediaType('faviconUrl'); setShowMediaLibrary(true); }}
                  className='text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4'
                >
                  Change Asset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Presence */}
        <div className='bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm'>
          {sectionHeader(<HiShare />, 'Social Ecosystem', 'Connect with your audience')}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(platform => (
              <div key={platform} className='space-y-2'>
                <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 capitalize'>{platform} URL</label>
                <input
                  id={`socialLinks.${platform}`}
                  type='text'
                  placeholder={`https://${platform}.com/yourpage`}
                  value={formData.socialLinks?.[platform] || ''}
                  onChange={handleChange}
                  className='w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Area */}
        <div className='bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm'>
          {sectionHeader(<HiViewBoards />, 'Footer Region', 'Copyright & Legal')}
          <div className='mt-8 space-y-2'>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1'>Copyright Text</label>
            <textarea
              id='footerText'
              placeholder=' e.g. © 2024 Blogify. All rights reserved.'
              rows={3}
              value={formData.footerText || ''}
              onChange={handleChange}
              className='w-full px-5 py-4 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none'
            />
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className='sticky bottom-8 z-20 flex justify-center'>
            <button
              type='submit'
              disabled={loading}
              className='flex items-center gap-3 px-12 py-4 rounded-3xl bg-slate-900 dark:bg-indigo-600 text-white font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-600/30'
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <HiCheckCircle className='text-indigo-400' />
                  Save Global Configuration
                </>
              )}
            </button>
        </div>

      </form>
      
      {error && <Alert color='failure' icon={HiExclamationCircle} className='mt-8 rounded-2xl'>{error}</Alert>}
      
      <MediaLibraryPane
        show={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
