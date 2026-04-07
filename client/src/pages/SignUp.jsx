import { Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api.config';

const FEATURES = [
  { icon: '🎨', title: 'Institutional Themes', desc: 'Each entry can have its own curated visual identity' },
  { icon: '📝', title: 'Editorial Engine', desc: 'Full formatting, embeds, and professional typography' },
  { icon: '🔍', title: 'Registry Ready', desc: 'Advanced metadata and automated archival per post' },
  { icon: '📊', title: 'Intelligence Data', desc: 'Track resonance, reach, and reader commitment metrics' },
];

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await api('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { setLoading(false); return setErrorMessage(data.message); }
      setLoading(false);
      if (res.ok) navigate('/sign-in');
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex bg-white dark:bg-slate-950'>
      {/* Left panel — Institutional Features */}
      <div className='hidden lg:flex flex-1 flex-col justify-center p-16 bg-slate-950 dark:bg-black relative overflow-hidden border-r border-slate-900'>
        <div className='absolute inset-0 opacity-5 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
        
        <div className='relative z-10 space-y-12'>
          <Link to='/' className='inline-flex items-center gap-4 mb-16 group'>
            <div className='w-12 h-12 bg-white rounded flex items-center justify-center text-slate-950 text-xl font-black transition-transform group-hover:-rotate-6'>B</div>
            <span className='text-3xl font-black tracking-tighter uppercase text-white'>Blogify<span className='text-slate-600 font-normal'>.</span></span>
          </Link>

          <div className='space-y-6'>
            <h1 className='text-5xl font-black text-white leading-tight uppercase tracking-tighter'>
              Create your <span className='text-slate-600 italic font-serif lowercase tracking-normal'>account.</span>
            </h1>
            <p className='text-slate-400 text-lg leading-relaxed font-bold tracking-tight italic max-w-md'>
              Join our community of storytellers and digital creators.
            </p>
          </div>

          <div className='space-y-4 pt-10'>
            {FEATURES.map((f, i) => (
              <div key={i} className='flex items-start gap-5 p-6 bg-slate-900/50 border border-slate-800/50 rounded transition-colors hover:bg-slate-900'>
                <span className='text-2xl pt-1'>{f.icon}</span>
                <div>
                  <h3 className='font-black text-white text-[10px] uppercase tracking-widest'>{f.title}</h3>
                  <p className='text-slate-500 text-xs mt-1 font-bold tracking-tight'>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Minimalist Form */}
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='w-full max-w-sm space-y-10'>
           {/* Mobile logo */}
           <Link to='/' className='flex lg:hidden justify-center mb-10'>
             <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-slate-950 dark:bg-white rounded flex items-center justify-center text-white dark:text-slate-950 font-black'>B</div>
                <span className='text-xl font-black tracking-tighter uppercase text-slate-950 dark:text-white'>Blogify</span>
             </div>
          </Link>

          <header className='space-y-2'>
            <h2 className='text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter'>Registration</h2>
            <p className='text-slate-400 text-xs font-black uppercase tracking-widest'>Secure & Encrypted / Welcome</p>
          </header>

          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='group'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-slate-950 dark:group-focus-within:text-white transition-colors'>Identifier (Username)</label>
              <input
                type='text'
                id='username'
                placeholder='authorized_personnel'
                onChange={handleChange}
                className='w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:ring-0 focus:border-slate-950 dark:focus:border-white transition-all font-bold placeholder:text-slate-200 dark:placeholder:text-slate-800'
              />
            </div>
            <div className='group'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-slate-950 dark:group-focus-within:text-white transition-colors'>Registry Email</label>
              <input
                type='email'
                id='email'
                placeholder='operator@blogify.com'
                onChange={handleChange}
                className='w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:ring-0 focus:border-slate-950 dark:focus:border-white transition-all font-bold placeholder:text-slate-200 dark:placeholder:text-slate-800'
              />
            </div>
            <div className='group'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-slate-950 dark:group-focus-within:text-white transition-colors'>Security Key (Password)</label>
              <input
                type='password'
                id='password'
                placeholder='Minimum 8 characters'
                onChange={handleChange}
                className='w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:ring-0 focus:border-slate-950 dark:focus:border-white transition-all font-bold placeholder:text-slate-200 dark:placeholder:text-slate-800'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-[0.4em] hover:translate-y-[-2px] active:scale-95 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 mt-4'
            >
              {loading ? (
                <><Spinner size='sm' /><span>Validating Payload...</span></>
              ) : (
                <>Establish Account <span className='opacity-30'>→</span></>
              )}
            </button>
          </form>

          {errorMessage && <Alert className='mt-6' color='failure'>{errorMessage}</Alert>}

          <footer className='pt-10 border-t border-slate-50 dark:border-slate-900 text-center space-y-4'>
            <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
              Already a member?{' '}
              <Link to='/sign-in' className='text-slate-950 dark:text-white hover:underline underline-offset-4'>Sign In Here</Link>
            </p>
            <p className='text-[8px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-700 leading-relaxed max-w-[200px] mx-auto'>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
