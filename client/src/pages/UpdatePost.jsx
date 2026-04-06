import { Alert, Button, Select, TextInput, Textarea, Label, Checkbox } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MediaLibraryPane from '../components/MediaLibraryPane';
import ThemePicker from '../themes/ThemePicker';
import { getTheme } from '../themes/themes';
import { HiColorSwatch, HiCube, HiPencilAlt, HiCheckCircle } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { api } from '../utils/api.config';

export default function UpdatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await api(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api('/api/category/get');
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (error) { console.log(error.message); }
    };
    fetchCategories();
  }, []);

  const activeTheme = getTheme(formData.theme || 'minimal');

  const handleCategoryChange = (categoryId) => {
    const currentCategories = formData.categories || [];
    setFormData({
      ...formData,
      categories: currentCategories.includes(categoryId)
        ? currentCategories.filter((id) => id !== categoryId)
        : [...currentCategories, categoryId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setPublishError(data.message); return; }
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  if (!formData.title) return <div className='p-20 text-center animate-pulse'>Initialising High-Fidelity Editor...</div>;

  return (
    <div
      className='min-h-screen transition-all duration-700'
      style={Object.fromEntries(
        Object.entries(activeTheme.vars).map(([k, v]) => [k, v])
      )}
    >
      {/* Editor Header Bar */}
      <div
        className='sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b shadow-sm'
        style={{
          background: activeTheme.vars['--theme-surface'],
          borderColor: activeTheme.vars['--theme-border'],
          fontFamily: activeTheme.vars['--theme-heading-font'],
        }}
      >
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>{activeTheme.icon}</span>
          <h1 className='text-xl font-bold' style={{ color: activeTheme.vars['--theme-text'], fontFamily: activeTheme.vars['--theme-heading-font'] }}>
            Update Article
          </h1>
          <span className='text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-[0.2em] border shadow-sm' style={{ borderColor: formData.accentColor || activeTheme.vars['--theme-accent'], color: formData.accentColor || activeTheme.vars['--theme-accent'] }}>
            Global Asset ID: {formData._id.slice(-6)}
          </span>
        </div>
        <div className='flex gap-3 items-center'>
          <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block'>
            Autosave Active
          </span>
          <button
            type='button'
            onClick={() => {
              document.getElementById('update-post-form').requestSubmit();
            }}
            className='px-8 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center gap-2'
            style={{ background: formData.accentColor || activeTheme.vars['--theme-accent'] }}
          >
            <HiCheckCircle size={16} />
            Commit Changes
          </button>
        </div>
      </div>

      <form id='update-post-form' onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-0 min-h-screen'>
        {/* ── Main Content Area ── */}
        <div className='flex-1 p-6 lg:p-16 flex flex-col gap-10 max-w-5xl mx-auto w-full' style={{ background: activeTheme.vars['--theme-bg'] }}>
          
          {/* Title - Large Editorial */}
          <input
            type='text'
            placeholder='Title of your masterpiece...'
            required
            value={formData.title}
            className='w-full bg-transparent border-none outline-none placeholder-opacity-20 resize-none text-center'
            style={{
              fontFamily: formData.fontFamily === 'serif' ? '"Lora", serif' : activeTheme.vars['--theme-heading-font'],
              fontWeight: '900',
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              color: activeTheme.vars['--theme-text'],
              letterSpacing: '-0.04em',
              lineHeight: '1.1',
              borderBottom: `1px solid ${activeTheme.vars['--theme-border']}`,
              paddingBottom: '2rem',
            }}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          {/* Excerpt */}
          <textarea
            placeholder='An enticing summary of your story...'
            rows={2}
            value={formData.excerpt}
            className='w-full bg-transparent border-none outline-none resize-none text-xl font-medium text-center italic'
            style={{
              fontFamily: activeTheme.vars['--theme-body-font'],
              color: activeTheme.vars['--theme-text-muted'],
              paddingBottom: '1rem',
            }}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />

          {/* Featured Image Preview */}
          {formData.image && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='relative group rounded-[40px] overflow-hidden shadow-2xl'>
              <img src={formData.image} alt='featured' className='w-full h-[500px] object-cover' />
              <button
                type='button'
                onClick={() => setFormData({ ...formData, image: '' })}
                className='absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest opacity-group-hover:opacity-100 transition-opacity active:scale-95'
              >
                ✕ Remove Image
              </button>
            </motion.div>
          )}

          {/* Editor Container */}
          <div className='editor-premium-wrapper rounded-3xl overflow-hidden border shadow-inner' style={{ borderColor: activeTheme.vars['--theme-border'] }}>
            <ReactQuill
              theme='snow'
              value={formData.content}
              placeholder='The world is waiting for your story...'
              className='min-h-[600px] mb-12 bg-white dark:bg-slate-900/50'
              required
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  ['link', 'image'],
                  [{ align: [] }],
                  ['clean'],
                ],
              }}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          </div>

          {publishError && <Alert color='failure' className='rounded-2xl'>{publishError}</Alert>}
        </div>

        {/* ── Right Sidebar - Professional Controls ── */}
        <div className='w-full lg:w-96 flex-shrink-0 border-l flex flex-col gap-0 overflow-y-auto' style={{ background: activeTheme.vars['--theme-surface'], borderColor: activeTheme.vars['--theme-border'] }}>
          
          {/* Status & Action */}
          <SidebarSection title='🚀 Publish Panel' theme={activeTheme}>
             <div className='space-y-4'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1'>Engine Status</label>
                  <select
                    className='w-full rounded-2xl px-4 py-3 text-xs border-0 bg-slate-100 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-indigo-500'
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value='draft'>📝 Draft (Hidden)</option>
                    <option value='published'>🚀 Published (Live)</option>
                    <option value='scheduled'>📅 Scheduled (Future)</option>
                  </select>
                </div>
                <button
                  type='submit'
                  className='w-full py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-600/20'
                  style={{ background: formData.accentColor || activeTheme.vars['--theme-accent'] }}
                >
                  Confirm Evolution
                </button>
             </div>
          </SidebarSection>

          {/* Advanced Customization */}
          <SidebarSection title='🎨 Advanced Design' theme={activeTheme}>
             <div className='space-y-5'>
                {/* Accent Color */}
                <div className='space-y-2'>
                  <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60'><HiColorSwatch /> Accent Color (Hex)</label>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='color'
                      value={formData.accentColor || '#6366f1'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className='w-12 h-12 rounded-xl cursor-pointer border-none p-1 bg-transparent shadow-sm'
                    />
                    <input
                      type='text'
                      value={formData.accentColor || '#6366f1'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className='flex-1 rounded-xl px-4 py-2.5 text-xs font-mono uppercase bg-slate-100 dark:bg-slate-900 border-none'
                    />
                  </div>
                </div>

                {/* Font Face Selector */}
                <div className='space-y-2'>
                  <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60'><HiPencilAlt /> Typography Style</label>
                  <div className='grid grid-cols-3 gap-2'>
                    {['serif', 'sans-serif', 'mono'].map(font => (
                      <button
                        key={font}
                        type='button'
                        onClick={() => setFormData({ ...formData, fontFamily: font })}
                        className={`py-2 text-[9px] font-black uppercase tracking-widest border-2 rounded-xl transition-all ${
                          (formData.fontFamily || 'sans-serif') === font ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-transparent bg-slate-100 dark:bg-slate-900 text-slate-400'
                        }`}
                      >
                         {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout Selector */}
                <div className='space-y-2'>
                  <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60'><HiCube /> Rendering Layout</label>
                  <select
                    className='w-full rounded-xl px-4 py-3 text-xs border-0 bg-slate-100 dark:bg-slate-900 font-bold focus:ring-2 focus:ring-indigo-500'
                    value={formData.layoutStyle || 'standard'}
                    onChange={(e) => setFormData({ ...formData, layoutStyle: e.target.value })}
                  >
                    <option value='standard'>Standard Blog</option>
                    <option value='editorial'>Editorial Magazine</option>
                    <option value='minimal'>Ultra Minimal</option>
                  </select>
                </div>
             </div>
          </SidebarSection>

          {/* Theme Gallery */}
          <SidebarSection title='🎛️ Engine Presets' theme={activeTheme}>
            <ThemePicker
              selected={formData.theme || 'minimal'}
              onChange={(themeId) => setFormData({ ...formData, theme: themeId })}
            />
          </SidebarSection>

          {/* Visibility Controls */}
          <SidebarSection title='🔍 Post Lifecycle' theme={activeTheme}>
             <div className='space-y-4'>
                <div className='flex flex-col gap-1'>
                  <label className='text-[9px] font-black uppercase opacity-50 tracking-widest'>Encryption Level</label>
                  <select
                    className='w-full rounded-xl px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-900 border-none font-bold'
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  >
                    <option value='public'>🌍 Global Public</option>
                    <option value='private'>🔒 Local Private</option>
                    <option value='password'>🔑 Password Auth</option>
                  </select>
                </div>
                
                <div className='pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3'>
                   <input
                    type='text'
                    placeholder='SEO Meta Title'
                    value={formData.metaTitle}
                    className='w-full rounded-xl px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-900 border-none font-medium'
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  />
                  <textarea
                    placeholder='SEO Meta Description...'
                    rows={3}
                    value={formData.metaDescription}
                    className='w-full rounded-xl px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-900 border-none font-medium resize-none'
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  />
                </div>
             </div>
          </SidebarSection>

          {/* Media & Taxonomy */}
          <SidebarSection title='🖼️ Assets & Meta' theme={activeTheme}>
             <div className='space-y-6'>
                <button
                  type='button'
                  onClick={() => setShowMediaLibrary(true)}
                  className='w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/40 relative overflow-hidden group'
                  style={{ borderColor: activeTheme.vars['--theme-border'] }}
                >
                  {formData.image ? (
                    <img src={formData.image} className='absolute inset-0 w-full h-full object-cover group-hover:opacity-40 transition-opacity' />
                  ) : (
                    <span className='text-3xl text-slate-300'>📸</span>
                  )}
                  <span className='text-[10px] font-black uppercase tracking-widest relative z-10'>{formData.image ? 'Replace Image' : 'Featured Image'}</span>
                </button>

                <div className='max-h-40 overflow-y-auto flex flex-col gap-1'>
                  {categories.map((cat) => (
                    <label key={cat._id} className='flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group'>
                      <input
                        type='checkbox'
                        checked={formData.categories?.includes(cat._id)}
                        onChange={() => handleCategoryChange(cat._id)}
                        className='w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-0 group-hover:scale-110 transition-transform'
                      />
                      <span className='text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 transition-colors'>{cat.name}</span>
                    </label>
                  ))}
                </div>
             </div>
          </SidebarSection>
        </div>
      </form>

      <MediaLibraryPane
        show={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(url) => { setFormData({ ...formData, image: url }); setShowMediaLibrary(false); }}
      />
    </div>
  );
}

function SidebarSection({ title, theme, children }) {
  return (
    <div className='p-8 border-b' style={{ borderColor: theme.vars['--theme-border'] }}>
      <h3 className='text-[9px] font-black uppercase tracking-[0.4em] mb-6 opacity-40 italic'>
        {title}
      </h3>
      {children}
    </div>
  );
}