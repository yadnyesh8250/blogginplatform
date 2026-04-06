import { Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { api } from '../utils/api.config';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill out all fields.'));
    }
    try {
      dispatch(signInStart());
      const res = await api('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(signInFailure(data.message)); return; }
      if (res.ok) { dispatch(signInSuccess(data)); navigate('/'); }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex bg-white dark:bg-slate-950'>
      {/* Left panel — Institutional Branding */}
      <div className='hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden bg-slate-950 dark:bg-black p-16 border-r border-slate-900'>
        <div className='absolute inset-0 opacity-5 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
        
        <div className='relative z-10 text-center text-white max-w-md space-y-12'>
          <Link to='/' className='inline-flex items-center gap-4 mb-8 group'>
            <div className='w-12 h-12 bg-white rounded flex items-center justify-center text-slate-950 text-xl font-black transition-transform group-hover:-rotate-6'>B</div>
            <span className='text-3xl font-black tracking-tighter uppercase'>Blogify<span className='text-slate-500 font-normal'>.</span></span>
          </Link>
          
          <div className='space-y-6'>
            <h1 className='text-5xl font-black leading-[0.95] tracking-tighter uppercase'>
               Institutional <span className='text-slate-600 italic font-serif lowercase tracking-normal'>access.</span>
            </h1>
            <p className='text-slate-400 text-lg leading-relaxed font-bold tracking-tight italic'>
              Secure entry for the modern storyteller. Access your professional dashboard and digital archives.
            </p>
          </div>

          <div className='pt-12 flex justify-center'>
            <p className='text-slate-400 text-lg leading-relaxed font-bold tracking-tight italic max-w-md'>
              Welcome back to your creative sanctuary.
            </p>
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
            <h2 className='text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter'>Sign In</h2>
            <p className='text-slate-400 text-xs font-black uppercase tracking-widest'>Encryption active / Welcome back</p>
          </header>

          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='group'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-slate-950 dark:group-focus-within:text-white transition-colors'>Identifier (Username)</label>
              <input
                type='text'
                id='email'
                placeholder='your_username'
                onChange={handleChange}
                className='w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:ring-0 focus:border-slate-950 dark:focus:border-white transition-all font-bold placeholder:text-slate-200 dark:placeholder:text-slate-800'
              />
            </div>
            <div className='group'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-slate-950 dark:group-focus-within:text-white transition-colors'>Security Key (Password)</label>
              <input
                type='password'
                id='password'
                placeholder='••••••••'
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
                <><Spinner size='sm' /><span>Validating...</span></>
              ) : (
                <>Access Account <span className='opacity-30'>→</span></>
              )}
            </button>
          </form>

          {errorMessage && <Alert className='mt-6' color='failure'>{errorMessage}</Alert>}

          <footer className='pt-10 border-t border-slate-50 dark:border-slate-900 text-center space-y-4'>
            <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
              New here?{' '}
              <Link to='/sign-up' className='text-slate-950 dark:text-white hover:underline underline-offset-4'>Create an Account</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
